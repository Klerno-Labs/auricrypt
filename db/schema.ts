import { pgTable, serial, text, timestamp, decimal, boolean, integer, index } from "drizzle-orm/pg-core";
import { users } from "./schema"; // Self-reference logic handled in export

export const roleEnum = pgTable("role_enum", {
  name: text("name").notNull().primaryKey(), // 'owner', 'manager', 'staff'
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"), // Nullable for Google Auth
  role: text("role").notNull().$type<"owner" | "manager" | "staff">().default("staff"),
  truckId: integer("truck_id"), // Link to truck if staff
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
}));

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().$type<"scheduled" | "in-progress" | "completed" | "cancelled">().default("scheduled"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // 'ft', 'piece', 'box'
  active: boolean("active").default(true).notNull(),
});

export const trucks = pgTable("trucks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Truck 1", "Van 2"
  licensePlate: text("license_plate").notNull(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  truckId: integer("truck_id").notNull().references(() => trucks.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  truckProductIdx: index("truck_product_idx").on(table.truckId, table.productId),
}));

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  staffId: integer("staff_id").notNull().references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().$type<"draft" | "paid" | "refunded">().default("draft"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  productId: integer("product_id").references(() => products.id),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});