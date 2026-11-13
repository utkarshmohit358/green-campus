import {
  GRID_EMISSION_FACTOR_INDIA,
  POWER_MODE_MULTIPLIERS,
  EQUIVALENCY_FACTORS,
  LEADERBOARD_WEIGHTS,
  EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG,
  EWASTE_CO2_AVOIDED_PER_KG,
  DEVICE_CATALOG,
  ELECTRICITY_COST_PER_KWH_INR,
  type PowerMode,
} from './constants';

export interface UserDeviceInput {
  deviceId: string;
  deviceType: string;
  customName?: string;
  watts?: number;
  hoursPerDay: number;
  daysPerWeek: number;
  powerMode: PowerMode;
  deviceAgeYears: number;
}

export interface DeviceFootprintBreakdown {
  deviceId: string;
  deviceType: string;
  name: string;
  annualKWh: number;
  operationalCO2Kg: number;
  embodiedCO2Kg: number;
  totalCO2Kg: number;
  percentageOfTotal: number;
}

export interface FootprintCalculationResult {
  devices: DeviceFootprintBreakdown[];
  totalAnnualKWh: number;
  totalOperationalCO2Kg: number;
  totalEmbodiedCO2Kg: number;
  grandTotalCO2Kg: number;
  greenerScore: number; // 0 - 100
  equivalents: {
    treesNeeded: number;
    kmDriven: number;
    smartphoneCharges: number;
    ledBulbHours: number;
  };
  tips: PersonalizedTip[];
}

export interface PersonalizedTip {
  id: string;
  title: string;
  description: string;
  potentialReductionKg: number;
  badge: 'Quick Win' | 'Hardware' | 'Habit' | 'Procurement';
}

/**
 * Computes annual operational electricity usage in kilowatt-hours (kWh)
 * Formula: kWh = (watts × hours/day × days/week × 52 weeks) / 1000
 */
export function calculateOperationalKWh(
  watts: number,
  hoursPerDay: number,
  daysPerWeek: number,
  powerMode: PowerMode = 'normal'
): number {
  if (watts <= 0 || hoursPerDay <= 0 || daysPerWeek <= 0) return 0;
  const clampedHours = Math.min(24, Math.max(0, hoursPerDay));
  const clampedDays = Math.min(7, Math.max(0, daysPerWeek));
  const multiplier = POWER_MODE_MULTIPLIERS[powerMode] ?? 1.0;
  const effectiveWatts = watts * multiplier;

  const annualKWh = (effectiveWatts * clampedHours * clampedDays * 52) / 1000;
  return Number(annualKWh.toFixed(2));
}

/**
 * Computes annual operational carbon emissions in kg CO2
 * Formula: CO2 = kWh × grid emission factor
 */
export function calculateOperationalCO2(
  kWh: number,
  gridEmissionFactor = GRID_EMISSION_FACTOR_INDIA
): number {
  if (kWh <= 0) return 0;
  return Number((kWh * gridEmissionFactor).toFixed(2));
}

/**
 * Computes annualized embodied manufacturing emissions.
 * Formula: embodiedTotalKg / typicalLifespanYears
 * Bonus: if a device is kept beyond typical lifespan, the per-year burden decreases.
 */
export function calculateAnnualEmbodiedCO2(
  embodiedTotalKg: number,
  typicalLifespanYears: number,
  deviceAgeYears = 1
): number {
  if (embodiedTotalKg <= 0 || typicalLifespanYears <= 0) return 0;
  // If the user has kept the device longer than typical lifespan, spread across actual age
  const effectiveLifespan = Math.max(typicalLifespanYears, deviceAgeYears);
  return Number((embodiedTotalKg / effectiveLifespan).toFixed(2));
}

/**
 * Computes comprehensive footprint for a list of student/staff devices
 */
