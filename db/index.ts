import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || (
  process.env.NODE_ENV === 'production' 
    ? '' 
    : 'postgres://postgres:postgres@localhost:5432/airbook'
);

if (process.env.NODE_ENV === 'production' && !connectionString) {
  throw new Error('FATAL: DATABASE_URL environment variable is required in production.');
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
