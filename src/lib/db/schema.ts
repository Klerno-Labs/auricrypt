import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['owner', 'manager', 'staff']);
export const jobStatusEnum = pgEnum('job_status', ['scheduled', 'in-progress', 'completed', 'cancelled']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'pending', 'paid', 'refunded']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  address: text('address').notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  estimatedDuration: integer('estimated_duration').notNull(),
  status: jobStatusEnum('status').notNull(),
  assignedStaffId: text('assigned_staff_id').notNull().references(() => users.id),
  notes: text('notes'),
  price: decimal('price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }).notNull(),
  sellPrice: decimal('sell_price', { precision: 10, scale: 2 }).notNull(),
  stockOnHand: integer('stock_on_hand').notNull(),
  truckId: text('truck_id').notNull(),
  lowStockThreshold: integer('low_stock_threshold').notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull().references(() => jobs.id),
  customerId: text('customer_id').notNull(),
  customerEmail: text('customer_email').notNull(),
  items: text('items').notNull(), // Stored as JSON string
  laborCharge: decimal('labor_charge', { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 4 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  paidAt: timestamp('paid_at'),
  paymentMethod: text('payment_method'),
});