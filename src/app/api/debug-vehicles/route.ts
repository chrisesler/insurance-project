import { NextResponse } from 'next/server';
import { VehicleService } from '@/lib/services/vehicle-service';

export async function GET() {
  try {
    console.log('Debug: Starting vehicle data fetch...');
    const makes = await VehicleService.getVehicleMakes();
    
    console.log('Debug: Got makes, now testing models for Jeep...');
    const jeepMake = makes.find(m => m.Make_Name === 'Jeep');
    let jeepModels = [];
    
    if (jeepMake) {
      jeepModels = await VehicleService.getModelsForMake(jeepMake.Make_ID, 2024);
      console.log('Debug: Jeep models:', jeepModels);
    }
    
    return NextResponse.json({
      totalMakes: makes.length,
      makes: makes.slice(0, 20), // First 20 makes
      jeepFound: !!jeepMake,
      jeepMake,
      jeepModels,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}