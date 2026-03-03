import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs, updateJobStatusSchema } from "@/db";
import { eq } from 'drizzle-orm';

/**
 * GET /api/jobs/[id]
 * Get single job details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    console.error('Job GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/jobs/[id]
 * Update job details (mostly status)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    
    const validatedData = updateJobStatusSchema.parse(body);

    const [updatedJob] = await db
      .update(jobs)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('Job PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}