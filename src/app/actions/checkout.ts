'use server';

import { db } from '@/db';
import { inventory, inventoryLogs, jobs } from "@/db";
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CheckoutInventorySchema = z.object({
  inventoryId: z.number(),
  quantity: z.number().int().positive(),
  productId: z.number(),
});

/**
 * Server Action: Complete Job & Deduct Inventory
 * 
 * This is called when a plumber marks a job as done.
 * It ensures the truck inventory is decremented immediately.
 */
export async function completeJobAndDeductInventory(
  jobId: number,
  itemsUsed: z.infer<typeof CheckoutInventorySchema>[]
) {
  try {
    // Start a transaction block conceptually (Drizzle supports transactions via db.transaction())
    
    // 1. Update Job Status
    await db.update(jobs)
      .set({ status: 'completed' })
      .where(eq(jobs.id, jobId));

    // 2. Log and Deduct Inventory
    for (const item of itemsUsed) {
      // Insert Log
      await db.insert(inventoryLogs).values({
        inventoryId: item.inventoryId,
        jobId: jobId,
        quantityChange: -item.quantity,
        reason: 'job_usage',
      });

      // Decrement Physical Count
      await db.update(inventory)
        .set({ 
          quantityOnHand: sql`${inventory.quantityOnHand} - ${item.quantity}`,
          lastUpdated: new Date()
        })
        .where(eq(inventory.id, item.inventoryId));
    }

    revalidatePath('/dashboard');
    revalidatePath('/jobs');
    
    return { success: true, message: 'Job completed and inventory updated.' };

  } catch (error: any) {
    console.error('Checkout Action Error:', error);
    return { success: false, error: 'Failed to complete job.' };
  }
}