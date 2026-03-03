import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, invoiceItems, jobs, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createInvoiceSchema } from '@/lib/validations';
import { sql } from 'drizzle-orm';

/**
 * GET /api/invoices
 * List invoices
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = db
      .select({
        invoice: invoices,
        job: jobs,
        customer: customers,
      })
      .from(invoices)
      .leftJoin(jobs, eq(invoices.jobId, jobs.id))
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.createdAt));

    if (status) {
      query = query.where(eq(invoices.status, status as any));
    }

    const result = await query;
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

/**
 * POST /api/invoices
 * Create an invoice and handle inventory deduction logic
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createInvoiceSchema.parse(body);

    // Calculate Totals
    let subtotal = 0;
    const itemsWithTotals = validatedData.items.map(item => {
      const lineTotal = item.quantity * Number(item.unitPrice);
      subtotal += lineTotal;
      return {
        ...item,
        unitPrice: String(item.unitPrice),
        lineTotal: String(lineTotal),
      };
    });

    const taxAmount = subtotal * (validatedData.taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Generate Invoice Number (Simple YYYY-MM-XXXX format)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);
    const seq = (countResult[0]?.count || 0) + 1;
    const invoiceNumber = `INV-${dateStr}-${seq.toString().padStart(4, '0')}`;

    // Insert Invoice
    const [newInvoice] = await db.insert(invoices).values({
      jobId: validatedData.jobId,
      customerId: validatedData.customerId,
      invoiceNumber,
      subtotal: String(subtotal),
      taxRate: String(validatedData.taxRate),
      taxAmount: String(taxAmount),
      totalAmount: String(totalAmount),
      status: 'draft',
      notes: validatedData.notes,
    }).returning();

    // Insert Invoice Items
    const itemsToInsert = itemsWithTotals.map(item => ({
      invoiceId: newInvoice.id,
      ...item,
    }));
    
    await db.insert(invoiceItems).values(itemsToInsert);

    // TODO: Inventory Deduction Logic
    // This would typically trigger a server action to deduct items from 
    // the staff's truck inventory based on productId and quantity.

    return NextResponse.json({ success: true, data: { ...newInvoice, items: itemsWithTotals } }, { status: 201 });

  } catch (error: any) {
    console.error('Invoice POST Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
  }
}