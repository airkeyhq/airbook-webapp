import { pgTable, text, integer, boolean, timestamp, uuid, decimal, varchar, jsonb } from 'drizzle-orm/pg-core';

// =============================================================================
// MODULE 0: AUTHENTICATION & MULTI-TENANCY (BETTER AUTH)
// =============================================================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').default('member').notNull(), // 'owner' | 'manager' | 'staff' | 'receptionist'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  email: text('email').notNull(),
  role: text('role').default('member').notNull(),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

// =============================================================================
// MODULE 1: CALENDAR & SCHEDULING ENGINE (RESOURCES & WAITLISTS)
// =============================================================================

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  brandColor: varchar('brand_color', { length: 20 }).default('#007AFF').notNull(),
  logoUrl: text('logo_url'),
  cancellationNoticeHours: integer('cancellation_notice_hours').default(24).notNull(),
  depositRequiredPercent: integer('deposit_required_percent').default(20).notNull(),
  plan: varchar('plan', { length: 20 }).default('free').notNull(),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeAccountId: text('stripe_account_id'),
  stripeChargesEnabled: boolean('stripe_charges_enabled').default(false).notNull(),
  stripePayoutsEnabled: boolean('stripe_payouts_enabled').default(false).notNull(),
  stripeDetailsSubmitted: boolean('stripe_details_submitted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Equipment & Rooms Mapping
export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(), // e.g., "Massage Room 1", "Laser Machine B"
  type: varchar('type', { length: 50 }).notNull(), // 'room' | 'equipment'
  isAvailable: boolean('is_available').default(true).notNull(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  resourceId: uuid('resource_id').references(() => resources.id),
  name: text('name').notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  priceCents: integer('price_cents').notNull(),
  depositCents: integer('deposit_cents').default(0).notNull(),
  colorTag: varchar('color_tag', { length: 20 }).default('#007AFF').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 30 }),
  role: varchar('role', { length: 50 }).default('Stylist').notNull(),
  avatarEmoji: varchar('avatar_emoji', { length: 10 }).default('👨🏻‍🎨').notNull(),
  avatarUrl: text('avatar_url'),
  commissionPercent: integer('commission_percent').default(70).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const schedules = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  staffId: uuid('staff_id').references(() => staff.id, { onDelete: 'cascade' }).notNull(),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  isWorkingDay: boolean('is_working_day').default(true).notNull(),
});

export const waitlists = pgTable('waitlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  clientPhone: text('client_phone'),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  preferredDateStr: varchar('preferred_date_str', { length: 10 }).notNull(),
  status: varchar('status', { length: 20 }).default('waiting').notNull(), // 'waiting' | 'notified' | 'booked'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// MODULE 2: CLIENT CRM & UNIFIED INBOX & WALLET
// =============================================================================

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 30 }),
  avatarUrl: text('avatar_url'),
  totalVisits: integer('total_visits').default(0).notNull(),
  totalSpentCents: integer('total_spent_cents').default(0).notNull(),
  walletBalanceCents: integer('wallet_balance_cents').default(0).notNull(),
  noShowCount: integer('no_show_count').default(0).notNull(),
  notes: text('notes'),
  preferences: text('preferences'),
  allergies: text('allergies'),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  customSpecs: jsonb('custom_specs').$type<Array<{ id: string; label: string; value: string; date?: string }>>().default([]).notNull(),
  medicalWaiversSigned: boolean('medical_waivers_signed').default(false).notNull(),
  patchTestResults: text('patch_test_results'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const unified_messages = pgTable('unified_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  channel: varchar('channel', { length: 20 }).notNull(), // 'sms' | 'email' | 'whatsapp'
  direction: varchar('direction', { length: 10 }).notNull(), // 'inbound' | 'outbound'
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// MODULE 3: POS CHECKOUT, INVOICES & APPOINTMENTS
// =============================================================================

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  staffId: uuid('staff_id').references(() => staff.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  groupId: uuid('group_id'), // For Group Appointments
  dateStr: varchar('date_str', { length: 10 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  priceCents: integer('price_cents').notNull(),
  depositPaidCents: integer('deposit_paid_cents').default(0).notNull(),
  status: varchar('status', { length: 20 }).default('confirmed').notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  subtotalCents: integer('subtotal_cents').default(0).notNull(),
  tipCents: integer('tip_cents').default(0).notNull(),
  taxCents: integer('tax_cents').default(0).notNull(),
  discountCents: integer('discount_cents').default(0).notNull(),
  totalCents: integer('total_cents').notNull(),
  paymentMethod: varchar('payment_method', { length: 30 }).default('card').notNull(),
  receiptNumber: varchar('receipt_number', { length: 50 }),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'paid' | 'overdue'
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// MODULE 5: INVENTORY, PRODUCTS & E-COMMERCE
// =============================================================================

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  sku: varchar('sku', { length: 100 }),
  category: varchar('category', { length: 50 }).notNull(),
  retailPriceCents: integer('retail_price_cents').notNull(),
  costPriceCents: integer('cost_price_cents').default(0).notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  lowStockAlertThreshold: integer('low_stock_alert_threshold').default(5).notNull(),
  isRetail: boolean('is_retail').default(true).notNull(), // true = store front, false = back-bar internal use
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const purchase_orders = pgTable('purchase_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  supplierName: text('supplier_name').notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'ordered' | 'received'
  totalCostCents: integer('total_cost_cents').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================================================
// MODULE 6 & 7: MARKETING, LOYALTY, PACKAGES & MEMBERSHIPS
// =============================================================================

export const promotions = pgTable('promotions', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  discountPercent: integer('discount_percent').notNull(),
  maxUses: integer('max_uses').default(100).notNull(),
  currentUses: integer('current_uses').default(0).notNull(),
  expiresAt: timestamp('expires_at'),
});

export const memberships = pgTable('memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(), // e.g., "VIP Glow Monthly Pass"
  monthlyPriceCents: integer('monthly_price_cents').notNull(),
  includedServicesCount: integer('included_services_count').notNull(),
  discountPercentRetail: integer('discount_percent_retail').default(10).notNull(),
});

export const gift_cards = pgTable('gift_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  initialBalanceCents: integer('initial_balance_cents').notNull(),
  currentBalanceCents: integer('current_balance_cents').notNull(),
  recipientEmail: varchar('recipient_email', { length: 255 }),
  expiresAt: timestamp('expires_at'),
});

// =============================================================================
// MODULE 9: ANALYTICS & EXPENSES LEDGER
// =============================================================================

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'rent' | 'supplies' | 'payroll' | 'marketing'
  amountCents: integer('amount_cents').notNull(),
  description: text('description'),
  dateStr: varchar('date_str', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
