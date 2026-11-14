import { getSupabaseBrowserClient, isSupabaseConfigured } from './client';
import { StorageService, type SavedFootprintRecord, type MeterReadingLog, type EWasteDonationLog } from '@/lib/storage';

export const SupabaseDatabase = {
  // Test connection
  async testConnection(): Promise<{ connected: boolean; latencyMs?: number; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        connected: false,
        message: 'Supabase credentials not configured. Running in Local Mock mode.',
      };
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      return { connected: false, message: 'Could not initialize Supabase client.' };
    }

    const start = performance.now();
    try {
      const { error } = await client.from('departments').select('id', { count: 'exact', head: true });
      const latencyMs = Math.round(performance.now() - start);

      if (error) {
        return {
          connected: false,
          latencyMs,
          message: `Connection error: ${error.message}. Please verify table schema.`,
        };
      }

      return {
        connected: true,
        latencyMs,
        message: `Successfully connected to Supabase PostgreSQL (${latencyMs}ms)`,
      };
    } catch (err: any) {
      return {
        connected: false,
        message: err?.message || 'Network error reaching Supabase host.',
      };
    }
  },

  // --- Footprint Calculations ---
  async saveFootprint(record: SavedFootprintRecord): Promise<{ success: boolean; source: 'supabase' | 'local' }> {
    // 1. Always persist to localStorage for instant offline access
    StorageService.saveFootprintRecord(record);

    // 2. If Supabase configured, push to public.footprint_records
    const client = getSupabaseBrowserClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await (client.from('footprint_records') as any).insert({
          id: record.id,
          student_name: record.studentName,
          department: record.department,
          inputs: record.inputs as any,
          result: record.result as any,
          grand_total_co2_kg: record.result.grandTotalCO2Kg,
          total_annual_kwh: record.result.totalAnnualKWh,
          greener_score: record.result.greenerScore,
          created_at: record.timestamp,
        });

        if (!error) {
          return { success: true, source: 'supabase' };
        }
      } catch {
        // fallback to local
      }
    }

    return { success: true, source: 'local' };
  },

  async getFootprintHistory(): Promise<SavedFootprintRecord[]> {
    const client = getSupabaseBrowserClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await (client
          .from('footprint_records') as any)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && (data as any[]).length > 0) {
          return (data as any[]).map((d: any) => ({
            id: d.id,
            timestamp: d.created_at,
            studentName: d.student_name,
            department: d.department,
            inputs: d.inputs as any,
            result: d.result as any,
          }));
        }
      } catch {
        // fallback
      }
    }

    return StorageService.getFootprintHistory();
  },

  // --- Meter Readings ---
  async logMeterReading(reading: MeterReadingLog): Promise<{ success: boolean; source: 'supabase' | 'local' }> {
    StorageService.addMeterReading(reading);

    const client = getSupabaseBrowserClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await (client.from('meter_readings') as any).insert({
          id: reading.id,
          lab_id: reading.labId,
          lab_name: reading.labName,
          department_id: reading.departmentId,
          reading_date: reading.date,
          kwh: reading.kwh,
          reported_by: reading.reportedBy,
          notes: reading.notes || null,
        });

        if (!error) {
          return { success: true, source: 'supabase' };
        }
      } catch {
        // fallback
      }
    }

    return { success: true, source: 'local' };
  },

  // --- E-Waste Donations ---
  async logEWasteDonation(donation: EWasteDonationLog): Promise<{ success: boolean; source: 'supabase' | 'local' }> {
    StorageService.addEWasteDonation(donation);

    const client = getSupabaseBrowserClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await (client.from('ewaste_donations') as any).insert({
          id: donation.id,
          donor_name: donation.donorName,
          donor_email: donation.donorEmail || null,
          department: donation.department,
          category: donation.category,
          item_description: donation.itemDescription,
          quantity: donation.quantity,
          estimated_weight_kg: donation.estimatedWeightKg,
          condition: donation.condition,
          date: donation.date,
          bin_location_id: donation.binLocationId,
        });

        if (!error) {
          return { success: true, source: 'supabase' };
        }
      } catch {
        // fallback
      }
    }

    return { success: true, source: 'local' };
  },

  // --- Sync local to Supabase ---
  async syncLocalToSupabase(): Promise<{ syncedFootprints: number; syncedReadings: number; syncedDonations: number }> {
    const client = getSupabaseBrowserClient();
    if (!client || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    const footprints = StorageService.getFootprintHistory();
    const readings = StorageService.getMeterReadings();
    const donations = StorageService.getEWasteDonations();

    let syncedFootprints = 0;
    let syncedReadings = 0;
    let syncedDonations = 0;

    for (const f of footprints) {
      const { error } = await (client.from('footprint_records') as any).upsert({
        id: f.id,
        student_name: f.studentName,
        department: f.department,
        inputs: f.inputs as any,
        result: f.result as any,
        grand_total_co2_kg: f.result.grandTotalCO2Kg,
        total_annual_kwh: f.result.totalAnnualKWh,
        greener_score: f.result.greenerScore,
        created_at: f.timestamp,
      });
      if (!error) syncedFootprints++;
    }

    for (const r of readings) {
      const { error } = await (client.from('meter_readings') as any).upsert({
        id: r.id,
        lab_id: r.labId,
        lab_name: r.labName,
        department_id: r.departmentId,
        reading_date: r.date,
        kwh: r.kwh,
        reported_by: r.reportedBy,
        notes: r.notes || null,
      });
      if (!error) syncedReadings++;
    }

    for (const d of donations) {
      const { error } = await (client.from('ewaste_donations') as any).upsert({
        id: d.id,
        donor_name: d.donorName,
        donor_email: d.donorEmail || null,
        department: d.department,
        category: d.category,
        item_description: d.itemDescription,
        quantity: d.quantity,
        estimated_weight_kg: d.estimatedWeightKg,
        condition: d.condition,
        date: d.date,
        bin_location_id: d.binLocationId,
      });
      if (!error) syncedDonations++;
    }

    return { syncedFootprints, syncedReadings, syncedDonations };
  },
};
