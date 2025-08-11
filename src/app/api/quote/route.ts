import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { users, quotes } from '@/models/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      streetAddress,
      city,
      state,
      zipCode,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      vin,
      coverageType,
      liabilityLimit,
      deductible,
      premium,
    } = body;

    const db = await getDb();

    // Ensure user exists in our database
    const existingUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    
    let user;
    if (existingUser.length === 0) {
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email,
      }).returning();
      user = newUser;
    } else {
      const [updatedUser] = await db.update(users)
        .set({ email, updatedAt: new Date() })
        .where(eq(users.clerkId, userId))
        .returning();
      user = updatedUser;
    }

    // Create the quote
    const [quote] = await db.insert(quotes).values({
      userId: user.id,
      status: 'COMPLETED',
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      streetAddress,
      city,
      state,
      zipCode,
      vehicleYear: parseInt(vehicleYear),
      vehicleMake,
      vehicleModel,
      vin: vin || null,
      coverageType,
      liabilityLimit: parseInt(liabilityLimit),
      deductible: parseInt(deductible),
      premium: parseFloat(premium),
      calculatedAt: new Date(),
    }).returning();

    console.log('Quote created successfully:', quote);
    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ quotes: [] });
    }

    const userQuotes = await db.select().from(quotes).where(eq(quotes.userId, user[0].id)).orderBy(desc(quotes.createdAt));

    console.log(`Found ${userQuotes.length} quotes for user ${userId}`);
    return NextResponse.json({ quotes: userQuotes });
  } catch (error) {
    console.error('Quote retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve quotes' },
      { status: 500 }
    );
  }
}