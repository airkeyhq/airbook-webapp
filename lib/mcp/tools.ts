import { db } from "@/db";
import { appointments, clients, services, staff, waitlists, products, workspaces } from "@/db/schema";
import { eq, and, gte, lte, ilike } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/workspace";
import { sendBookingNotifications, sendCancellationNotification, sendCustomNotification } from "@/lib/notifications";

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: any, context?: { workspaceId?: string }) => Promise<unknown>;
}

function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}`;
}

export const AIRBOOK_MCP_TOOLS: MCPToolDefinition[] = [
  // 1. LIST APPOINTMENTS
  {
    name: "airbook_list_appointments",
    description: "List appointments from the AirBook calendar for a specific date, date range, or staff member.",
    inputSchema: {
      type: "object",
      properties: {
        dateStr: { type: "string", description: "Single date in YYYY-MM-DD format (e.g. 2026-09-06)" },
        startDate: { type: "string", description: "Start date in YYYY-MM-DD format" },
        endDate: { type: "string", description: "End date in YYYY-MM-DD format" },
        staffId: { type: "string", description: "Optional UUID of the specialist to filter by" },
        status: { type: "string", enum: ["confirmed", "completed", "cancelled", "all"], description: "Appointment status filter (default: all)" },
      },
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const conditions = [eq(appointments.workspaceId, workspaceId)];

      if (args.dateStr) {
        conditions.push(eq(appointments.dateStr, args.dateStr));
      } else if (args.startDate && args.endDate) {
        conditions.push(gte(appointments.dateStr, args.startDate));
        conditions.push(lte(appointments.dateStr, args.endDate));
      }

      if (args.staffId) conditions.push(eq(appointments.staffId, args.staffId));
      if (args.status && args.status !== "all") conditions.push(eq(appointments.status, args.status));

      const rows = await db
        .select({
          id: appointments.id,
          dateStr: appointments.dateStr,
          startTime: appointments.startTime,
          endTime: appointments.endTime,
          durationMinutes: appointments.durationMinutes,
          priceCents: appointments.priceCents,
          status: appointments.status,
          paymentStatus: appointments.paymentStatus,
          notes: appointments.notes,
          client: {
            id: clients.id,
            name: clients.name,
            email: clients.email,
            phone: clients.phone,
          },
          service: {
            id: services.id,
            name: services.name,
            category: services.category,
          },
          staff: {
            id: staff.id,
            name: staff.name,
            role: staff.role,
          },
        })
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .leftJoin(staff, eq(appointments.staffId, staff.id))
        .where(and(...conditions))
        .orderBy(appointments.dateStr, appointments.startTime);

      return { count: rows.length, appointments: rows };
    },
  },

  // 2. CHECK AVAILABILITY
  {
    name: "airbook_check_availability",
    description: "Check available time slots for a specialist or service on a specific date.",
    inputSchema: {
      type: "object",
      properties: {
        dateStr: { type: "string", description: "Date in YYYY-MM-DD format (e.g. 2026-09-07)" },
        serviceId: { type: "string", description: "Service UUID to calculate required duration" },
        staffId: { type: "string", description: "Optional specific specialist UUID" },
      },
      required: ["dateStr"],
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const allStaff = await db.select().from(staff).where(and(eq(staff.workspaceId, workspaceId), eq(staff.isActive, true)));
      
      const targetStaff = args.staffId ? allStaff.filter(s => s.id === args.staffId) : allStaff;
      if (targetStaff.length === 0) return { availableSlots: [], message: "No active staff found for this criteria" };

      const existingBookings = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.workspaceId, workspaceId),
            eq(appointments.dateStr, args.dateStr),
            eq(appointments.status, "confirmed")
          )
        );

      const operatingHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
      const availabilityByStaff: Record<string, string[]> = {};

      for (const member of targetStaff) {
        const bookedTimes = new Set(existingBookings.filter(b => b.staffId === member.id).map(b => b.startTime));
        availabilityByStaff[member.name] = operatingHours.filter(slot => !bookedTimes.has(slot));
      }

      return {
        dateStr: args.dateStr,
        availability: availabilityByStaff,
      };
    },
  },

  // 3. CREATE BOOKING
  {
    name: "airbook_create_booking",
    description: "Autonomously create a confirmed salon appointment for a client with automatic Novu notifications.",
    inputSchema: {
      type: "object",
      properties: {
        clientName: { type: "string", description: "Full name of the client" },
        clientEmail: { type: "string", description: "Client email address" },
        clientPhone: { type: "string", description: "Client phone number (e.g. +15551234567)" },
        serviceId: { type: "string", description: "UUID of the service" },
        staffId: { type: "string", description: "UUID of the specialist" },
        dateStr: { type: "string", description: "Date in YYYY-MM-DD format" },
        startTime: { type: "string", description: "Start time in HH:MM format (e.g. 14:00)" },
        durationMinutes: { type: "number", description: "Duration in minutes (default: 45)" },
        notes: { type: "string", description: "Optional booking notes or formulas" },
      },
      required: ["clientName", "dateStr", "startTime"],
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      let [selectedService] = args.serviceId
        ? await db.select().from(services).where(eq(services.id, args.serviceId)).limit(1)
        : await db.select().from(services).where(eq(services.workspaceId, workspaceId)).limit(1);

      let [selectedStaff] = args.staffId
        ? await db.select().from(staff).where(eq(staff.id, args.staffId)).limit(1)
        : await db.select().from(staff).where(eq(staff.workspaceId, workspaceId)).limit(1);

      if (!selectedService || !selectedStaff) {
        throw new Error("Valid service and specialist could not be resolved for this workspace.");
      }

      const duration = args.durationMinutes || selectedService.durationMinutes || 45;
      const endTime = addMinutesToTime(args.startTime, duration);

      // Conflict check
      const [conflict] = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.staffId, selectedStaff.id),
            eq(appointments.dateStr, args.dateStr),
            eq(appointments.startTime, args.startTime),
            eq(appointments.status, "confirmed")
          )
        )
        .limit(1);

      if (conflict) {
        return { success: false, error: "SLOT_ALREADY_BOOKED", message: `Slot ${args.startTime} is already taken for ${selectedStaff.name}.` };
      }

      // Create or find client
      let clientRecord;
      if (args.clientEmail) {
        const [existing] = await db.select().from(clients).where(and(eq(clients.workspaceId, workspaceId), eq(clients.email, args.clientEmail))).limit(1);
        clientRecord = existing;
      }

      if (!clientRecord) {
        const [newClient] = await db
          .insert(clients)
          .values({
            workspaceId,
            name: args.clientName,
            email: args.clientEmail || null,
            phone: args.clientPhone || null,
            totalVisits: 1,
          })
          .returning();
        clientRecord = newClient;
      }

      const [newAppointment] = await db
        .insert(appointments)
        .values({
          workspaceId,
          clientId: clientRecord.id,
          staffId: selectedStaff.id,
          serviceId: selectedService.id,
          dateStr: args.dateStr,
          startTime: args.startTime,
          endTime,
          durationMinutes: duration,
          priceCents: selectedService.priceCents || 7500,
          status: "confirmed",
          paymentStatus: "pending",
          notes: args.notes || "Booked via AirBook Agent",
        })
        .returning();

      // Trigger Novu Notification
      sendBookingNotifications({
        subscriberId: args.clientEmail || args.clientPhone || `sub_${clientRecord.id}`,
        clientName: args.clientName,
        clientEmail: args.clientEmail,
        clientPhone: args.clientPhone,
        serviceName: selectedService.name,
        staffName: selectedStaff.name,
        dateStr: args.dateStr,
        startTime: args.startTime,
        price: (selectedService.priceCents || 7500) / 100,
      }).catch((e) => console.warn("MCP booking notification trigger error:", e));

      return {
        success: true,
        appointmentId: newAppointment.id,
        appointment: {
          id: newAppointment.id,
          clientName: args.clientName,
          specialist: selectedStaff.name,
          service: selectedService.name,
          dateStr: args.dateStr,
          startTime: args.startTime,
          endTime,
          status: "confirmed",
        },
      };
    },
  },

  // 4. UPDATE / CANCEL APPOINTMENT
  {
    name: "airbook_update_appointment",
    description: "Reschedule, update notes, or cancel an appointment with automatic cancellation alerts.",
    inputSchema: {
      type: "object",
      properties: {
        appointmentId: { type: "string", description: "UUID of the appointment" },
        status: { type: "string", enum: ["confirmed", "completed", "cancelled"], description: "New appointment status" },
        dateStr: { type: "string", description: "New date in YYYY-MM-DD if rescheduling" },
        startTime: { type: "string", description: "New start time in HH:MM if rescheduling" },
        notes: { type: "string", description: "Updated appointment notes" },
      },
      required: ["appointmentId"],
    },
    handler: async (args) => {
      const updateData: Record<string, any> = {};
      if (args.status) updateData.status = args.status;
      if (args.dateStr) updateData.dateStr = args.dateStr;
      if (args.startTime) updateData.startTime = args.startTime;
      if (args.notes !== undefined) updateData.notes = args.notes;

      const [updated] = await db
        .update(appointments)
        .set(updateData)
        .where(eq(appointments.id, args.appointmentId))
        .returning();

      if (!updated) return { success: false, error: "Appointment not found." };

      if (args.status === "cancelled") {
        const [details] = await db
          .select({
            clientName: clients.name,
            clientEmail: clients.email,
            clientPhone: clients.phone,
            serviceName: services.name,
            staffName: staff.name,
          })
          .from(appointments)
          .leftJoin(clients, eq(appointments.clientId, clients.id))
          .leftJoin(services, eq(appointments.serviceId, services.id))
          .leftJoin(staff, eq(appointments.staffId, staff.id))
          .where(eq(appointments.id, args.appointmentId))
          .limit(1);

        if (details) {
          sendCancellationNotification({
            subscriberId: details.clientEmail || details.clientPhone || `sub_${updated.clientId}`,
            clientName: details.clientName || "Client",
            clientEmail: details.clientEmail || undefined,
            clientPhone: details.clientPhone || undefined,
            serviceName: details.serviceName || "Service",
            staffName: details.staffName || "Specialist",
            dateStr: updated.dateStr,
            startTime: updated.startTime,
            reason: args.notes || "Cancelled by AI agent",
          }).catch((e) => console.warn("MCP cancellation trigger error:", e));
        }
      }

      return { success: true, appointment: updated };
    },
  },

  // 5. LIST SERVICES
  {
    name: "airbook_list_services",
    description: "Retrieve the active catalog of salon/spa services, prices, durations, and categories.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional category filter (e.g. Hair & Styling, Facials)" },
      },
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const conditions = [eq(services.workspaceId, workspaceId), eq(services.isActive, true)];
      if (args.category) conditions.push(eq(services.category, args.category));

      const rows = await db.select().from(services).where(and(...conditions)).orderBy(services.category, services.name);
      return {
        count: rows.length,
        services: rows.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          durationMinutes: s.durationMinutes,
          price: `$${(s.priceCents / 100).toFixed(2)}`,
          deposit: s.depositCents ? `$${(s.depositCents / 100).toFixed(2)}` : "$0",
        })),
      };
    },
  },

  // 6. LIST STAFF
  {
    name: "airbook_list_staff",
    description: "List all specialists, stylists, master barbers, and staff in the workspace.",
    inputSchema: { type: "object", properties: {} },
    handler: async (_, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const rows = await db.select().from(staff).where(eq(staff.workspaceId, workspaceId)).orderBy(staff.name);
      return {
        count: rows.length,
        staff: rows.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role,
          commissionPercent: s.commissionPercent,
          isActive: s.isActive,
        })),
      };
    },
  },

  // 7. MANAGE CLIENTS
  {
    name: "airbook_manage_clients",
    description: "Search clients by name, email, or phone, view formulas, visit history, or register a new client.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["search", "create", "update_notes"], description: "Action to perform" },
        query: { type: "string", description: "Search term for name/email/phone" },
        name: { type: "string", description: "Client name (for create)" },
        email: { type: "string", description: "Client email" },
        phone: { type: "string", description: "Client phone" },
        clientId: { type: "string", description: "Client UUID (for update_notes)" },
        notes: { type: "string", description: "Formulas, allergy warnings, or styling preferences" },
      },
      required: ["action"],
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);

      if (args.action === "search") {
        const q = args.query ? `%${args.query}%` : "%";
        const rows = await db
          .select()
          .from(clients)
          .where(and(eq(clients.workspaceId, workspaceId), ilike(clients.name, q)))
          .limit(20);
        return { count: rows.length, clients: rows };
      }

      if (args.action === "create") {
        if (!args.name) throw new Error("Client name is required.");
        const [newClient] = await db
          .insert(clients)
          .values({
            workspaceId,
            name: args.name,
            email: args.email || null,
            phone: args.phone || null,
            notes: args.notes || null,
            totalVisits: 0,
          })
          .returning();
        return { success: true, client: newClient };
      }

      if (args.action === "update_notes") {
        if (!args.clientId) throw new Error("clientId is required to update notes.");
        const [updated] = await db
          .update(clients)
          .set({ notes: args.notes })
          .where(eq(clients.id, args.clientId))
          .returning();
        return { success: true, client: updated };
      }

      throw new Error(`Unknown action: ${args.action}`);
    },
  },

  // 8. MANAGE WAITLIST & WALK-INS
  {
    name: "airbook_manage_waitlist",
    description: "Add a walk-in guest to the queue, check waitlist status, or send the Ready for Chair SMS alert.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "add", "call_ready", "remove"], description: "Waitlist action" },
        clientName: { type: "string", description: "Name of walk-in client" },
        clientPhone: { type: "string", description: "Phone number for SMS alert" },
        serviceName: { type: "string", description: "Requested service name" },
        waitlistId: { type: "string", description: "UUID of waitlist item (for call_ready or remove)" },
      },
      required: ["action"],
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);

      if (args.action === "list") {
        const list = await db
          .select()
          .from(waitlists)
          .where(and(eq(waitlists.workspaceId, workspaceId), eq(waitlists.status, "waiting")))
          .orderBy(waitlists.createdAt);
        return { count: list.length, queue: list };
      }

      if (args.action === "add") {
        if (!args.clientName) throw new Error("clientName is required.");
        const [entry] = await db
          .insert(waitlists)
          .values({
            workspaceId,
            clientName: args.clientName,
            clientPhone: args.clientPhone || null,
            serviceName: args.serviceName || "Quick Walk-In",
            status: "waiting",
          })
          .returning();
        return { success: true, entry };
      }

      if (args.action === "call_ready") {
        if (!args.waitlistId) throw new Error("waitlistId is required.");
        const [entry] = await db.select().from(waitlists).where(eq(waitlists.id, args.waitlistId)).limit(1);
        if (!entry) return { success: false, error: "Waitlist entry not found." };

        if (entry.clientPhone) {
          await sendCustomNotification({
            type: "sms",
            recipient: entry.clientPhone,
            title: "Your Specialist is Ready",
            message: `Hi ${entry.clientName}! Your specialist at AirBook is ready for you now. Please make your way to the chair.`,
          });
        }

        await db.update(waitlists).set({ status: "called" }).where(eq(waitlists.id, args.waitlistId));
        return { success: true, message: `Called ${entry.clientName} via SMS alert.` };
      }

      if (args.action === "remove") {
        if (!args.waitlistId) throw new Error("waitlistId is required.");
        await db.delete(waitlists).where(eq(waitlists.id, args.waitlistId));
        return { success: true, message: "Removed from waitlist." };
      }

      throw new Error(`Unknown action: ${args.action}`);
    },
  },

  // 9. MANAGE INVENTORY
  {
    name: "airbook_manage_inventory",
    description: "Check stock levels, find low-stock products, or update inventory quantities.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "low_stock", "update_quantity"], description: "Inventory action" },
        productId: { type: "string", description: "Product UUID" },
        quantityChange: { type: "number", description: "Delta to add/subtract (e.g. +5 or -1)" },
        setQuantity: { type: "number", description: "Exact quantity to set" },
      },
      required: ["action"],
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);

      if (args.action === "list" || args.action === "low_stock") {
        const rows = await db.select().from(products).where(eq(products.workspaceId, workspaceId)).orderBy(products.name);
        const filtered = args.action === "low_stock"
          ? rows.filter(p => p.stockQuantity <= p.lowStockAlertThreshold)
          : rows;

        return {
          count: filtered.length,
          products: filtered.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            category: p.category,
            stockQuantity: p.stockQuantity,
            lowStockThreshold: p.lowStockAlertThreshold,
            isLowStock: p.stockQuantity <= p.lowStockAlertThreshold,
            retailPrice: `$${(p.retailPriceCents / 100).toFixed(2)}`,
          })),
        };
      }

      if (args.action === "update_quantity") {
        if (!args.productId) throw new Error("productId is required.");
        const [prod] = await db.select().from(products).where(eq(products.id, args.productId)).limit(1);
        if (!prod) return { success: false, error: "Product not found." };

        const newQuantity = args.setQuantity !== undefined
          ? args.setQuantity
          : Math.max(0, prod.stockQuantity + (args.quantityChange || 0));

        const [updated] = await db
          .update(products)
          .set({ stockQuantity: newQuantity })
          .where(eq(products.id, args.productId))
          .returning();

        return { success: true, product: updated };
      }

      throw new Error(`Unknown action: ${args.action}`);
    },
  },

  // 10. DISPATCH NOTIFICATION
  {
    name: "airbook_dispatch_notification",
    description: "Dispatch custom multi-channel SMS or Email alert to a client or team member via Novu.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["sms", "email"], description: "Channel to send" },
        recipient: { type: "string", description: "Destination phone (+1...) or email" },
        message: { type: "string", description: "Message body" },
        title: { type: "string", description: "Optional subject or title" },
      },
      required: ["type", "recipient", "message"],
    },
    handler: async (args) => {
      const res = await sendCustomNotification({
        type: args.type,
        recipient: args.recipient,
        message: args.message,
        title: args.title,
      });
      return { success: true, result: res };
    },
  },

  // 11. GET ANALYTICS
  {
    name: "airbook_get_analytics",
    description: "Fetch executive metrics, today revenue, total bookings count, and top-performing specialists.",
    inputSchema: {
      type: "object",
      properties: {
        dateStr: { type: "string", description: "Date in YYYY-MM-DD (defaults to today)" },
      },
    },
    handler: async (args, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const targetDate = args.dateStr || new Date().toISOString().split("T")[0];

      const dayBookings = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.workspaceId, workspaceId),
            eq(appointments.dateStr, targetDate)
          )
        );

      const confirmedBookings = dayBookings.filter(b => b.status === "confirmed" || b.status === "completed");
      const totalRevenueCents = confirmedBookings.reduce((sum, b) => sum + (b.priceCents || 0), 0);

      const allStaff = await db.select().from(staff).where(eq(staff.workspaceId, workspaceId));

      return {
        dateStr: targetDate,
        totalAppointments: dayBookings.length,
        confirmedAppointments: confirmedBookings.length,
        cancelledAppointments: dayBookings.filter(b => b.status === "cancelled").length,
        totalRevenue: `$${(totalRevenueCents / 100).toFixed(2)}`,
        activeSpecialistsCount: allStaff.length,
      };
    },
  },

  // 12. GET WORKSPACE INFO
  {
    name: "airbook_get_workspace_info",
    description: "Retrieve salon profile, brand name, currency, address, and cancellation policy settings.",
    inputSchema: { type: "object", properties: {} },
    handler: async (_, context) => {
      const workspaceId = await getActiveWorkspaceId(context?.workspaceId);
      const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
      if (!ws) return { error: "Workspace not found." };

      return {
        workspaceId: ws.id,
        name: ws.name,
        slug: ws.slug,
        phone: ws.phone,
        email: ws.email,
        address: ws.address,
        currency: ws.currency,
        brandColor: ws.brandColor,
        cancellationNoticeHours: ws.cancellationNoticeHours,
        depositRequiredPercent: ws.depositRequiredPercent,
        bookingUrl: `https://getairbook.com/book/${ws.slug}`,
      };
    },
  },
];
