import { PGlite } from '@electric-sql/pglite';
import { join } from 'path';

let db: PGlite | null = null;

export async function getDatabase(): Promise<PGlite> {
  if (!db) {
    // Create database in a data directory
    const dbPath = join(process.cwd(), 'data', 'insurance.db');
    db = new PGlite(dbPath);
    
    // Initialize tables if they don't exist
    await initializeTables(db);
  }
  
  return db;
}

async function initializeTables(database: PGlite) {
  try {
    // Create users table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "clerkId" TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create quotes table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'COMPLETED', 'SUBMITTED')),
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        "dateOfBirth" TIMESTAMP NOT NULL,
        "streetAddress" TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        "zipCode" TEXT NOT NULL,
        "vehicleYear" INTEGER NOT NULL,
        "vehicleMake" TEXT NOT NULL,
        "vehicleModel" TEXT NOT NULL,
        vin TEXT,
        "coverageType" TEXT CHECK ("coverageType" IN ('LIABILITY', 'STANDARD', 'FULL')),
        "liabilityLimit" INTEGER NOT NULL,
        deductible INTEGER NOT NULL,
        premium REAL,
        "calculatedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create vehicles table
    await database.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        year INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(year, make, model)
      );
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
  }
}