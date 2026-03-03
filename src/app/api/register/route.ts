import { NextResponse } from 'next/server';
import { db } from "@/db";
import { users } from "@/db";
import bcrypt from 'bcrypt';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (Default to STAFF role, Owner can promote later)
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'STAFF', // Default role
    }).returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    return NextResponse.json(
      { message: 'User created successfully', user: newUser[0] },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}