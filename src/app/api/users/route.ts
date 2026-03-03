import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and, like, or } from 'drizzle-orm';
import { createUserSchema } from '@/lib/validations';
import { hash } from 'bcryptjs';

/**
 * GET /api/users
 * List all users (filtered by role if not owner/manager)
 */
export async function GET(req: NextRequest) {
  try {
    // In a real app, verify session/role here using NextAuth
    // const session = await getServerSession(authOptions);
    
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let query = db.select().from(users);

    // Filter by role
    if (role) {
      query = query.where(eq(users.role, role as any));
    }

    // Search by name or email
    if (search) {
      query = query.where(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )!
      );
    }

    const result = await query;

    // Remove password hash from response
    const sanitizedResult = result.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json({ success: true, data: sanitizedResult });
  } catch (error: any) {
    console.error('Users GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10);

    const [newUser] = await db.insert(users).values({
      ...validatedData,
      passwordHash: hashedPassword,
    }).returning();

    // Return user without password
    const { passwordHash, ...userToReturn } = newUser;

    return NextResponse.json({ success: true, data: userToReturn }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Users POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}