import { QuoteData, QuoteResult } from '@/types';
import { differenceInYears, parseISO } from 'date-fns';

/**
 * QuoteService - Insurance Premium Calculation Engine
 *
 * This service calculates auto insurance premiums based on various risk factors
 * using industry-standard actuarial principles. The calculation considers:
 * - Driver demographics (age)
 * - Geographic risk (state)
 * - Vehicle characteristics (age, make)
 * - Coverage selections (type, limits, deductible)
 *
 * The algorithm starts with a base premium and applies multiplicative factors
 * to adjust for risk. This approach mirrors real insurance underwriting.
 */
export class QuoteService {
  /** Base annual premium in USD - starting point for all calculations */
  private static BASE_PREMIUM = 800;
  
  /**
   * Main quote calculation method - orchestrates all risk factor calculations
   *
   * Process:
   * 1. Start with base premium ($800)
   * 2. Apply multiplicative risk factors sequentially
   * 3. Generate coverage breakdown
   * 4. Return final premium with monthly payment option
   *
   * @param quoteData Complete user input data from quote wizard
   * @returns QuoteResult with premium, monthly payment, and coverage breakdown
   */
  static calculateQuote(quoteData: QuoteData): QuoteResult {
    let basePremium = this.BASE_PREMIUM;
    
    // Age factor - younger and older drivers are higher risk
    const age = differenceInYears(new Date(), parseISO(quoteData.dateOfBirth));
    basePremium *= this.getAgeFactor(age);
    
    // State factor - geographic risk varies by accident rates, weather, theft
    basePremium *= this.getStateFactor(quoteData.state);
    
    // Vehicle factor - combines age and make risk (newer/luxury = higher cost)
    basePremium *= this.getVehicleFactor(quoteData.vehicleYear, quoteData.vehicleMake);
    
    // Coverage type factor - more coverage = higher premium
    const coverageMultiplier = this.getCoverageMultiplier(quoteData.coverageType);
    basePremium *= coverageMultiplier;
    
    // Liability limits factor - higher limits = slightly higher premium
    basePremium *= this.getLiabilityFactor(quoteData.liabilityLimit);
    
    // Deductible factor - higher deductible = lower premium (inverse relationship)
    basePremium *= this.getDeductibleFactor(quoteData.deductible);
    
    // Calculate how premium is split across coverage types
    const breakdown = this.calculateBreakdown(basePremium, quoteData.coverageType);
    
    const annualPremium = Math.round(basePremium);
    const monthlyPayment = Math.round(annualPremium / 12);
    
    return {
      premium: annualPremium,
      monthlyPayment,
      breakdown,
    };
  }
  
  /**
   * Age-based risk multiplier - reflects insurance industry actuarial data
   * Young drivers (under 25) are highest risk due to inexperience
   * Middle-aged drivers (35-55) are lowest risk - experienced and cautious
   * Senior drivers (70+) see slight increase due to slower reflexes
   */
  private static getAgeFactor(age: number): number {
    if (age < 18) return 2.5; // Very high risk - new drivers
    if (age < 25) return 1.8; // High risk - young adults
    if (age < 35) return 1.2; // Moderate risk - still learning
    if (age < 55) return 1.0; // Base rate - most experienced group
    if (age < 70) return 1.1; // Slight increase - aging effects begin
    return 1.3;               // Higher risk - senior drivers
  }
  
  /**
   * Geographic risk multiplier based on state-level factors
   * High-risk states: dense population, extreme weather, high accident rates
   * Low-risk states: rural areas, good weather, fewer accidents
   */
  private static getStateFactor(state: string): number {
    // High-risk states (+30%): urban density, weather, crime rates
    const highRiskStates = ['CA', 'NY', 'FL', 'TX', 'MI'];
    // Low-risk states (-20%): rural, good weather, low accident rates
    const lowRiskStates = ['VT', 'ME', 'NH', 'IA', 'WY'];
    
    if (highRiskStates.includes(state)) return 1.3; // 30% increase
    if (lowRiskStates.includes(state)) return 0.8;  // 20% discount
    return 1.0; // Average states - no adjustment
  }
  
