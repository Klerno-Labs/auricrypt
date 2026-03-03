import { z } from 'zod';

/**
 * Shared Validations
 */
export const paramsSchema = z.object({
  id: z.coerce.number(),
});

/**
 * User Validations
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['owner', 'manager', 'staff']),
  phoneNumber: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.number(),
});

/**
 * Customer Validations
 */
export const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string().length(2),
  zipCode: z.string(),
  notes: z.string().optional(),
});

/**
 * Job Validations
 */
export const createJobSchema = z.object({
  customerId: z.number(),
  staffId: z.number(),
  title: z.string().min(5),
  description: z.string().optional(),
  scheduledStart: z.coerce.date(), // Accepts string ISO
  scheduledEnd: z.coerce.date(),
});

export const updateJobStatusSchema = z.object({
  status: z.enum(['scheduled', 'en_route', 'in_progress', 'completed', 'cancelled']),
});

/**
 * Invoice Validations
 */
export const invoiceItemSchema = z.object({
  productId: z.number().optional(),
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.coerce.number().positive(),
});

export const createInvoiceSchema = z.object({
  jobId: z.number(),
  customerId: z.number(),
  items: z.array(invoiceItemSchema).min(1),
  taxRate: z.coerce.number().default(0),
  notes: z.string().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']),
});

/**
 * Inventory Validations
 */
export const updateInventorySchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantityChange: z.number().int(), // Positive for add, Negative for remove
  }))
});