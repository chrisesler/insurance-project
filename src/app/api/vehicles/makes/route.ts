import { NextResponse } from 'next/server';
import { VehicleService } from '@/lib/services/vehicle-service';

export async function GET() {
  try {
    const makes = await VehicleService.getVehicleMakes();
    return NextResponse.json({ makes });
  } catch (error) {
    console.error('Vehicle makes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle makes' },
      { status: 500 }
    );
  }
}