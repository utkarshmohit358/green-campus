/**
 * GreenCampus - Sustainable Computing Configuration & Constants
 * 
 * Sources:
 * - Grid Emission Factor: Central Electricity Authority (CEA) of India,
 *   CO2 Baseline Database for the Indian Power Sector, User Guide v19.0.
 *   National Grid Average: ~0.710 kg CO2/kWh.
 * - Embodied Emissions: Dell, Apple, and IEEE life-cycle assessment (LCA) reports
 *   for consumer electronics and computer equipment.
 * - Equivalents: US EPA Greenhouse Gas Equivalencies Calculator & IPCC AR6.
 * - Commercial Energy Tariff: Average Indian State Discom Educational/Institutional
 *   tariff rate: ₹8.50 per kWh.
 */

export const GRID_EMISSION_FACTOR_INDIA = 0.71; // kg CO2 per kWh
export const ELECTRICITY_COST_PER_KWH_INR = 8.5; // Indian Rupees (₹) per kWh

export interface DeviceTypeConfig {
  id: string;
  name: string;
  category: 'computing' | 'display' | 'mobile' | 'network' | 'peripherals';
  defaultWatts: number;
  embodiedTotalKg: number; // Total cradle-to-grave manufacturing CO2e
  typicalLifespanYears: number; // Expected lifecycle before replacement
  icon: string;
  description: string;
}

export const DEVICE_CATALOG: Record<string, DeviceTypeConfig> = {
  laptop: {
    id: 'laptop',
    name: 'Laptop',
    category: 'computing',
    defaultWatts: 50,
    embodiedTotalKg: 280, // Apple/Dell LCA average for 14-16" laptop
    typicalLifespanYears: 4,
    icon: 'Laptop',
    description: 'Portable workstation / Ultrabook',
  },
  desktop: {
    id: 'desktop',
    name: 'Desktop PC & Tower',
    category: 'computing',
    defaultWatts: 160,
    embodiedTotalKg: 420,
    typicalLifespanYears: 5,
    icon: 'Monitor',
    description: 'High-performance tower / Workstation',
  },
  smartphone: {
    id: 'smartphone',
    name: 'Smartphone',
    category: 'mobile',
    defaultWatts: 5,
    embodiedTotalKg: 70, // ~80% of iPhone/Pixel footprint is embodied
    typicalLifespanYears: 3,
    icon: 'Smartphone',
    description: 'Personal mobile handset',
  },
  tablet: {
    id: 'tablet',
    name: 'Tablet / iPad',
    category: 'mobile',
    defaultWatts: 15,
    embodiedTotalKg: 115,
    typicalLifespanYears: 4,
    icon: 'Tablet',
    description: 'Touchscreen reading/computing device',
  },
  monitor: {
    id: 'monitor',
    name: 'External Display (24"-32")',
    category: 'display',
    defaultWatts: 35,
    embodiedTotalKg: 210,
    typicalLifespanYears: 6,
    icon: 'Tv',
    description: 'Standalone IPS/OLED desk monitor',
  },
  printer: {
    id: 'printer',
    name: 'Desk Printer / Scanner',
    category: 'peripherals',
    defaultWatts: 45,
    embodiedTotalKg: 140,
    typicalLifespanYears: 5,
    icon: 'Printer',
    description: 'Laser / Inkjet office peripheral',
  },
  router: {
    id: 'router',
    name: 'Wi-Fi Router / AP',
    category: 'network',
    defaultWatts: 12,
    embodiedTotalKg: 55,
    typicalLifespanYears: 5,
    icon: 'Wifi',
    description: '24/7 wireless networking gateway',
  },
  smartwatch: {
    id: 'smartwatch',
    name: 'Smartwatch / Wearable',
    category: 'mobile',
    defaultWatts: 2.5,
    embodiedTotalKg: 32,
    typicalLifespanYears: 3,
    icon: 'Watch',
    description: 'Wrist wearable with sensors',
  },
};

export type PowerMode = 'eco' | 'normal' | 'performance';

export const POWER_MODE_MULTIPLIERS: Record<PowerMode, number> = {
  eco: 0.72,        // Aggressive power savings, CPU undervolt, dimmed screen
  normal: 1.0,       // Standard OEM power profile
  performance: 1.35, // High performance, max brightness, turbo boost active
};

export const EQUIVALENCY_FACTORS = {
  kgCO2PerTreePerYear: 21.77, // Mature tree absorbs ~21.77 kg CO2 / year
  kgCO2PerKmDriven: 0.192,    // Average internal combustion passenger car (EPA)
  kgCO2PerPhoneCharge: 0.0082,// Charging typical 15Wh smartphone battery
  kgCO2PerLedBulbHour: 0.0071,// 10W LED bulb on India grid
};

/**
 * Green Score Multi-Factor Weights
 * (Transparently configurable and surfaced in Leaderboard UI)
 */
export const LEADERBOARD_WEIGHTS = {
  energyReductionPct: 0.35, // 35% weight: reduction in lab energy vs baseline
  perStudentFootprint: 0.25, // 25% weight: lower computing carbon intensity
  ewasteCollectionKg: 0.20, // 20% weight: kg e-waste diverted per capita
  participationRate: 0.20,   // 20% weight: student/staff engagement rate
};

/**
 * Material recovery rates per 1.0 kg of raw e-waste (WEEE standardized averages)
 */
export const EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG = {
  copper: 120,    // 120g copper
  aluminium: 85,  // 85g aluminium
  steel: 310,     // 310g steel / ferrous metal
  plastics: 240,  // 240g recyclable polymers
  gold: 0.028,    // 0.028g gold (high value in PCB fingers)
  silver: 0.18,   // 0.18g silver
};

export const EWASTE_CO2_AVOIDED_PER_KG = 1.88; // kg CO2 avoided by secondary material recovery vs virgin extraction
