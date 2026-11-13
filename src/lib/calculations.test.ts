import { describe, it, expect } from 'vitest';
import {
  calculateOperationalKWh,
  calculateOperationalCO2,
  calculateAnnualEmbodiedCO2,
  calculateFootprint,
  calculateGreenerScore,
  calculateEquivalents,
  calculateWhatIfSavings,
  calculateDepartmentGreenScore,
  calculateEwasteRecovery,
  type UserDeviceInput,
} from './calculations';
import { GRID_EMISSION_FACTOR_INDIA } from './constants';

describe('GreenCampus Core Environmental Calculations', () => {
  describe('calculateOperationalKWh', () => {
    it('accurately computes annual kWh for normal power mode', () => {
      // 50 Watts laptop, 8 hours/day, 5 days/week, 52 weeks
      // (50 * 8 * 5 * 52) / 1000 = 104 kWh
      const kWh = calculateOperationalKWh(50, 8, 5, 'normal');
      expect(kWh).toBe(104);
    });

    it('scales properly with eco and performance power modes', () => {
      const normalKWh = calculateOperationalKWh(100, 10, 5, 'normal');
      const ecoKWh = calculateOperationalKWh(100, 10, 5, 'eco');
      const perfKWh = calculateOperationalKWh(100, 10, 5, 'performance');

      expect(ecoKWh).toBeLessThan(normalKWh);
      expect(perfKWh).toBeGreaterThan(normalKWh);
      expect(ecoKWh).toBeCloseTo(normalKWh * 0.72, 1);
    });

    it('handles zero or negative inputs cleanly', () => {
      expect(calculateOperationalKWh(0, 8, 5)).toBe(0);
      expect(calculateOperationalKWh(50, 0, 5)).toBe(0);
      expect(calculateOperationalKWh(50, 8, -2)).toBe(0);
    });
  });

  describe('calculateOperationalCO2', () => {
    it('applies Indian grid emission factor accurately', () => {
      // 100 kWh * 0.71 = 71 kg CO2
      const co2 = calculateOperationalCO2(100, GRID_EMISSION_FACTOR_INDIA);
      expect(co2).toBe(71);
    });

    it('returns 0 for 0 kWh', () => {
      expect(calculateOperationalCO2(0)).toBe(0);
    });
  });

  describe('calculateAnnualEmbodiedCO2', () => {
    it('amortizes cradle-to-grave emissions over lifespan', () => {
      // 280 kg / 4 years = 70 kg/year
      const amortized = calculateAnnualEmbodiedCO2(280, 4, 1);
      expect(amortized).toBe(70);
    });

    it('rewards lifecycle extension when device age exceeds typical lifespan', () => {
      // Device kept for 6 years instead of 4: 280 / 6 = 46.67 kg/year
      const extended = calculateAnnualEmbodiedCO2(280, 4, 6);
      expect(extended).toBe(46.67);
      expect(extended).toBeLessThan(70);
    });
  });

  describe('calculateFootprint comprehensive suite', () => {
    const mockInputs: UserDeviceInput[] = [
      {
        deviceId: 'dev-1',
        deviceType: 'laptop',
        hoursPerDay: 6,
        daysPerWeek: 5,
        powerMode: 'normal',
        deviceAgeYears: 2,
      },
      {
        deviceId: 'dev-2',
        deviceType: 'smartphone',
        hoursPerDay: 4,
        daysPerWeek: 7,
        powerMode: 'eco',
        deviceAgeYears: 1,
      },
    ];

    it('computes total operational, embodied, grand total, and greener score', () => {
      const result = calculateFootprint(mockInputs);
      expect(result.devices.length).toBe(2);
      expect(result.grandTotalCO2Kg).toBeGreaterThan(0);
      expect(result.totalAnnualKWh).toBeGreaterThan(0);
      expect(result.greenerScore).toBeGreaterThan(0);
      expect(result.greenerScore).toBeLessThanOrEqual(100);
      expect(result.equivalents.treesNeeded).toBeGreaterThan(0);
      expect(result.tips.length).toBeGreaterThanOrEqual(4);
    });

    it('handles empty input gracefully', () => {
      const emptyResult = calculateFootprint([]);
      expect(emptyResult.devices.length).toBe(0);
      expect(emptyResult.grandTotalCO2Kg).toBe(0);
      expect(emptyResult.greenerScore).toBe(100);
    });

    it('calculates greener score accurately with decay curve', () => {
      expect(calculateGreenerScore(0)).toBe(100);
      expect(calculateGreenerScore(50)).toBeGreaterThan(80);
      expect(calculateGreenerScore(300)).toBeLessThanOrEqual(45);
    });
  });

  describe('calculateEquivalents', () => {
    it('returns equivalent trees, km, charges, and LED bulb hours', () => {
      const eq = calculateEquivalents(100); // 100 kg CO2
      expect(eq.treesNeeded).toBeCloseTo(100 / 21.77, 1);
      expect(eq.kmDriven).toBe(Math.round(100 / 0.192));
      expect(eq.smartphoneCharges).toBeGreaterThan(10000);
      expect(eq.ledBulbHours).toBeGreaterThan(14000);
    });
  });

  describe('calculateWhatIfSavings', () => {
    it('estimates kWh, CO2, and INR savings from idle PC shutdowns', () => {
      const savings = calculateWhatIfSavings(5000, 100, 4); // 100 PCs, 4 idle hrs saved
      expect(savings.monthlySavedKWh).toBeGreaterThan(0);
      expect(savings.co2SavedKg).toBeGreaterThan(0);
      expect(savings.costSavedInr).toBeGreaterThan(0);
      expect(savings.pctSaved).toBeGreaterThan(0);
    });
  });

  describe('calculateDepartmentGreenScore', () => {
    it('produces a balanced score between 0 and 100', () => {
      const highPerformer = calculateDepartmentGreenScore(22, 60, 2.4, 85);
      const lowPerformer = calculateDepartmentGreenScore(-5, 160, 0.4, 30);

      expect(highPerformer).toBeGreaterThan(80);
      expect(lowPerformer).toBeLessThan(50);
      expect(highPerformer).toBeGreaterThan(lowPerformer);
    });
  });

  describe('calculateEwasteRecovery', () => {
    it('calculates extracted precious metals and avoided CO2 from ewaste', () => {
      const recovery = calculateEwasteRecovery(500); // 500 kg
      expect(recovery.co2AvoidedKg).toBe(500 * 1.88);
      expect(recovery.copperKg).toBe(60); // 500 * 120g = 60 kg
      expect(recovery.goldGrams).toBe(14); // 500 * 0.028g = 14 g
      expect(recovery.steelKg).toBe(155);
    });
  });
});
