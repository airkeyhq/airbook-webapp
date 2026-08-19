import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }

  console.log('Connecting to Neon DB...');
  const sql = neon(dbUrl);

  const migrationPath = path.join(process.cwd(), 'drizzle', '0000_spotty_mandarin.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  const statements = migrationSql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} SQL migration statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql.query(stmt);
      console.log(`[${i + 1}/${statements.length}] Statement executed successfully.`);
    } catch (err: any) {
      console.error(`Error executing statement ${i + 1}:`, err.message);
      console.error('Failed statement:', stmt);
      process.exit(1);
    }
  }

  console.log('✅ All migrations applied successfully to Neon DB!');
}

runMigration();
