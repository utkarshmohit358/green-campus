-- ==============================================================================
-- GreenCampus - Institutional Sustainable Computing Database Schema
-- Supabase PostgreSQL Schema & Initial Seed
-- Aligned with UN SDG 12 (Responsible Consumption) & SDG 13 (Climate Action)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floors TEXT NOT NULL,
  student_count INT NOT NULL DEFAULT 0,
  faculty_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COMPUTER LABS TABLE
CREATE TABLE IF NOT EXISTS public.labs (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room TEXT NOT NULL,
  pc_count INT NOT NULL DEFAULT 0,
  has_gpus BOOLEAN NOT NULL DEFAULT FALSE,
  hours_open_per_day INT NOT NULL DEFAULT 8,
  monthly_target_kwh NUMERIC NOT NULL DEFAULT 2000,
  current_monthly_kwh NUMERIC NOT NULL DEFAULT 2000,
  anomaly_alert TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LAB SUB-METER READINGS (Historical & Logged)
CREATE TABLE IF NOT EXISTS public.meter_readings (
  id TEXT PRIMARY KEY DEFAULT ('reading-' || uuid_generate_v4()),
  lab_id TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
  kwh NUMERIC NOT NULL CHECK (kwh > 0),
  reported_by TEXT NOT NULL DEFAULT 'Anonymous User',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. E-WASTE CATEGORIES
CREATE TABLE IF NOT EXISTS public.ewaste_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL DEFAULT 0,
  units INT NOT NULL DEFAULT 0,
  co2_avoided_kg NUMERIC NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#10B981',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SMART E-WASTE BINS TELEMETRY
CREATE TABLE IF NOT EXISTS public.ewaste_bins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor TEXT NOT NULL,
  fill_pct INT NOT NULL DEFAULT 0 CHECK (fill_pct >= 0 AND fill_pct <= 100),
  capacity_kg NUMERIC NOT NULL DEFAULT 50,
  current_kg NUMERIC NOT NULL DEFAULT 0,
  coords_x NUMERIC NOT NULL DEFAULT 50,
  coords_y NUMERIC NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'normal',
  last_emptied DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. E-WASTE DONATIONS & DROP-OFF LOGS
CREATE TABLE IF NOT EXISTS public.ewaste_donations (
  id TEXT PRIMARY KEY DEFAULT ('donation-' || uuid_generate_v4()),
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  item_description TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  estimated_weight_kg NUMERIC NOT NULL CHECK (estimated_weight_kg > 0),
  condition TEXT NOT NULL DEFAULT 'working',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  bin_location_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. STUDENT DEVICE FOOTPRINT CALCULATIONS
CREATE TABLE IF NOT EXISTS public.footprint_records (
  id TEXT PRIMARY KEY DEFAULT ('footprint-' || uuid_generate_v4()),
  student_name TEXT NOT NULL,
  department TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '[]'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  grand_total_co2_kg NUMERIC NOT NULL DEFAULT 0,
  total_annual_kwh NUMERIC NOT NULL DEFAULT 0,
  greener_score INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DEPARTMENT SUSTAINABILITY RANKINGS
CREATE TABLE IF NOT EXISTS public.department_rankings (
  department_id TEXT PRIMARY KEY REFERENCES public.departments(id) ON DELETE CASCADE,
  department_name TEXT NOT NULL,
  code TEXT NOT NULL,
  rank INT NOT NULL,
  previous_rank INT NOT NULL,
  green_score NUMERIC NOT NULL DEFAULT 50,
  energy_reduction_pct NUMERIC NOT NULL DEFAULT 0,
  per_student_footprint_kg NUMERIC NOT NULL DEFAULT 70,
  ewaste_kg_per_capita NUMERIC NOT NULL DEFAULT 1.0,
  participation_rate_pct NUMERIC NOT NULL DEFAULT 50,
  badges TEXT[] NOT NULL DEFAULT '{}',
  sparkline NUMERIC[] NOT NULL DEFAULT '{}',
  month_score NUMERIC NOT NULL DEFAULT 50,
  semester_score NUMERIC NOT NULL DEFAULT 50,
  all_time_score NUMERIC NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INDEXES FOR HIGH QUERY SPEED
CREATE INDEX IF NOT EXISTS idx_labs_department ON public.labs(department_id);
CREATE INDEX IF NOT EXISTS idx_meter_readings_date ON public.meter_readings(reading_date);
CREATE INDEX IF NOT EXISTS idx_ewaste_donations_date ON public.ewaste_donations(date);
CREATE INDEX IF NOT EXISTS idx_footprint_records_created ON public.footprint_records(created_at DESC);

-- 11. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewaste_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewaste_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewaste_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footprint_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_rankings ENABLE ROW LEVEL SECURITY;

-- 12. PERMISSIVE POLICIES FOR DEMO / ACADEMIC ACCESS
-- Read access: Public
CREATE POLICY "Allow public read access on departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access on labs" ON public.labs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on meter_readings" ON public.meter_readings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on ewaste_categories" ON public.ewaste_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on ewaste_bins" ON public.ewaste_bins FOR SELECT USING (true);
CREATE POLICY "Allow public read access on ewaste_donations" ON public.ewaste_donations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on footprint_records" ON public.footprint_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access on department_rankings" ON public.department_rankings FOR SELECT USING (true);

-- Insert access: Allow campus users to log readings, drop-offs, and footprints
CREATE POLICY "Allow public insert on meter_readings" ON public.meter_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on ewaste_donations" ON public.ewaste_donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on footprint_records" ON public.footprint_records FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Insert Departments
INSERT INTO public.departments (id, code, name, building, floors, student_count, faculty_count)
VALUES
  ('cse', 'CSE', 'Computer Science & Engineering', 'Alan Turing Tech Block', '3rd & 4th Floors', 840, 42),
  ('it', 'IT', 'Information Technology', 'Grace Hopper Complex', '2nd Floor', 620, 31),
  ('ece', 'ECE', 'Electronics & Communication', 'J.C. Bose Hall of Engineering', 'Ground & 1st Floor', 710, 38),
  ('ee', 'EE', 'Electrical Engineering', 'Tesla Center for Energy Sciences', '1st Floor', 540, 28),
  ('mech', 'MECH', 'Mechanical Engineering', 'Visvesvaraya Mechanical Complex', 'Ground Floor', 680, 35),
  ('civil', 'CIVIL', 'Civil Engineering', 'Sir M.V. Infrastructure Wing', '2nd Floor', 510, 26),
  ('mba', 'MBA', 'School of Management Studies', 'Chanakya Management Tower', '3rd Floor', 420, 24),
  ('bio', 'BIO', 'Biotechnology & Bioinformatics', 'Rosalind Franklin Genomics Pavilion', '4th Floor', 380, 22)
ON CONFLICT (id) DO NOTHING;

-- Insert Computer Labs
INSERT INTO public.labs (id, department_id, name, room, pc_count, has_gpus, hours_open_per_day, monthly_target_kwh, current_monthly_kwh, anomaly_alert)
VALUES
  ('cse-lab-1', 'cse', 'AI & Deep Learning Research Lab', 'TB-401', 60, true, 14, 4200, 3950, null),
  ('cse-lab-2', 'cse', 'Cloud Computing & Systems Lab', 'TB-408', 55, false, 12, 2800, 3150, 'High baseline overnight: 18 workstations left powered on between 11 PM and 6 AM.'),
  ('cse-lab-3', 'cse', 'Software Engineering & Algorithmic Lab', 'TB-302', 70, false, 10, 2900, 2680, null),
  ('it-lab-1', 'it', 'Cybersecurity & Forensic Computing Lab', 'GH-202', 50, false, 11, 2400, 2210, null),
  ('it-lab-2', 'it', 'Web & Mobile App Dev Studio', 'GH-206', 65, false, 10, 2700, 2520, null),
  ('ece-lab-1', 'ece', 'VLSI Design & Embedded Systems Lab', 'JCB-104', 45, false, 11, 2100, 1940, null),
  ('ece-lab-2', 'ece', 'Digital Signal Processing & IoT Lab', 'JCB-112', 50, false, 10, 2200, 2180, null),
  ('ee-lab-1', 'ee', 'Smart Grid & Power Simulation Lab', 'TC-105', 40, false, 9, 1700, 1580, null),
  ('mech-lab-1', 'mech', 'CAD/CAM & FEA Simulation Studio', 'VMC-08', 50, true, 10, 2600, 2480, null),
  ('civil-lab-1', 'civil', 'GIS & Computational Structural Analysis Lab', 'MV-204', 35, false, 8, 1400, 1320, null),
  ('mba-lab-1', 'mba', 'Financial Analytics & Bloomberg Terminal Lab', 'CMT-301', 40, false, 9, 1600, 1490, null),
  ('bio-lab-1', 'bio', 'Genomic Sequence Processing Center', 'RF-402', 30, true, 12, 2000, 1920, null)
ON CONFLICT (id) DO NOTHING;

-- Insert E-Waste Categories
INSERT INTO public.ewaste_categories (id, name, weight_kg, units, co2_avoided_kg, color)
VALUES
  ('laptops', 'Laptops & Notebooks', 1240, 490, 2331, '#10B981'),
  ('desktops', 'Desktop Towers & Workstations', 1680, 210, 3158, '#0B3D2E'),
  ('phones', 'Smartphones & Mobile Handsets', 240, 680, 451, '#34D399'),
  ('batteries', 'Li-ion & UPS Battery Packs', 420, 180, 790, '#F59E0B'),
  ('cables', 'Cables, Chargers & Adapters', 380, 890, 714, '#6366F1'),
  ('printers', 'Printers, Cartridges & Scanners', 510, 45, 958, '#EC4899'),
  ('peripherals', 'Keyboards, Mice & Peripherals', 260, 430, 488, '#06B6D4'),
  ('other', 'Network Switches & Circuit Boards', 90, 85, 169, '#8B5CF6')
ON CONFLICT (id) DO NOTHING;

-- Insert Smart E-Waste Bins
INSERT INTO public.ewaste_bins (id, name, building, floor, fill_pct, capacity_kg, current_kg, coords_x, coords_y, status, last_emptied)
VALUES
  ('bin-1', 'Central Library Atrium Bin', 'Tagore Central Library', 'Ground Floor Lobby', 82, 50, 41, 48, 42, 'near_full', CURRENT_DATE - INTERVAL '14 days'),
  ('bin-2', 'Computer Science Tech Block Bin', 'Alan Turing Tech Block', '2nd Floor East Wing', 45, 60, 27, 28, 28, 'normal', CURRENT_DATE - INTERVAL '8 days'),
  ('bin-3', 'Electronics & Electrical Wing Bin', 'J.C. Bose Hall', '1st Floor Stairwell', 92, 50, 46, 35, 68, 'critical', CURRENT_DATE - INTERVAL '20 days'),
  ('bin-4', 'Student Activity Center (SAC) Bin', 'Vivekananda Student Hub', 'Recreation Area', 30, 40, 12, 72, 35, 'normal', CURRENT_DATE - INTERVAL '4 days'),
  ('bin-5', 'Mechanical Workshops Bin', 'Visvesvaraya Complex', 'Lab 1 Entrance', 60, 80, 48, 65, 74, 'normal', CURRENT_DATE - INTERVAL '12 days'),
  ('bin-6', 'Hostel Zone Recycling Kiosk', 'Aryabhata Residence Block', 'Common Room', 75, 50, 37.5, 84, 58, 'normal', CURRENT_DATE - INTERVAL '11 days')
ON CONFLICT (id) DO NOTHING;

-- Insert Department Rankings
INSERT INTO public.department_rankings (department_id, department_name, code, rank, previous_rank, green_score, energy_reduction_pct, per_student_footprint_kg, ewaste_kg_per_capita, participation_rate_pct, badges, sparkline, month_score, semester_score, all_time_score)
VALUES
  ('it', 'Information Technology', 'IT', 1, 2, 92.4, 22.8, 64.2, 2.45, 88.5, ARRAY['Energy Champion', 'Highest E-Waste', 'Zero Phantom Load'], ARRAY[84, 86, 88, 89, 91, 92.4], 92.4, 91.8, 89.2),
  ('cse', 'Computer Science & Engineering', 'CSE', 2, 1, 90.8, 19.4, 68.5, 2.65, 94.0, ARRAY['Top Participation', 'Refurbishment Hero'], ARRAY[88, 89, 92, 90, 89.5, 90.8], 90.8, 90.2, 91.5),
  ('ece', 'Electronics & Communication', 'ECE', 3, 4, 87.2, 16.5, 72.1, 2.15, 82.0, ARRAY['Hardware Upcycler', 'Power Factor A+'], ARRAY[80, 82, 83, 85, 86, 87.2], 87.2, 86.1, 84.6),
  ('ee', 'Electrical Engineering', 'EE', 4, 3, 85.0, 18.2, 74.0, 1.75, 79.5, ARRAY['Smart Grid Innovator'], ARRAY[82, 84, 85, 83, 84.5, 85.0], 85.0, 84.2, 83.9),
  ('mech', 'Mechanical Engineering', 'MECH', 5, 6, 81.6, 14.8, 79.4, 1.62, 74.0, ARRAY['CAD Sleep Pioneer'], ARRAY[75, 77, 78, 79, 80.5, 81.6], 81.6, 80.2, 78.4),
  ('bio', 'Biotechnology & Bioinformatics', 'BIO', 6, 5, 79.5, 12.5, 82.0, 1.48, 71.0, ARRAY['Green Genomics'], ARRAY[76, 76, 78, 77.5, 78.5, 79.5], 79.5, 78.5, 77.1),
  ('civil', 'Civil Engineering', 'CIVIL', 7, 8, 76.2, 11.2, 86.5, 1.25, 68.0, ARRAY['Sustainable Infrastructure'], ARRAY[72, 73, 74, 75, 75.8, 76.2], 76.2, 75.5, 74.0),
  ('mba', 'School of Management Studies', 'MBA', 8, 7, 74.8, 9.8, 89.2, 1.10, 65.5, ARRAY['ESG Leadership'], ARRAY[70, 71, 72, 73, 74.2, 74.8], 74.8, 73.9, 72.8)
ON CONFLICT (department_id) DO NOTHING;
