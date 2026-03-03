export type UserRole = "owner" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type JobStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  scheduledTime: Date;
  estimatedDuration: number; // in minutes
  status: JobStatus;
  assignedStaffId: string;
  notes?: string;
  price?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  costPrice: number;
  sellPrice: number;
  stockOnHand: number;
  truckId: string;
  lowStockThreshold: number;
}

export interface InvoiceItem {
  inventoryId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "refunded";

export interface Invoice {
  id: string;
  jobId: string;
  customerId: string;
  customerEmail: string;
  items: InvoiceItem[];
  laborCharge: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  createdAt: Date;
  paidAt?: Date;
  paymentMethod?: "stripe" | "square" | "cash" | "check";
}