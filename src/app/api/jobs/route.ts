import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs, users, customers } from "@/db";
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { createJobSchema } from '@/lib/validations';

/**
 * GET /api/jobs
 * List jobs with filtering capability
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = db
      .select({
        job: jobs,
        customer: customers,
        staff: users,
      })
      .from(jobs)
      .leftJoin(customers, eq(jobs.customerId, customers.id))
      .leftJoin(users, eq(jobs.staffId, users.id))
      .orderBy(desc(jobs.scheduledStart));

    // Filter by Staff
    if (staffId) {
      query = query.where(eq(jobs.staffId, parseInt(staffId)));
    }

    // Filter by Status
    if (status) {
      query = query.where(eq(jobs.status, status as any));
    }

    // Filter by Date Range
    if (startDate && endDate) {
      query = query.where(
        and(
          gte(jobs.scheduledStart, new Date(startDate)),
          lte(jobs.scheduledStart, new Date(endDate))
        )!
      );
    }

    const result = await query;

    // Transform data for frontend
    const transformed = result.map(r => ({
      ...r.job,
      customer: r.customer,
      staff: r.staff ? { id: r.staff.id, name: r.staff.name } : null,
    }));

    return NextResponse.json({ success: true, data: transformed });
  } catch (error: any) {
    console.error('Jobs GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Create a new job
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createJobSchema.parse(body);

    const [newJob] = await db.insert(jobs).values(validatedData).returning();

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Jobs POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}