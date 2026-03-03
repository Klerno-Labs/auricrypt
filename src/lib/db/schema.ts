import { relations } from "drizzle-orm"
import { index, pgTable, serial, text, timestamp, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core"

export const roleEnum = ["owner", "manager", "staff"] as const
export type UserRole = typeof roleEnum[number]

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed
  role: text("role", { enum: roleEnum }).notNull().default("staff"),
  truckId: integer("truck_id").references(() => trucks.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const trucks = pgTable("truck", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Truck 1"
  licensePlate: text("license_plate"),
})

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  truckId: integer("truck_id").references(() => trucks.id),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  truckIdx: index("inventory_truck_idx").on(table.truckId),
}))

export const customers = pgTable("customer", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  stripeCustomerId: text("stripe_customer_id"),
})

export const jobs = pgTable("job", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  assignedToId: integer("assigned_to_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const invoices = pgTable("invoice", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"), // draft, paid, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  paidAt: timestamp("paid_at"),
})

export const invoiceItems = pgTable("invoice_item", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
  inventoryId: integer("inventory_id").references(() => inventory.id),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  truck: one(trucks, {
    fields: [users.truckId],
    references: [trucks.id],
  }),
}))