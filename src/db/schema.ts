import { pgTable, serial, text, timestamp, decimal, integer, boolean, pgEnum, index, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

/**
 * ENUMERATIONS
 */
export const userRoleEnum = pgEnum('user_role', ['owner', 'manager', 'staff']);
export const jobStatusEnum = pgEnum('job_status', ['scheduled', 'en_route', 'in_progress', 'completed', 'cancelled']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'void']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded']);

/**
 * USERS & AUTH
 * Represents staff and management.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(), // bcrypt hash
  role: userRoleEnum('role').notNull().default('staff'),
  phoneNumber: text('phone_number'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

/**
 * CUSTOMERS
 * Clients receiving plumbing services.
 */
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  notes: text('notes'), // Gate codes, special instructions
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * PRODUCTS / SERVICES CATALOG
 * Master list of items that can be billed or tracked.
 */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').unique().notNull(),
  description: text('description'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  unitType: text('unit_type').notNull(), // 'each', 'box', 'hour', 'ft'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * TRUCK INVENTORY
 * Tracks what specific items are on a specific staff member's truck.
 */
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  staffId: integer('staff_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  quantityOnHand: integer('quantity_on_hand').notNull().default(0),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
}, (table) => ({
  staffProductIdx: index('inventory_staff_product_idx').on(table.staffId, table.productId),
}));

/**
 * INVENTORY LOGS
 * Audit trail for inventory usage (deductions and restocks).
 */
export const inventoryLogs = pgTable('inventory_logs', {
  id: serial('id').primaryKey(),
  inventoryId: integer('inventory_id').notNull().references(() => inventory.id),
  jobId: integer('job_id').references(() => jobs.id),
  quantityChange: integer('quantity_change').notNull(), // Negative for usage, positive for restock
  reason: text('reason').notNull(), // 'job_usage', 'restock', 'adjustment'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * JOBS
 * Appointments and work orders.
 */
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  staffId: integer('staff_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  scheduledStart: timestamp('scheduled_start').notNull(),
  scheduledEnd: timestamp('scheduled_end').notNull(),
  status: jobStatusEnum('status').notNull().default('scheduled'),
  locationNotes: text('location_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  staffDateIdx: index('jobs_staff_date_idx').on(table.staffId, table.scheduledStart),
}));

/**
 * INVOICES
 * Billing documents associated with jobs.
 */
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  invoiceNumber: text('invoice_number').notNull().unique(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull().default('0.00'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * INVOICE ITEMS
 * Line items for an invoice.
 */
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal('line_total', { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  invoiceIdx: index('invoice_items_invoice_idx').on(table.invoiceId),
}));

/**
 * PAYMENTS
 * Transaction records (Stripe).
 */
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  paymentIntentId: text('payment_intent_id').unique(), // Stripe ID
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('usd'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  paymentMethod: text('payment_method'), // 'card', 'cash', 'check'
  receiptUrl: text('receipt_url'),
  failureReason: text('failure_reason'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * RELATIONS
 */
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  inventory: many(inventory),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  jobs: many(jobs),
  invoices: many(invoices),
}));

export const productsRelations = relations(products, ({ many }) => ({
  inventory: many(inventory),
  invoiceItems: many(invoiceItems),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  staff: one(users, {
    fields: [inventory.staffId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  logs: many(inventoryLogs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  customer: one(customers, {
    fields: [jobs.customerId],
    references: [customers.id],
  }),
  staff: one(users, {
    fields: [jobs.staffId],
    references: [users.id],
  }),
  invoice: one(invoices, {
    fields: [jobs.id],
    references: [invoices.jobId],
  }),
  inventoryLogs: many(inventoryLogs),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  job: one(jobs, {
    fields: [invoices.jobId],
    references: [jobs.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));