  /**
   * Vehicle risk multiplier combining age and make factors
   *
   * Age Factor Logic:
   * - New cars (0-3 years): Higher premium due to higher value/repair costs
   * - Prime cars (3-7 years): Base rate - good condition, reasonable value
   * - Older cars (7-15 years): Slight discount - lower value
   * - Very old cars (15+ years): Bigger discount - minimal value
   *
   * Make Factor Logic:
   * - Sports cars: Double premium - high theft risk, expensive repairs, reckless driving
   * - Luxury cars: 40% increase - expensive parts, attractive to thieves
   * - Economy cars: 10% discount - reliable, cheap parts, lower theft risk
   */
  private static getVehicleFactor(year: number, make: string): number {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - year;
    
    // Vehicle age factor - newer cars cost more to insure
    let ageFactor = 1.0;
    if (vehicleAge < 3) ageFactor = 1.2;        // +20% - new car premium
    else if (vehicleAge < 7) ageFactor = 1.0;   // Base rate - sweet spot
    else if (vehicleAge < 15) ageFactor = 0.9;  // -10% - older but functional
    else ageFactor = 0.8;                       // -20% - very old, low value
    
    // Make-based risk factor
    const luxuryMakes = ['BMW', 'MERCEDES-BENZ', 'AUDI', 'LEXUS', 'ACURA', 'INFINITI', 'CADILLAC'];
    const sportsMakes = ['FERRARI', 'LAMBORGHINI', 'PORSCHE', 'MASERATI'];
    const economicMakes = ['TOYOTA', 'HONDA', 'HYUNDAI', 'KIA', 'NISSAN'];
    
    let makeFactor = 1.0;
    if (sportsMakes.includes(make.toUpperCase())) makeFactor = 2.0;      // +100% - sports car risk
    else if (luxuryMakes.includes(make.toUpperCase())) makeFactor = 1.4; // +40% - luxury risk
    else if (economicMakes.includes(make.toUpperCase())) makeFactor = 0.9; // -10% - economy discount
    
    return ageFactor * makeFactor;
  }
  
  /**
   * Coverage type multiplier - reflects amount of protection provided
   * LIABILITY: Minimum legal coverage only (-40% discount)
   * STANDARD: Good protection with collision/comprehensive (base rate)
   * FULL: Maximum protection with all coverage types (+60% premium)
   */
  private static getCoverageMultiplier(coverageType: string): number {
    switch (coverageType) {
      case 'LIABILITY': return 0.6; // 40% discount - minimal coverage
      case 'STANDARD': return 1.0;  // Base rate - good protection
      case 'FULL': return 1.6;      // 60% increase - maximum coverage
      default: return 1.0;
    }
  }
  
  /**
   * Liability limit factor - higher limits = slightly higher premium
   * Reflects increased exposure for insurance company
   * Scale is modest since liability claims are relatively rare
   */
  private static getLiabilityFactor(liabilityLimit: number): number {
    if (liabilityLimit <= 25000) return 0.8;  // -20% - minimum coverage
    if (liabilityLimit <= 50000) return 0.9;  // -10% - below average
    if (liabilityLimit <= 100000) return 1.0; // Base rate - standard limit
    if (liabilityLimit <= 250000) return 1.1; // +10% - higher protection
    return 1.2;                                // +20% - maximum protection
  }
  
  /**
   * Deductible factor - inverse relationship to premium
   * Higher deductible = lower premium (customer takes more risk)
   * This reflects reduced payout frequency for insurance company
   */
  private static getDeductibleFactor(deductible: number): number {
    if (deductible >= 2000) return 0.8;  // -20% - high deductible discount
    if (deductible >= 1000) return 0.9;  // -10% - moderate discount
    if (deductible >= 500) return 0.95;  // -5% - small discount
    return 1.0;                          // Base rate - low deductible
  }
  
