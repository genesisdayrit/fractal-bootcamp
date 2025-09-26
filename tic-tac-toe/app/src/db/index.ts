import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' }); // or .env.local
console.log("Database URL loaded:", !!process.env.DATABASE_URL);


if (!process.env.DATABASE_URL) throw Error('Database Url not present')

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
