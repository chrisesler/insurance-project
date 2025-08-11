import { NextRequest, NextResponse } from 'next/server';
import { VehicleService } from '@/lib/services/vehicle-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const makeId = searchParams.get('makeId');
    const year = searchParams.get('year');

    if (!makeId) {
      return NextResponse.json(
        { error: 'makeId parameter is required' },
        { status: 400 }
      );
    }

    const models = await VehicleService.getModelsForMake(
      parseInt(makeId),
      year ? parseInt(year) : undefined
    );
    
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Vehicle models API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle models' },
      { status: 500 }
    );
  }
}