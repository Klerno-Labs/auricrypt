import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database Connection
 * Environment variables must be set in .env
 * - DATABASE_URL
 */
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Client for query execution
const client = postgres(connectionString, { max: 1 });

// Drizzle instance
export const db = drizzle(client, { schema });