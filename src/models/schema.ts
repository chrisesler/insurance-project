import { integer, pgTable, text, timestamp, real, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const quoteStatusEnum = pgEnum('quote_status', ['DRAFT', 'COMPLETED', 'SUBMITTED']);
export const coverageTypeEnum = pgEnum('coverage_type', ['LIABILITY', 'STANDARD', 'FULL']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quotes table
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: quoteStatusEnum('status').default('DRAFT').notNull(),
  
  // Personal Information
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  
  // Address
  streetAddress: text('street_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  
  // Vehicle Information
  vehicleYear: integer('vehicle_year').notNull(),
  vehicleMake: text('vehicle_make').notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  vin: text('vin'),
  
  // Coverage Options
  coverageType: coverageTypeEnum('coverage_type').notNull(),
  liabilityLimit: integer('liability_limit').notNull(),
  deductible: integer('deductible').notNull(),
  
  // Quote Results
  premium: real('premium'),
  calculatedAt: timestamp('calculated_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vehicles table (for caching popular vehicle combinations)
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  year: integer('year').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;