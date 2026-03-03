'use server';

import { db } from '@/db';
import { inventory, products } from "@/db";
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Restock Truck Inventory
 * Used by managers or staff when returning to the warehouse.
 */
export async function restockInventory(staffId: number, items: { productId: number; quantity: number }[]) {
  try {
    for (const item of items) {
      // Check if inventory record exists
      const [existing] = await db.select()
        .from(inventory)
        .where(and(eq(inventory.staffId, staffId), eq(inventory.productId, item.productId)));

      if (existing) {
        await db.update(inventory)
          .set({ 
            quantityOnHand: existing.quantityOnHand + item.quantity,
            lastUpdated: new Date()
          })
          .where(eq(inventory.id, existing.id));
      } else {
        // Create new inventory slot
        await db.insert(inventory).values({
          staffId,
          productId: item.productId,
          quantityOnHand: item.quantity,
        });
      }
    }

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Restock Error:', error);
    return { success: false, error: 'Failed to restock' };
  }
}