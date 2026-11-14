export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          code: string;
          name: string;
          building: string;
          floors: string;
          student_count: number;
          faculty_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          code: string;
          name: string;
          building: string;
          floors: string;
          student_count?: number;
          faculty_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          building?: string;
          floors?: string;
          student_count?: number;
          faculty_count?: number;
          created_at?: string;
        };
      };
      labs: {
        Row: {
          id: string;
          department_id: string;
          name: string;
          room: string;
          pc_count: number;
          has_gpus: boolean;
          hours_open_per_day: number;
          monthly_target_kwh: number;
          current_monthly_kwh: number;
          anomaly_alert: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          department_id: string;
          name: string;
          room: string;
          pc_count?: number;
          has_gpus?: boolean;
          hours_open_per_day?: number;
          monthly_target_kwh?: number;
          current_monthly_kwh?: number;
          anomaly_alert?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          name?: string;
          room?: string;
          pc_count?: number;
          has_gpus?: boolean;
          hours_open_per_day?: number;
          monthly_target_kwh?: number;
          current_monthly_kwh?: number;
          anomaly_alert?: string | null;
          created_at?: string;
        };
      };
      meter_readings: {
        Row: {
          id: string;
          lab_id: string;
          lab_name: string;
          department_id: string;
          reading_date: string;
          kwh: number;
          reported_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lab_id: string;
          lab_name: string;
          department_id: string;
          reading_date?: string;
          kwh: number;
          reported_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lab_id?: string;
          lab_name?: string;
          department_id?: string;
          reading_date?: string;
          kwh?: number;
          reported_by?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      ewaste_categories: {
        Row: {
          id: string;
          name: string;
          weight_kg: number;
          units: number;
          co2_avoided_kg: number;
          color: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          weight_kg?: number;
          units?: number;
          co2_avoided_kg?: number;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          weight_kg?: number;
          units?: number;
          co2_avoided_kg?: number;
          color?: string;
          created_at?: string;
        };
      };
      ewaste_bins: {
        Row: {
          id: string;
          name: string;
          building: string;
          floor: string;
          fill_pct: number;
          capacity_kg: number;
          current_kg: number;
          coords_x: number;
          coords_y: number;
          status: string;
          last_emptied: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          building: string;
          floor: string;
          fill_pct?: number;
          capacity_kg?: number;
          current_kg?: number;
          coords_x?: number;
          coords_y?: number;
          status?: string;
          last_emptied?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          building?: string;
          floor?: string;
          fill_pct?: number;
          capacity_kg?: number;
          current_kg?: number;
          coords_x?: number;
          coords_y?: number;
          status?: string;
          last_emptied?: string;
          created_at?: string;
        };
      };
      ewaste_donations: {
        Row: {
          id: string;
          donor_name: string;
          donor_email: string | null;
          department: string;
          category: string;
          item_description: string;
          quantity: number;
          estimated_weight_kg: number;
          condition: string;
          date: string;
          bin_location_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_name: string;
          donor_email?: string | null;
          department: string;
          category: string;
          item_description: string;
          quantity?: number;
          estimated_weight_kg: number;
          condition?: string;
          date?: string;
          bin_location_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_name?: string;
          donor_email?: string | null;
          department?: string;
          category?: string;
          item_description?: string;
          quantity?: number;
          estimated_weight_kg?: number;
          condition?: string;
          date?: string;
          bin_location_id?: string;
          created_at?: string;
        };
      };
      footprint_records: {
        Row: {
          id: string;
          student_name: string;
          department: string;
          inputs: Json;
          result: Json;
          grand_total_co2_kg: number;
          total_annual_kwh: number;
          greener_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          department: string;
          inputs?: Json;
          result?: Json;
          grand_total_co2_kg?: number;
          total_annual_kwh?: number;
          greener_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_name?: string;
          department?: string;
          inputs?: Json;
          result?: Json;
          grand_total_co2_kg?: number;
          total_annual_kwh?: number;
          greener_score?: number;
          created_at?: string;
        };
      };
      department_rankings: {
        Row: {
          department_id: string;
          department_name: string;
          code: string;
          rank: number;
          previous_rank: number;
          green_score: number;
          energy_reduction_pct: number;
          per_student_footprint_kg: number;
          ewaste_kg_per_capita: number;
          participation_rate_pct: number;
          badges: string[];
          sparkline: number[];
          month_score: number;
          semester_score: number;
          all_time_score: number;
          updated_at: string;
        };
        Insert: {
          department_id: string;
          department_name: string;
          code: string;
          rank: number;
          previous_rank?: number;
          green_score?: number;
          energy_reduction_pct?: number;
          per_student_footprint_kg?: number;
          ewaste_kg_per_capita?: number;
          participation_rate_pct?: number;
          badges?: string[];
          sparkline?: number[];
          month_score?: number;
          semester_score?: number;
          all_time_score?: number;
          updated_at?: string;
        };
        Update: {
          department_id?: string;
          department_name?: string;
          code?: string;
          rank?: number;
          previous_rank?: number;
          green_score?: number;
          energy_reduction_pct?: number;
          per_student_footprint_kg?: number;
          ewaste_kg_per_capita?: number;
          participation_rate_pct?: number;
          badges?: string[];
          sparkline?: number[];
          month_score?: number;
          semester_score?: number;
          all_time_score?: number;
          updated_at?: string;
        };
      };
    };
  };
}
