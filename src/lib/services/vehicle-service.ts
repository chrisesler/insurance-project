import { VehicleMake, VehicleModel, NHTSAResponse } from '@/types';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

// Pre-cached popular makes for instant loading (IDs are just for UI, make name is used in API)
const CACHED_MAKES: VehicleMake[] = [
  { Make_ID: 1, Make_Name: 'Acura' },
  { Make_ID: 2, Make_Name: 'Audi' },
  { Make_ID: 3, Make_Name: 'BMW' },
  { Make_ID: 4, Make_Name: 'Buick' },
  { Make_ID: 5, Make_Name: 'Cadillac' },
  { Make_ID: 6, Make_Name: 'Chevrolet' },
  { Make_ID: 7, Make_Name: 'Chrysler' },
  { Make_ID: 8, Make_Name: 'Dodge' },
  { Make_ID: 9, Make_Name: 'Ford' },
  { Make_ID: 10, Make_Name: 'GMC' },
  { Make_ID: 11, Make_Name: 'Honda' },
  { Make_ID: 12, Make_Name: 'Hyundai' },
  { Make_ID: 13, Make_Name: 'Infiniti' },
  { Make_ID: 14, Make_Name: 'Jeep' },
  { Make_ID: 15, Make_Name: 'Kia' },
  { Make_ID: 16, Make_Name: 'Lexus' },
  { Make_ID: 17, Make_Name: 'Lincoln' },
  { Make_ID: 18, Make_Name: 'Mazda' },
  { Make_ID: 19, Make_Name: 'Mercedes-Benz' },
  { Make_ID: 20, Make_Name: 'Mitsubishi' },
  { Make_ID: 21, Make_Name: 'Nissan' },
  { Make_ID: 22, Make_Name: 'Porsche' },
  { Make_ID: 23, Make_Name: 'Subaru' },
  { Make_ID: 24, Make_Name: 'Tesla' },
  { Make_ID: 25, Make_Name: 'Toyota' },
  { Make_ID: 26, Make_Name: 'Volkswagen' },
  { Make_ID: 27, Make_Name: 'Volvo' },
].sort((a, b) => a.Make_Name.localeCompare(b.Make_Name));

export class VehicleService {
  private static cache = new Map<string, VehicleModel[]>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour for models

  private static isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private static setCacheWithExpiry(key: string, data: VehicleModel[]): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  static async getVehicleMakes(): Promise<VehicleMake[]> {
    // Return pre-cached makes instantly - no API call needed!
    console.log(`Returning ${CACHED_MAKES.length} pre-cached makes`);
    return CACHED_MAKES;
  }

  static async getModelsForMake(makeId: number, year?: number): Promise<VehicleModel[]> {
    const targetYear = year || new Date().getFullYear();
    const cacheKey = `models-${makeId}-${targetYear}`;
    
    // Return from cache if valid
    if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
      console.log(`Using cached models for makeId ${makeId}, year ${targetYear}`);
      const cachedModels = this.cache.get(cacheKey);
      if (cachedModels) {
        return cachedModels;
      }
    }

