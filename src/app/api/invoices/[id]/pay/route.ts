import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, payments, jobs, inventoryLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Mock Stripe for Enterprise tier structure
// In production: import Stripe from 'stripe'; const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const payInvoiceSchema = z.object({
  paymentMethodId: z.string(), // Stripe Payment Method ID
  itemsUsed: z.array(z.object({
    inventoryId: z.number(),
    quantity: z.number(),
    productId: z.number(),
  }))
});

/**
 * POST /api/invoices/[id]/pay
 * Process payment and finalize inventory
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);
    const body = await req.json();
    const { paymentMethodId, itemsUsed } = payInvoiceSchema.parse(body);

    // 1. Fetch Invoice
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
    if (!invoice) return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });

    // 2. Mock Stripe Payment Intent Creation
    // const paymentIntent = await stripe.paymentIntents.create({...});
    const paymentIntentId = `pi_mock_${Date.now()}`;
    const isSuccessful = true; // Simulate success

    if (!isSuccessful) {
      return NextResponse.json({ success: false, error: 'Payment failed' }, { status: 400 });
    }

    // 3. Record Payment
    await db.insert(payments).values({
      invoiceId: invoice.id,
      paymentIntentId,
      amount: invoice.totalAmount,
      status: 'succeeded',
      paymentMethod: 'card',
      processedAt: new Date(),
    });

    // 4. Update Invoice Status
    await db.update(invoices)
      .set({ status: 'paid', paidAt: new Date() })
      .where(eq(invoices.id, invoiceId));

    // 5. Update Job Status if linked
    await db.update(jobs)
      .set({ status: 'completed' })
      .where(eq(jobs.id, invoice.jobId));

    // 6. Process Inventory Deductions
    if (itemsUsed.length > 0) {
      const logEntries = itemsUsed.map(item => ({
        inventoryId: item.inventoryId,
        jobId: invoice.jobId,
        quantityChange: -item.quantity, // Negative for usage
        reason: 'job_usage',
      }));

      await db.insert(inventoryLogs).values(logEntries);
      
      // Note: A trigger or a separate update query would be needed to update 
      // the actual `inventory` table quantities to keep them consistent with logs.
      // For this snippet, we rely on the log as the source of truth or a subsequent aggregation.
      for (const item of itemsUsed) {
         // Optimistic update logic would go here in a production transaction
         // await db.update(inventory).set({ quantityOnHand: sql`quantity_on_hand - ${item.quantity}` }).where(eq(inventory.id, item.inventoryId));
      }
    }

    return NextResponse.json({ success: true, data: { paymentIntentId } });

  } catch (error) {
    console.error('Payment Error:', error);
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}