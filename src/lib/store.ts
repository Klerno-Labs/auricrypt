import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Job, InventoryItem, Invoice } from "@/types";

interface AppState {
  currentUser: User | null;
  jobs: Job[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  
  // Actions
  setUser: (user: User | null) => void;
  updateJobStatus: (jobId: string, status: Job["status"]) => void;
  updateInventory: (itemId: string, quantity: number) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice["status"]) => void;
}

// Mock Data for "Enterprise" demo functionality
const mockJobs: Job[] = [
  {
    id: "job-1",
    customerId: "cust-1",
    customerName: "Alice Johnson",
    address: "123 Maple Ave, Springfield",
    scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
    estimatedDuration: 120,
    status: "scheduled",
    assignedStaffId: "staff-1",
    notes: "Main bathroom leak.",
  },
  {
    id: "job-2",
    customerId: "cust-2",
    customerName: "Bob Smith",
    address: "456 Oak Ln, Shelbyville",
    scheduledTime: new Date(Date.now() - 7200000), // 2 hours ago
    estimatedDuration: 90,
    status: "in-progress",
    assignedStaffId: "staff-1",
    notes: "Water heater replacement.",
  },
];

const mockInventory: InventoryItem[] = [
  {
    id: "inv-1",
    sku: "PIPE-001",
    name: "1/2\" Copper Pipe (10ft)",
    costPrice: 15.0,
    sellPrice: 35.0,
    stockOnHand: 12,
    truckId: "truck-1",
    lowStockThreshold: 5,
  },
  {
    id: "inv-2",
    sku: "FIT-023",
    name: "PVC Elbow 90deg",
    costPrice: 0.5,
    sellPrice: 2.5,
    stockOnHand: 45,
    truckId: "truck-1",
    lowStockThreshold: 10,
  },
  {
    id: "inv-3",
    sku: "VALVE-99",
    name: "Shut-off Valve",
    costPrice: 4.0,
    sellPrice: 12.0,
    stockOnHand: 4, // Low stock
    truckId: "truck-1",
    lowStockThreshold: 5,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: {
        id: "staff-1",
        name: "Charlie Hatfield",
        email: "c.hatfield309@gmail.com",
        role: "owner",
      },
      jobs: mockJobs,
      inventory: mockInventory,
      invoices: [],

      setUser: (user) => set({ currentUser: user }),

      updateJobStatus: (jobId, status) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === jobId ? { ...job, status } : job
          ),
        })),

      updateInventory: (itemId, quantityChange) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === itemId
              ? { ...item, stockOnHand: Math.max(0, item.stockOnHand + quantityChange) }
              : item
          ),
        })),

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, invoice],
        })),

      updateInvoiceStatus: (invoiceId, status) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status, paidAt: status === 'paid' ? new Date() : inv.paidAt } : inv
          ),
        })),
    }),
    {
      name: "auricrypt-storage",
    }
  )
);