export function calculateFootprint(
  inputs: UserDeviceInput[],
  gridFactor = GRID_EMISSION_FACTOR_INDIA
): FootprintCalculationResult {
  if (!inputs || inputs.length === 0) {
    return {
      devices: [],
      totalAnnualKWh: 0,
      totalOperationalCO2Kg: 0,
      totalEmbodiedCO2Kg: 0,
      grandTotalCO2Kg: 0,
      greenerScore: 100,
      equivalents: {
        treesNeeded: 0,
        kmDriven: 0,
        smartphoneCharges: 0,
        ledBulbHours: 0,
      },
      tips: [],
    };
  }

  const calculatedItems = inputs.map((item) => {
    const catalogItem = DEVICE_CATALOG[item.deviceType] ?? {
      id: item.deviceType,
      name: item.customName || 'Custom Device',
      category: 'computing',
      defaultWatts: 45,
      embodiedTotalKg: 200,
      typicalLifespanYears: 4,
      icon: 'Laptop',
      description: 'Device',
    };

    const watts = item.watts && item.watts > 0 ? item.watts : catalogItem.defaultWatts;
    const annualKWh = calculateOperationalKWh(
      watts,
      item.hoursPerDay,
      item.daysPerWeek,
      item.powerMode
    );
    const operationalCO2Kg = calculateOperationalCO2(annualKWh, gridFactor);
    const embodiedCO2Kg = calculateAnnualEmbodiedCO2(
      catalogItem.embodiedTotalKg,
      catalogItem.typicalLifespanYears,
      item.deviceAgeYears
    );
    const totalCO2Kg = Number((operationalCO2Kg + embodiedCO2Kg).toFixed(2));

    return {
      deviceId: item.deviceId,
      deviceType: item.deviceType,
      name: item.customName || catalogItem.name,
      annualKWh,
      operationalCO2Kg,
      embodiedCO2Kg,
      totalCO2Kg,
      percentageOfTotal: 0,
    };
  });

  const grandTotalCO2Kg = Number(
    calculatedItems.reduce((acc, curr) => acc + curr.totalCO2Kg, 0).toFixed(2)
  );
  const totalAnnualKWh = Number(
    calculatedItems.reduce((acc, curr) => acc + curr.annualKWh, 0).toFixed(2)
  );
  const totalOperationalCO2Kg = Number(
    calculatedItems.reduce((acc, curr) => acc + curr.operationalCO2Kg, 0).toFixed(2)
  );
  const totalEmbodiedCO2Kg = Number(
    calculatedItems.reduce((acc, curr) => acc + curr.embodiedCO2Kg, 0).toFixed(2)
  );

  const devices = calculatedItems.map((d) => ({
    ...d,
    percentageOfTotal:
      grandTotalCO2Kg > 0 ? Number(((d.totalCO2Kg / grandTotalCO2Kg) * 100).toFixed(1)) : 0,
  }));

  const greenerScore = calculateGreenerScore(grandTotalCO2Kg);
  const equivalents = calculateEquivalents(grandTotalCO2Kg);
  const tips = getPersonalizedTips(inputs, grandTotalCO2Kg, calculatedItems);

  return {
    devices,
    totalAnnualKWh,
    totalOperationalCO2Kg,
    totalEmbodiedCO2Kg,
    grandTotalCO2Kg,
    greenerScore,
    equivalents,
    tips,
  };
}

/**
 * Greener Score (0 - 100):
 * Benchmark: typical university student digital footprint is ~160 kg CO2e/year.
 * If 50 kg -> 95+ score.
 * If 160 kg -> 75 score.
 * If 350+ kg -> 40 or below.
 */
export function calculateGreenerScore(totalCO2Kg: number): number {
  if (totalCO2Kg <= 0) return 100;
  // Non-linear decay from 100 down to 10
  const score = Math.max(10, Math.min(100, Math.round(100 - (totalCO2Kg / 300) * 60)));
  return score;
}

/**
 * Translates kg CO2 into intuitive physical equivalents
 */