    try {
      // Get the make name from our cached makes
      const makes = await this.getVehicleMakes();
      const make = makes.find(m => m.Make_ID === makeId);
      if (!make) {
        throw new Error('Make not found');
      }

      console.log(`Fetching models for ${make.Make_Name} (ID: ${makeId}), year: ${targetYear}`);

      // Use NHTSA API with make name and year
      const url = `${NHTSA_BASE_URL}/vehicles/getmodelsformakeyear/make/${make.Make_Name.toLowerCase()}/modelyear/${targetYear}?format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NHTSA API returned ${response.status}`);
      }

      const data: NHTSAResponse<VehicleModel> = await response.json();
      
      // Filter, deduplicate, and sort the results
      const models = data.Results
        .filter(model => model.Model_Name && model.Model_Name.trim().length > 0)
        .map(model => ({
          Model_ID: model.Model_ID,
          Model_Name: model.Model_Name,
          Make_Name: make.Make_Name // Use our cached make name for consistency
        }))
        // Deduplicate by Model_Name (keep first occurrence)
        .filter((model, index, array) => 
          array.findIndex(m => m.Model_Name === model.Model_Name) === index
        )
        .sort((a, b) => a.Model_Name.localeCompare(b.Model_Name));

      console.log(`Found ${models.length} models for ${make.Make_Name} ${targetYear}`);
      
      this.setCacheWithExpiry(cacheKey, models);
      return models;
    } catch (error) {
      console.error(`Error fetching models for makeId ${makeId}, year ${targetYear}:`, error);
      
      // Fallback to cached models for this make
      const makes = await this.getVehicleMakes();
      const make = makes.find(m => m.Make_ID === makeId);
      const makeName = make?.Make_Name || 'Generic';
      
      console.log(`Using fallback models for ${makeName}`);
      const fallbackModels = this.getFallbackModelsForMake(makeName);
      this.setCacheWithExpiry(cacheKey, fallbackModels);
      return fallbackModels;
    }
  }


  static getVehicleYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Go back 30 years
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push(year);
    }
    
    return years;
  }

  private static getFallbackMakes(): VehicleMake[] {
    return [
      { Make_ID: 440, Make_Name: 'Acura' },
      { Make_ID: 441, Make_Name: 'Audi' },
      { Make_ID: 442, Make_Name: 'BMW' },
      { Make_ID: 443, Make_Name: 'Buick' },
      { Make_ID: 444, Make_Name: 'Cadillac' },
      { Make_ID: 445, Make_Name: 'Chevrolet' },
      { Make_ID: 446, Make_Name: 'Chrysler' },
      { Make_ID: 447, Make_Name: 'Dodge' },
      { Make_ID: 448, Make_Name: 'Ford' },
      { Make_ID: 449, Make_Name: 'GMC' },
      { Make_ID: 450, Make_Name: 'Honda' },
      { Make_ID: 451, Make_Name: 'Hyundai' },
      { Make_ID: 452, Make_Name: 'Infiniti' },
      { Make_ID: 453, Make_Name: 'Jeep' },
      { Make_ID: 454, Make_Name: 'Kia' },
      { Make_ID: 455, Make_Name: 'Lexus' },
      { Make_ID: 456, Make_Name: 'Lincoln' },
      { Make_ID: 457, Make_Name: 'Mazda' },
      { Make_ID: 458, Make_Name: 'Mercedes-Benz' },
      { Make_ID: 459, Make_Name: 'Mitsubishi' },
      { Make_ID: 460, Make_Name: 'Nissan' },
      { Make_ID: 470, Make_Name: 'Porsche' },
      { Make_ID: 461, Make_Name: 'Ram' },
      { Make_ID: 462, Make_Name: 'Subaru' },
      { Make_ID: 463, Make_Name: 'Tesla' },
      { Make_ID: 464, Make_Name: 'Toyota' },
      { Make_ID: 465, Make_Name: 'Volkswagen' },
      { Make_ID: 466, Make_Name: 'Volvo' },
    ];
  }

  private static getFallbackModelsForMake(makeName: string): VehicleModel[] {
    const makeModels: Record<string, VehicleModel[]> = {
      'Acura': [
        { Model_ID: 101, Model_Name: 'TLX', Make_Name: 'Acura' },
        { Model_ID: 102, Model_Name: 'MDX', Make_Name: 'Acura' },
        { Model_ID: 103, Model_Name: 'RDX', Make_Name: 'Acura' },
        { Model_ID: 104, Model_Name: 'ILX', Make_Name: 'Acura' },
        { Model_ID: 105, Model_Name: 'NSX', Make_Name: 'Acura' },
      ],
      'Audi': [
        { Model_ID: 111, Model_Name: 'A4', Make_Name: 'Audi' },
        { Model_ID: 112, Model_Name: 'Q5', Make_Name: 'Audi' },
        { Model_ID: 113, Model_Name: 'A6', Make_Name: 'Audi' },
        { Model_ID: 114, Model_Name: 'Q7', Make_Name: 'Audi' },
        { Model_ID: 115, Model_Name: 'A3', Make_Name: 'Audi' },
        { Model_ID: 116, Model_Name: 'Q3', Make_Name: 'Audi' },
      ],
      'BMW': [
        { Model_ID: 121, Model_Name: '3 Series', Make_Name: 'BMW' },
        { Model_ID: 122, Model_Name: '5 Series', Make_Name: 'BMW' },
        { Model_ID: 123, Model_Name: 'X3', Make_Name: 'BMW' },
        { Model_ID: 124, Model_Name: 'X5', Make_Name: 'BMW' },
        { Model_ID: 125, Model_Name: 'X1', Make_Name: 'BMW' },
        { Model_ID: 126, Model_Name: '7 Series', Make_Name: 'BMW' },
      ],
      'Buick': [
        { Model_ID: 131, Model_Name: 'Enclave', Make_Name: 'Buick' },
        { Model_ID: 132, Model_Name: 'Encore', Make_Name: 'Buick' },
        { Model_ID: 133, Model_Name: 'Envision', Make_Name: 'Buick' },
        { Model_ID: 134, Model_Name: 'LaCrosse', Make_Name: 'Buick' },
        { Model_ID: 135, Model_Name: 'Regal', Make_Name: 'Buick' },
      ],
      'Cadillac': [
        { Model_ID: 141, Model_Name: 'Escalade', Make_Name: 'Cadillac' },
        { Model_ID: 142, Model_Name: 'XT5', Make_Name: 'Cadillac' },
        { Model_ID: 143, Model_Name: 'CT5', Make_Name: 'Cadillac' },
        { Model_ID: 144, Model_Name: 'XT4', Make_Name: 'Cadillac' },
        { Model_ID: 145, Model_Name: 'CT4', Make_Name: 'Cadillac' },
      ],
      'Chevrolet': [
        { Model_ID: 151, Model_Name: 'Silverado 1500', Make_Name: 'Chevrolet' },
        { Model_ID: 152, Model_Name: 'Equinox', Make_Name: 'Chevrolet' },
        { Model_ID: 153, Model_Name: 'Malibu', Make_Name: 'Chevrolet' },
        { Model_ID: 154, Model_Name: 'Traverse', Make_Name: 'Chevrolet' },
        { Model_ID: 155, Model_Name: 'Tahoe', Make_Name: 'Chevrolet' },
        { Model_ID: 156, Model_Name: 'Camaro', Make_Name: 'Chevrolet' },
      ],
      'Chrysler': [
        { Model_ID: 161, Model_Name: 'Pacifica', Make_Name: 'Chrysler' },
        { Model_ID: 162, Model_Name: '300', Make_Name: 'Chrysler' },
        { Model_ID: 163, Model_Name: 'Voyager', Make_Name: 'Chrysler' },
        { Model_ID: 164, Model_Name: 'Aspen', Make_Name: 'Chrysler' },
      ],
      'Dodge': [
        { Model_ID: 171, Model_Name: 'Charger', Make_Name: 'Dodge' },
        { Model_ID: 172, Model_Name: 'Challenger', Make_Name: 'Dodge' },
        { Model_ID: 173, Model_Name: 'Durango', Make_Name: 'Dodge' },
        { Model_ID: 174, Model_Name: 'Journey', Make_Name: 'Dodge' },
        { Model_ID: 175, Model_Name: 'Grand Caravan', Make_Name: 'Dodge' },
      ],
      'Ford': [
        { Model_ID: 181, Model_Name: 'F-150', Make_Name: 'Ford' },
        { Model_ID: 182, Model_Name: 'Explorer', Make_Name: 'Ford' },
        { Model_ID: 183, Model_Name: 'Escape', Make_Name: 'Ford' },
        { Model_ID: 184, Model_Name: 'Mustang', Make_Name: 'Ford' },
        { Model_ID: 185, Model_Name: 'Edge', Make_Name: 'Ford' },
        { Model_ID: 186, Model_Name: 'Bronco', Make_Name: 'Ford' },
      ],
      'GMC': [
        { Model_ID: 191, Model_Name: 'Sierra 1500', Make_Name: 'GMC' },
        { Model_ID: 192, Model_Name: 'Acadia', Make_Name: 'GMC' },
        { Model_ID: 193, Model_Name: 'Terrain', Make_Name: 'GMC' },
        { Model_ID: 194, Model_Name: 'Yukon', Make_Name: 'GMC' },
        { Model_ID: 195, Model_Name: 'Canyon', Make_Name: 'GMC' },
      ],
      'Honda': [
        { Model_ID: 201, Model_Name: 'Accord', Make_Name: 'Honda' },
        { Model_ID: 202, Model_Name: 'Civic', Make_Name: 'Honda' },
        { Model_ID: 203, Model_Name: 'CR-V', Make_Name: 'Honda' },
        { Model_ID: 204, Model_Name: 'Pilot', Make_Name: 'Honda' },
        { Model_ID: 205, Model_Name: 'Odyssey', Make_Name: 'Honda' },
        { Model_ID: 206, Model_Name: 'HR-V', Make_Name: 'Honda' },
      ],
      'Hyundai': [
        { Model_ID: 211, Model_Name: 'Elantra', Make_Name: 'Hyundai' },
        { Model_ID: 212, Model_Name: 'Tucson', Make_Name: 'Hyundai' },
        { Model_ID: 213, Model_Name: 'Santa Fe', Make_Name: 'Hyundai' },
        { Model_ID: 214, Model_Name: 'Sonata', Make_Name: 'Hyundai' },
        { Model_ID: 215, Model_Name: 'Palisade', Make_Name: 'Hyundai' },
        { Model_ID: 216, Model_Name: 'Kona', Make_Name: 'Hyundai' },
      ],
      'Infiniti': [
        { Model_ID: 221, Model_Name: 'Q50', Make_Name: 'Infiniti' },
        { Model_ID: 222, Model_Name: 'QX60', Make_Name: 'Infiniti' },
        { Model_ID: 223, Model_Name: 'QX80', Make_Name: 'Infiniti' },
        { Model_ID: 224, Model_Name: 'Q60', Make_Name: 'Infiniti' },
        { Model_ID: 225, Model_Name: 'QX50', Make_Name: 'Infiniti' },
      ],
      'Jeep': [
        { Model_ID: 231, Model_Name: 'Grand Cherokee', Make_Name: 'Jeep' },
        { Model_ID: 232, Model_Name: 'Wrangler', Make_Name: 'Jeep' },
        { Model_ID: 233, Model_Name: 'Cherokee', Make_Name: 'Jeep' },
        { Model_ID: 234, Model_Name: 'Compass', Make_Name: 'Jeep' },
        { Model_ID: 235, Model_Name: 'Renegade', Make_Name: 'Jeep' },
        { Model_ID: 236, Model_Name: 'Gladiator', Make_Name: 'Jeep' },
      ],
      'Kia': [
        { Model_ID: 241, Model_Name: 'Optima', Make_Name: 'Kia' },
        { Model_ID: 242, Model_Name: 'Sorento', Make_Name: 'Kia' },
        { Model_ID: 243, Model_Name: 'Forte', Make_Name: 'Kia' },
        { Model_ID: 244, Model_Name: 'Soul', Make_Name: 'Kia' },
        { Model_ID: 245, Model_Name: 'Sportage', Make_Name: 'Kia' },
        { Model_ID: 246, Model_Name: 'Telluride', Make_Name: 'Kia' },
      ],
      'Lexus': [
        { Model_ID: 251, Model_Name: 'RX', Make_Name: 'Lexus' },
        { Model_ID: 252, Model_Name: 'ES', Make_Name: 'Lexus' },
        { Model_ID: 253, Model_Name: 'NX', Make_Name: 'Lexus' },
        { Model_ID: 254, Model_Name: 'GX', Make_Name: 'Lexus' },
        { Model_ID: 255, Model_Name: 'LX', Make_Name: 'Lexus' },
        { Model_ID: 256, Model_Name: 'IS', Make_Name: 'Lexus' },
      ],
      'Lincoln': [
        { Model_ID: 261, Model_Name: 'Navigator', Make_Name: 'Lincoln' },
        { Model_ID: 262, Model_Name: 'Aviator', Make_Name: 'Lincoln' },
        { Model_ID: 263, Model_Name: 'Corsair', Make_Name: 'Lincoln' },
        { Model_ID: 264, Model_Name: 'Nautilus', Make_Name: 'Lincoln' },
        { Model_ID: 265, Model_Name: 'Continental', Make_Name: 'Lincoln' },
      ],
      'Mazda': [
        { Model_ID: 271, Model_Name: 'CX-5', Make_Name: 'Mazda' },
        { Model_ID: 272, Model_Name: 'Mazda3', Make_Name: 'Mazda' },
        { Model_ID: 273, Model_Name: 'CX-9', Make_Name: 'Mazda' },
        { Model_ID: 274, Model_Name: 'Mazda6', Make_Name: 'Mazda' },
        { Model_ID: 275, Model_Name: 'MX-5 Miata', Make_Name: 'Mazda' },
        { Model_ID: 276, Model_Name: 'CX-30', Make_Name: 'Mazda' },
      ],
      'Mercedes-Benz': [
        { Model_ID: 281, Model_Name: 'C-Class', Make_Name: 'Mercedes-Benz' },
        { Model_ID: 282, Model_Name: 'E-Class', Make_Name: 'Mercedes-Benz' },
        { Model_ID: 283, Model_Name: 'GLE', Make_Name: 'Mercedes-Benz' },
        { Model_ID: 284, Model_Name: 'GLC', Make_Name: 'Mercedes-Benz' },
        { Model_ID: 285, Model_Name: 'A-Class', Make_Name: 'Mercedes-Benz' },
        { Model_ID: 286, Model_Name: 'S-Class', Make_Name: 'Mercedes-Benz' },
      ],
      'Mitsubishi': [
        { Model_ID: 291, Model_Name: 'Outlander', Make_Name: 'Mitsubishi' },
        { Model_ID: 292, Model_Name: 'Eclipse Cross', Make_Name: 'Mitsubishi' },
        { Model_ID: 293, Model_Name: 'Mirage', Make_Name: 'Mitsubishi' },
        { Model_ID: 294, Model_Name: 'Pajero', Make_Name: 'Mitsubishi' },
        { Model_ID: 295, Model_Name: 'Lancer', Make_Name: 'Mitsubishi' },
      ],
      'Nissan': [
        { Model_ID: 301, Model_Name: 'Altima', Make_Name: 'Nissan' },
        { Model_ID: 302, Model_Name: 'Rogue', Make_Name: 'Nissan' },
        { Model_ID: 303, Model_Name: 'Sentra', Make_Name: 'Nissan' },
        { Model_ID: 304, Model_Name: 'Pathfinder', Make_Name: 'Nissan' },
        { Model_ID: 305, Model_Name: 'Murano', Make_Name: 'Nissan' },
        { Model_ID: 306, Model_Name: 'Frontier', Make_Name: 'Nissan' },
      ],
      'Porsche': [
        { Model_ID: 311, Model_Name: 'Cayenne', Make_Name: 'Porsche' },
        { Model_ID: 312, Model_Name: '911', Make_Name: 'Porsche' },
        { Model_ID: 313, Model_Name: 'Macan', Make_Name: 'Porsche' },
        { Model_ID: 314, Model_Name: 'Panamera', Make_Name: 'Porsche' },
        { Model_ID: 315, Model_Name: 'Taycan', Make_Name: 'Porsche' },
        { Model_ID: 316, Model_Name: 'Boxster', Make_Name: 'Porsche' },
      ],
      'Subaru': [
        { Model_ID: 321, Model_Name: 'Outback', Make_Name: 'Subaru' },
        { Model_ID: 322, Model_Name: 'Forester', Make_Name: 'Subaru' },
        { Model_ID: 323, Model_Name: 'Impreza', Make_Name: 'Subaru' },
        { Model_ID: 324, Model_Name: 'Crosstrek', Make_Name: 'Subaru' },
        { Model_ID: 325, Model_Name: 'Ascent', Make_Name: 'Subaru' },
        { Model_ID: 326, Model_Name: 'Legacy', Make_Name: 'Subaru' },
      ],
      'Tesla': [
        { Model_ID: 331, Model_Name: 'Model 3', Make_Name: 'Tesla' },
        { Model_ID: 332, Model_Name: 'Model Y', Make_Name: 'Tesla' },
        { Model_ID: 333, Model_Name: 'Model S', Make_Name: 'Tesla' },
        { Model_ID: 334, Model_Name: 'Model X', Make_Name: 'Tesla' },
        { Model_ID: 335, Model_Name: 'Cybertruck', Make_Name: 'Tesla' },
      ],
      'Toyota': [
        { Model_ID: 341, Model_Name: 'Camry', Make_Name: 'Toyota' },
        { Model_ID: 342, Model_Name: 'Corolla', Make_Name: 'Toyota' },
        { Model_ID: 343, Model_Name: 'RAV4', Make_Name: 'Toyota' },
        { Model_ID: 344, Model_Name: 'Highlander', Make_Name: 'Toyota' },
        { Model_ID: 345, Model_Name: 'Prius', Make_Name: 'Toyota' },
        { Model_ID: 346, Model_Name: 'Tacoma', Make_Name: 'Toyota' },
      ],
      'Volkswagen': [
        { Model_ID: 351, Model_Name: 'Jetta', Make_Name: 'Volkswagen' },
        { Model_ID: 352, Model_Name: 'Tiguan', Make_Name: 'Volkswagen' },
        { Model_ID: 353, Model_Name: 'Passat', Make_Name: 'Volkswagen' },
        { Model_ID: 354, Model_Name: 'Atlas', Make_Name: 'Volkswagen' },
        { Model_ID: 355, Model_Name: 'Golf', Make_Name: 'Volkswagen' },
        { Model_ID: 356, Model_Name: 'Arteon', Make_Name: 'Volkswagen' },
      ],
      'Volvo': [
        { Model_ID: 361, Model_Name: 'XC90', Make_Name: 'Volvo' },
        { Model_ID: 362, Model_Name: 'XC60', Make_Name: 'Volvo' },
        { Model_ID: 363, Model_Name: 'S60', Make_Name: 'Volvo' },
        { Model_ID: 364, Model_Name: 'XC40', Make_Name: 'Volvo' },
        { Model_ID: 365, Model_Name: 'V90', Make_Name: 'Volvo' },
        { Model_ID: 366, Model_Name: 'S90', Make_Name: 'Volvo' },
      ]
    };

    return makeModels[makeName] || [
      { Model_ID: 999, Model_Name: 'Standard', Make_Name: makeName },
      { Model_ID: 998, Model_Name: 'Deluxe', Make_Name: makeName },
      { Model_ID: 997, Model_Name: 'Premium', Make_Name: makeName },
    ];
  }
}