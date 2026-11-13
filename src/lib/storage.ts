import { UserDeviceInput, FootprintCalculationResult } from './calculations';
import { UserRole, UserSession, DEFAULT_USER_SESSION } from './utils';

export interface SavedFootprintRecord {
  id: string;
  timestamp: string;
  studentName: string;
  department: string;
  inputs: UserDeviceInput[];
  result: FootprintCalculationResult;
}

export interface MeterReadingLog {
  id: string;
  labId: string;
  labName: string;
  departmentId: string;
  date: string;
  kwh: number;
  reportedBy: string;
  notes?: string;
}

export interface EWasteDonationLog {
  id: string;
  donorName: string;
  donorEmail?: string;
  department: string;
  category: string;
  itemDescription: string;
  quantity: number;
  estimatedWeightKg: number;
  condition: 'working' | 'repairable' | 'end-of-life';
  date: string;
  binLocationId: string;
}

const STORAGE_KEYS = {
  FOOTPRINT_HISTORY: 'greencampus_footprint_history',
  CURRENT_SESSION: 'greencampus_user_session',
  THEME_MODE: 'greencampus_theme_mode',
  CUSTOM_METER_READINGS: 'greencampus_meter_readings',
  CUSTOM_EWASTE_LOGS: 'greencampus_ewaste_logs',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const StorageService = {
  // --- Footprint History ---
  getFootprintHistory(): SavedFootprintRecord[] {
    if (!isClient()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FOOTPRINT_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveFootprintRecord(record: SavedFootprintRecord): void {
    if (!isClient()) return;
    const history = this.getFootprintHistory();
    const updated = [record, ...history].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.FOOTPRINT_HISTORY, JSON.stringify(updated));
  },

  // --- Session & Role ---
  getUserSession(): UserSession {
    if (!isClient()) return DEFAULT_USER_SESSION;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return raw ? JSON.parse(raw) : DEFAULT_USER_SESSION;
    } catch {
      return DEFAULT_USER_SESSION;
    }
  },

  setUserRole(role: UserRole): UserSession {
    if (!isClient()) return { ...DEFAULT_USER_SESSION, role };
    const current = this.getUserSession();
    const updated: UserSession = {
      ...current,
      role,
      name:
        role === 'campus_admin'
          ? 'Dr. Rajesh Verma (Campus Sustainability Officer)'
          : role === 'dept_admin'
          ? 'Prof. Sunita Rao (CSE Dept Chair)'
          : 'Aarav Sharma (3rd Yr CS)',
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(updated));
    return updated;
  },

  // --- Meter Readings ---
  getMeterReadings(): MeterReadingLog[] {
    if (!isClient()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_METER_READINGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addMeterReading(reading: MeterReadingLog): void {
    if (!isClient()) return;
    const existing = this.getMeterReadings();
    localStorage.setItem(STORAGE_KEYS.CUSTOM_METER_READINGS, JSON.stringify([reading, ...existing]));
  },

  // --- E-Waste Logs ---
  getEWasteDonations(): EWasteDonationLog[] {
    if (!isClient()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EWASTE_LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addEWasteDonation(donation: EWasteDonationLog): void {
    if (!isClient()) return;
    const existing = this.getEWasteDonations();
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EWASTE_LOGS, JSON.stringify([donation, ...existing]));
  },
};
