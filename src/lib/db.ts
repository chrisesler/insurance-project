import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'node:path';
import * as schema from '@/models/schema';

// Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
const globalForDb = globalThis as unknown as {
  drizzle: NodePgDatabase<typeof schema>;
};

const createDbConnection = async () => {
  const db = drizzle({
    connection: {
      connectionString: process.env.DATABASE_URL!,
      ssl: false, // PGlite server doesn't use SSL
    },
    schema,
  });
  
  // Run migrations
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  });
  
  return db;
};

// Initialize database connection
let dbPromise: Promise<NodePgDatabase<typeof schema>>;

if (globalForDb.drizzle) {
  dbPromise = Promise.resolve(globalForDb.drizzle);
} else {
  dbPromise = createDbConnection().then((db) => {
    // Only store in global during development to prevent hot reload issues
    if (process.env.NODE_ENV !== 'production') {
      globalForDb.drizzle = db;
    }
    return db;
  });
}

export const getDb = () => dbPromise;