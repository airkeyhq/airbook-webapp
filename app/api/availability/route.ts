import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, schedules, staff } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '18:00';
const SLOT_STEP_MINUTES = 30;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const workspaceId = searchParams.get('workspaceId');
    const dateStr = searchParams.get('dateStr');
    const durationMinutes = Number(searchParams.get('durationMinutes') || 45);

    if (!dateStr || (!staffId && !workspaceId)) {
      return NextResponse.json({ error: 'dateStr and either staffId or workspaceId are required.' }, { status: 400 });
    }

    const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay();
    const now = new Date();
    const isToday = dateStr === now.toISOString().slice(0, 10);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper to compute slots for a single staff member
    async function getStaffSlots(targetStaffId: string) {
      const [schedule] = await db
        .select()
        .from(schedules)
        .where(and(eq(schedules.staffId, targetStaffId), eq(schedules.dayOfWeek, dayOfWeek)));

      if (schedule && !schedule.isWorkingDay) {
        return [];
      }

      const openMinutes = toMinutes(schedule?.startTime || DEFAULT_OPEN);
      const closeMinutes = toMinutes(schedule?.endTime || DEFAULT_CLOSE);

      const existing = await db
        .select({ startTime: appointments.startTime, endTime: appointments.endTime })
        .from(appointments)
        .where(
          and(
            eq(appointments.staffId, targetStaffId),
            eq(appointments.dateStr, dateStr!),
            eq(appointments.status, 'confirmed')
          )
        );

      const busyRanges = existing.map((a) => ({
        start: toMinutes(a.startTime),
        end: toMinutes(a.endTime || a.startTime),
      }));

      const slots: string[] = [];
      for (let start = openMinutes; start + durationMinutes <= closeMinutes; start += SLOT_STEP_MINUTES) {
        const end = start + durationMinutes;
        if (isToday && start <= nowMinutes) continue;
        const overlaps = busyRanges.some((b) => start < b.end && end > b.start);
        if (!overlaps) slots.push(toHHMM(start));
      }
      return slots;
    }

    if (staffId && staffId !== 'anyone') {
      const slots = await getStaffSlots(staffId);
      return NextResponse.json({ success: true, slots });
    }

    // "Anyone available" - compute union across active staff
    let targetStaffList: { id: string }[] = [];
    if (workspaceId) {
      targetStaffList = await db
        .select({ id: staff.id })
        .from(staff)
        .where(and(eq(staff.workspaceId, workspaceId as any), eq(staff.isActive, true)));
    } else {
      targetStaffList = await db
        .select({ id: staff.id })
        .from(staff)
        .where(eq(staff.isActive, true))
        .limit(20);
    }

    if (targetStaffList.length === 0) {
      return NextResponse.json({ success: true, slots: [] });
    }

    const allStaffSlots = await Promise.all(targetStaffList.map((s) => getStaffSlots(s.id)));
    const unionSlots = Array.from(new Set(allStaffSlots.flat())).sort((a, b) => toMinutes(a) - toMinutes(b));

    return NextResponse.json({ success: true, slots: unionSlots });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to compute availability.' }, { status: 500 });
  }
}