  /**
   * Premium breakdown by coverage type - shows how total premium is allocated
   *
   * LIABILITY: 100% liability (only coverage included)
   * STANDARD: 50% liability, 30% collision, 20% comprehensive
   * FULL: 40% liability, 30% collision, 20% comprehensive, 10% personal injury
   *
   * Percentages reflect typical cost distribution in real insurance policies
   */
  private static calculateBreakdown(basePremium: number, coverageType: string) {
    switch (coverageType) {
      case 'LIABILITY':
        return {
          liability: Math.round(basePremium), // 100% - only coverage type
        };
      
      case 'STANDARD':
        return {
          liability: Math.round(basePremium * 0.5),    // 50% - largest component
          collision: Math.round(basePremium * 0.3),    // 30% - vehicle damage
          comprehensive: Math.round(basePremium * 0.2), // 20% - theft, weather, etc.
        };
      
      case 'FULL':
        return {
          liability: Math.round(basePremium * 0.4),      // 40% - reduced percentage 
          collision: Math.round(basePremium * 0.3),      // 30% - same as standard
          comprehensive: Math.round(basePremium * 0.2),  // 20% - same as standard
          personalInjury: Math.round(basePremium * 0.1), // 10% - additional coverage
        };
      
      default:
        return { liability: Math.round(basePremium) };
    }
  }
}

/**
 * Coverage option definitions for the quote wizard UI
 *
 * Each option includes:
 * - name: User-friendly display name
 * - description: Brief explanation of coverage level
 * - features: List of specific coverage types included
 *
 * Used by the coverage selection step to show users their options
 * and help them understand what each tier includes.
 */
export const COVERAGE_OPTIONS = {
  LIABILITY: {
    name: 'Liability Only',
    description: 'Basic coverage required by law. Covers damage you cause to others.',
    features: ['Bodily injury liability', 'Property damage liability'],
  },
  STANDARD: {
    name: 'Standard Coverage',
    description: 'Good protection including collision and comprehensive coverage.',
    features: [
      'Bodily injury liability',
      'Property damage liability',
      'Collision coverage',
      'Comprehensive coverage',
    ],
  },
  FULL: {
    name: 'Full Coverage',
    description: 'Maximum protection with all available coverage options.',
    features: [
      'Bodily injury liability',
      'Property damage liability',
      'Collision coverage',
      'Comprehensive coverage',
      'Personal injury protection',
      'Uninsured motorist coverage',
    ],
  },
};

/**
 * Liability coverage limit options in USD
 *
 * Represents the maximum amount insurance will pay for liability claims.
 * Lower limits = cheaper premiums but higher personal financial risk.
 * Higher limits = more expensive but better protection against lawsuits.
 *
 * $25k-$50k: State minimums (high risk, cheap premium)
 * $100k: Reasonable protection for most drivers
 * $250k-$500k: High net worth individuals, comprehensive protection
 */
export const LIABILITY_LIMITS = [
  { value: 25000, label: '$25,000' },   // Minimum legal requirement in many states
  { value: 50000, label: '$50,000' },   // Low but common state minimum
  { value: 100000, label: '$100,000' }, // Recommended minimum for most drivers
  { value: 250000, label: '$250,000' }, // Good protection level
  { value: 500000, label: '$500,000' }, // High protection for affluent drivers
];

/**
 * Deductible options in USD
 *
 * Amount the policyholder pays before insurance coverage kicks in.
 * Higher deductible = lower monthly premium (more out-of-pocket risk)
 * Lower deductible = higher monthly premium (less out-of-pocket risk)
 *
 * $250: Low deductible, high premium - good for those who can't afford large expenses
 * $2000: High deductible, low premium - good for those with emergency funds
 */
export const DEDUCTIBLE_OPTIONS = [
  { value: 250, label: '$250' },   // Low deductible - pay less when claims occur
  { value: 500, label: '$500' },   // Most common choice - balanced risk/premium  
  { value: 1000, label: '$1,000' }, // Higher deductible - noticeable premium savings
  { value: 2000, label: '$2,000' }, // High deductible - maximum premium savings
];