export function calculateEquivalents(co2Kg: number) {
  if (co2Kg <= 0) {
    return {
      treesNeeded: 0,
      kmDriven: 0,
      smartphoneCharges: 0,
      ledBulbHours: 0,
    };
  }

  return {
    treesNeeded: Number((co2Kg / EQUIVALENCY_FACTORS.kgCO2PerTreePerYear).toFixed(1)),
    kmDriven: Math.round(co2Kg / EQUIVALENCY_FACTORS.kgCO2PerKmDriven),
    smartphoneCharges: Math.round(co2Kg / EQUIVALENCY_FACTORS.kgCO2PerPhoneCharge),
    ledBulbHours: Math.round(co2Kg / EQUIVALENCY_FACTORS.kgCO2PerLedBulbHour),
  };
}

/**
 * Generates 5+ actionable, personalized reduction tips based on device composition
 */
export function getPersonalizedTips(
  inputs: UserDeviceInput[],
  totalCO2Kg: number,
  breakdown: DeviceFootprintBreakdown[]
): PersonalizedTip[] {
  const tips: PersonalizedTip[] = [];

  const hasHighPerf = inputs.some((i) => i.powerMode === 'performance');
  if (hasHighPerf) {
    tips.push({
      id: 'switch-eco-mode',
      title: 'Enable Eco Power Profile',
      description:
        'Switching from Performance to Eco mode throttles unneeded background clock cycles and drops display brightness, reducing operational draw by ~30%.',
      potentialReductionKg: Number((totalCO2Kg * 0.18).toFixed(1)),
      badge: 'Quick Win',
    });
  }

  const hasDesktops = inputs.some((i) => i.deviceType === 'desktop');
  if (hasDesktops) {
    tips.push({
      id: 'smart-power-strip',
      title: 'Kill Vampire Desktop Draw with Smart Strip',
      description:
        'Desktop setups with multiple monitors draw up to 15W in standby phantom power. Use a master-controlled power strip to cut wall power after study hours.',
      potentialReductionKg: 34.5,
      badge: 'Hardware',
    });
  }

  const laptopItem = breakdown.find((b) => b.deviceType === 'laptop');
  if (laptopItem && laptopItem.embodiedCO2Kg > 50) {
    tips.push({
      id: 'extend-laptop-lifecycle',
      title: 'Extend Laptop Life from 3 to 5 Years',
      description:
        'Manufacturing accounts for 75%+ of a laptop’s lifetime carbon. Replacing the thermal paste and upgrading the SSD gives 2 extra years of prime performance while saving ~70 kg CO2/yr.',
      potentialReductionKg: 35.0,
      badge: 'Procurement',
    });
  }

  tips.push({
    id: 'shutdown-vs-sleep',
    title: 'Full Shutdown Overnight vs. Long Sleep',
    description:
      'Laptops in connected sleep still poll campus Wi-Fi and sync background tasks. Powering down completely every night avoids ~18 kWh annually per device.',
    potentialReductionKg: 12.8,
    badge: 'Habit',
  });

  tips.push({
    id: 'buy-refurbished-certified',
    title: 'Choose Refurbished & Modular Hardware Next Time',
    description:
      'Refurbished or enterprise-off-lease devices eliminate 90% of upstream manufacturing carbon and reduce campus electronic waste stream pressures.',
    potentialReductionKg: 48.0,
    badge: 'Procurement',
  });

  tips.push({
    id: 'optimize-browser-tabs',
    title: 'Tame Idle Browser Tabs & Tab Sleeping',
    description:
      '50 open Chrome tabs keep your CPU awake in C0 sleep state. Enable automatic tab discard/freeze to drop baseline RAM and battery drain by 22%.',
    potentialReductionKg: 9.4,
    badge: 'Habit',
  });

  return tips;
}

/**
 * Lab Electricity What-If Savings Projection
 * Calculates savings if idle computers are shut down after 6 PM.
 */
