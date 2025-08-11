#!/usr/bin/env tsx

import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import * as schema from '../src/models/schema';

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
  schema,
});

async function resetDatabase() {
  console.log('🗑️  Dropping all tables...');
  
  // Drop tables in correct order (considering foreign keys)
  try {
    await db.execute(sql`DROP TABLE IF EXISTS quotes CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS vehicles CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS quote_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS coverage_type CASCADE`);
  } catch (error) {
    console.log('Note: Some tables may not exist yet, continuing...');
  }

  console.log('🚀 Running migrations...');
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  });

  console.log('✅ Database reset complete!');
  process.exit(0);
}

resetDatabase().catch((error) => {
  console.error('❌ Reset failed:', error);
  process.exit(1);
});