export function calculateWhatIfSavings(
  currentMonthlyKWh: number,
  pcsCount: number,
  idleHoursPerDay: number,
  gridFactor = GRID_EMISSION_FACTOR_INDIA,
  tariffInr = ELECTRICITY_COST_PER_KWH_INR
) {
  // Average PC idle power: ~60 Watts
  const pcIdleWatts = 60;
  const daysPerMonth = 26; // College operational days per month
  const monthlySavedKWh = (pcsCount * pcIdleWatts * idleHoursPerDay * daysPerMonth) / 1000;
  const clampedSavedKWh = Math.min(currentMonthlyKWh * 0.45, monthlySavedKWh); // realistic upper limit

  const co2SavedKg = Number((clampedSavedKWh * gridFactor).toFixed(1));
  const costSavedInr = Number((clampedSavedKWh * tariffInr).toFixed(0));
  const pctSaved = currentMonthlyKWh > 0 ? Number(((clampedSavedKWh / currentMonthlyKWh) * 100).toFixed(1)) : 0;

  return {
    monthlySavedKWh: Number(clampedSavedKWh.toFixed(1)),
    co2SavedKg,
    costSavedInr,
    pctSaved,
  };
}

/**
 * Department Green Score Calculation (0 - 100)
 * Uses multi-factor weighted algorithm:
 * - Energy Reduction: 35%
 * - Per-Student Footprint: 25% (lower is better)
 * - E-Waste Collection Per Head: 20% (higher is better)
 * - Participation Rate: 20%
 */
export function calculateDepartmentGreenScore(
  energyReductionPct: number, // e.g. 18.5%
  perStudentFootprintKg: number, // e.g. 85 kg
  ewasteKgPerCapita: number, // e.g. 1.8 kg
  participationRatePct: number, // e.g. 78%
  weights = LEADERBOARD_WEIGHTS
): number {
  // 1. Energy score: 0% reduction = 50 pts, +25% reduction = 100 pts, -10% reduction = 20 pts
  const energyScore = Math.max(0, Math.min(100, 50 + energyReductionPct * 2));

  // 2. Per-student score: 50 kg -> 95 pts, 120 kg -> 65 pts, 200+ kg -> 30 pts
  const footprintScore = Math.max(10, Math.min(100, 110 - (perStudentFootprintKg / 150) * 50));

  // 3. E-waste collection score: 2.5 kg/student = 100 pts, 0.5 kg/student = 40 pts
  const ewasteScore = Math.max(10, Math.min(100, (ewasteKgPerCapita / 2.0) * 80 + 20));

  // 4. Participation score: directly 0 - 100
  const participationScore = Math.max(0, Math.min(100, participationRatePct));

  const compositeScore =
    energyScore * weights.energyReductionPct +
    footprintScore * weights.perStudentFootprint +
    ewasteScore * weights.ewasteCollectionKg +
    participationScore * weights.participationRate;

  return Number(compositeScore.toFixed(1));
}

/**
 * E-Waste Material & Carbon Recovery Analysis
 */
export function calculateEwasteRecovery(totalKgCollected: number) {
  const copperGrams = totalKgCollected * EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG.copper;
  const aluminiumGrams = totalKgCollected * EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG.aluminium;
  const goldGrams = totalKgCollected * EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG.gold;
  const silverGrams = totalKgCollected * EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG.silver;
  const steelGrams = totalKgCollected * EWASTE_MATERIAL_RECOVERY_GRAMS_PER_KG.steel;
  const co2AvoidedKg = totalKgCollected * EWASTE_CO2_AVOIDED_PER_KG;

  return {
    totalKgCollected,
    co2AvoidedKg: Number(co2AvoidedKg.toFixed(1)),
    copperKg: Number((copperGrams / 1000).toFixed(2)),
    aluminiumKg: Number((aluminiumGrams / 1000).toFixed(2)),
    goldGrams: Number(goldGrams.toFixed(2)),
    silverGrams: Number(silverGrams.toFixed(2)),
    steelKg: Number((steelGrams / 1000).toFixed(2)),
  };
}
