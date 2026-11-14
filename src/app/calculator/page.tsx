'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import {
  DEVICE_CATALOG,
  GRID_EMISSION_FACTOR_INDIA,
  type PowerMode,
} from '@/lib/constants';
import {
  calculateFootprint,
  type UserDeviceInput,
  type FootprintCalculationResult,
} from '@/lib/calculations';
import { type SavedFootprintRecord } from '@/lib/storage';
import { SupabaseDatabase } from '@/lib/supabase/database';
import { useToast } from '@/components/ui/Toast';
import { useRole } from '@/components/providers/RoleProvider';
import {
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Printer,
  Wifi,
  Watch,
  Plus,
  Trash2,
  TreeDeciduous,
  Car,
  Zap,
  Sparkles,
  Download,
  BookmarkPlus,
  History,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  laptop: <Laptop className="w-5 h-5" />,
  desktop: <Monitor className="w-5 h-5" />,
  smartphone: <Smartphone className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
  monitor: <Tv className="w-5 h-5" />,
  printer: <Printer className="w-5 h-5" />,
  router: <Wifi className="w-5 h-5" />,
  smartwatch: <Watch className="w-5 h-5" />,
};

const CHART_COLORS = [
  '#10B981',
  '#0B3D2E',
  '#34D399',
  '#F59E0B',
  '#6366F1',
  '#EC4899',
  '#06B6D4',
  '#8B5CF6',
];

export default function CalculatorPage() {
  const { session } = useRole();
  const { toast } = useToast();
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Form State
  const [userDevices, setUserDevices] = useState<UserDeviceInput[]>([
    {
      deviceId: 'dev-init-1',
      deviceType: 'laptop',
      hoursPerDay: 7,
      daysPerWeek: 5,
      powerMode: 'normal',
      deviceAgeYears: 2,
    },
    {
      deviceId: 'dev-init-2',
      deviceType: 'smartphone',
      hoursPerDay: 4,
      daysPerWeek: 7,
      powerMode: 'normal',
      deviceAgeYears: 1,
    },
  ]);

  const [activeStep, setActiveStep] = useState<'configure' | 'results'>('configure');
  const [calculationResult, setCalculationResult] = useState<FootprintCalculationResult | null>(null);
  const [history, setHistory] = useState<SavedFootprintRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    SupabaseDatabase.getFootprintHistory().then(setHistory);
  }, []);

  const handleAddDevice = (deviceType: string) => {
    const newDev: UserDeviceInput = {
      deviceId: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      deviceType,
      hoursPerDay: 4,
      daysPerWeek: 5,
      powerMode: 'normal',
      deviceAgeYears: 2,
    };
    setUserDevices((prev) => [...prev, newDev]);
    toast('Added ' + DEVICE_CATALOG[deviceType]?.name, { type: 'info' });
  };

  const handleRemoveDevice = (deviceId: string) => {
    setUserDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
  };

  const handleUpdateDevice = (
    deviceId: string,
    field: keyof UserDeviceInput,
    value: string | number
  ) => {
    setUserDevices((prev) =>
      prev.map((d) => (d.deviceId === deviceId ? { ...d, [field]: value } : d))
    );
  };

  const runCalculation = () => {
    if (userDevices.length === 0) {
      toast('Please add at least one device to compute footprint', { type: 'warning' });
      return;
    }

    const res = calculateFootprint(userDevices, GRID_EMISSION_FACTOR_INDIA);
    setCalculationResult(res);
    setActiveStep('results');

    // Trigger joyous green leaf confetti burst
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#0B3D2E', '#D8F3DC', '#F59E0B'],
    });

    toast('Calculation complete! Greener score computed.', { type: 'success' });
  };

  const handleSaveToHistory = async () => {
    if (!calculationResult) return;
    const record: SavedFootprintRecord = {
      id: `record-${Date.now()}`,
      timestamp: new Date().toISOString(),
      studentName: session.name,
      department: session.department || 'General Academic',
      inputs: [...userDevices],
      result: calculationResult,
    };
    const { source } = await SupabaseDatabase.saveFootprint(record);
    const updated = await SupabaseDatabase.getFootprintHistory();
    setHistory(updated);
    toast(
      source === 'supabase'
        ? 'Footprint synced to Supabase Cloud!'
        : 'Footprint saved to local history!',
      {
        description: 'Your reduction progress is tracked across semesters.',
        type: 'success',
      }
    );
  };

  const handleExportPNG = async () => {
    if (!shareCardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#061A13',
      });
      const link = document.createElement('a');
      link.download = `GreenCampus-Footprint-${session.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      toast('Share card downloaded as PNG!', { type: 'success' });
    } catch {
      toast('Failed to generate PNG image. Please try again.', { type: 'warning' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UN SDG 12.8 &amp; 13.3 Aligned Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Student Device Footprint Calculator
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Calculates your complete annual computing emissions: operational energy from the Indian national grid (0.71 kg CO₂/kWh) plus amortized cradle-to-grave manufacturing emissions.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>History ({history.length})</span>
          </button>
          {activeStep === 'results' && (
            <button
              onClick={() => setActiveStep('configure')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Edit Devices</span>
            </button>
          )}
        </div>
      </div>

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Your Saved Footprint History</span>
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
            >
              Close
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-neutral-500">No footprints saved yet. Run a calculation and tap &quot;Save My Footprint&quot;!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {new Date(rec.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      Score: {rec.result.greenerScore}/100
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
                    {rec.result.grandTotalCO2Kg} <span className="text-xs font-normal text-neutral-500">kg CO₂/yr</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {rec.inputs.length} devices • {rec.result.totalAnnualKWh} kWh/yr
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Device Configuration Screen */}
      {activeStep === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Device Catalog Adder */}
          <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-5">
            <div>
              <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Add Device</h2>
              <p className="text-xs text-neutral-500">
                Click to add hardware from the campus inventory catalog:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(DEVICE_CATALOG).map((catalog) => (
                <button
                  key={catalog.id}
                  onClick={() => handleAddDevice(catalog.id)}
                  className="p-3 rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left group flex flex-col justify-between min-h-[90px] cursor-pointer"
                >
                  <div className="flex items-center justify-between text-neutral-500 group-hover:text-emerald-600 transition-colors">
                    {DEVICE_ICONS[catalog.id] || <Laptop className="w-4 h-4" />}
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                      {catalog.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      {catalog.defaultWatts}W • {catalog.typicalLifespanYears}yr life
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200/50 dark:border-white/5 space-y-2 text-xs text-neutral-500">
              <div className="flex justify-between">
                <span>Current Device Count:</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {userDevices.length} items
                </span>
              </div>
              <div className="flex justify-between">
                <span>Grid Intensity:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {GRID_EMISSION_FACTOR_INDIA} kg CO₂/kWh
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Devices Form */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl text-neutral-900 dark:text-white">
                Your Hardware &amp; Usage Profiles ({userDevices.length})
              </h2>
              {userDevices.length > 0 && (
                <button
                  onClick={() => setUserDevices([])}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {userDevices.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border-2 border-dashed border-neutral-300 dark:border-white/10 space-y-3">
                <Laptop className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="font-bold text-neutral-700 dark:text-neutral-300">No devices selected</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Select laptops, smartphones, or accessories from the catalog on the left to begin your calculation.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userDevices.map((dev) => {
                  const catalog = DEVICE_CATALOG[dev.deviceType] || DEVICE_CATALOG.laptop;
                  return (
                    <div
                      key={dev.deviceId}
                      className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                            {DEVICE_ICONS[dev.deviceType] || <Laptop className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-neutral-900 dark:text-white">
                              {catalog.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Base: {catalog.defaultWatts}W • {catalog.embodiedTotalKg} kg CO₂ cradle-to-grave
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveDevice(dev.deviceId)}
                          aria-label="Remove device"
                          className="p-2 text-neutral-400 hover:text-rose-500 transition-colors rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Input Controls Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        {/* Hours per day */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            Hours Active / Day: <strong className="text-neutral-900 dark:text-white">{dev.hoursPerDay} hrs</strong>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="24"
                            value={dev.hoursPerDay}
                            onChange={(e) =>
                              handleUpdateDevice(dev.deviceId, 'hoursPerDay', Number(e.target.value))
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* Days per week */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            Days / Week: <strong className="text-neutral-900 dark:text-white">{dev.daysPerWeek} days</strong>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="7"
                            value={dev.daysPerWeek}
                            onChange={(e) =>
                              handleUpdateDevice(dev.deviceId, 'daysPerWeek', Number(e.target.value))
                            }
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* Power Mode Profile */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            Power Profile
                          </label>
                          <select
                            value={dev.powerMode}
                            onChange={(e) =>
                              handleUpdateDevice(
                                dev.deviceId,
                                'powerMode',
                                e.target.value as PowerMode
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#071811] text-xs font-medium text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="eco">Eco Mode (0.72x)</option>
                            <option value="normal">Normal (1.0x)</option>
                            <option value="performance">Turbo / Perf (1.35x)</option>
                          </select>
                        </div>

                        {/* Device Age */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            Device Age (Years)
                          </label>
                          <select
                            value={dev.deviceAgeYears}
                            onChange={(e) =>
                              handleUpdateDevice(
                                dev.deviceId,
                                'deviceAgeYears',
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#071811] text-xs font-medium text-neutral-900 dark:text-neutral-100"
                          >
                            <option value="1">1 Year (&lt; 12 mo)</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years (Target life)</option>
                            <option value="5">5+ Years (Extended life)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Calculate CTA Button */}
                <div className="pt-4">
                  <button
                    onClick={runCalculation}
                    className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Full Footprint &amp; Get Greener Score</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Comprehensive Results Screen */}
      {activeStep === 'results' && calculationResult && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Shareable Card Canvas Ref */}
          <div
            ref={shareCardRef}
            className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 dark:from-[#061811] dark:via-[#082217] dark:to-[#04120D] shadow-2xl space-y-8"
          >
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-neutral-900 dark:text-white">
                    GreenCampus Footprint Verified
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-xs text-neutral-500">
                  Computed for <strong className="text-neutral-900 dark:text-white">{session.name}</strong> • {session.department}
                </p>
              </div>

              {/* Greener Score Ring Display */}
              <div className="flex items-center gap-4 bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-500/20">
                <div className="text-right">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Greener Score
                  </div>
                  <div className="text-xs text-neutral-500">Top 15% on Campus</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {calculationResult.greenerScore}
                </div>
              </div>
            </div>

            {/* Core KPI Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
                <div className="text-xs text-neutral-500">Total Annual Footprint</div>
                <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-1">
                  {calculationResult.grandTotalCO2Kg} <span className="text-xs font-normal">kg CO₂</span>
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Operational + Embodied</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
                <div className="text-xs text-neutral-500">Operational Energy</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  {calculationResult.totalAnnualKWh} <span className="text-xs font-normal">kWh/yr</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  {calculationResult.totalOperationalCO2Kg} kg CO₂ on grid
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
                <div className="text-xs text-neutral-500">Amortized Embodied</div>
                <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">
                  {calculationResult.totalEmbodiedCO2Kg} <span className="text-xs font-normal">kg CO₂</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Manufacturing spread</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
                <div className="text-xs text-neutral-500">Trees to Neutralize</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1 flex items-center gap-1.5">
                  <TreeDeciduous className="w-5 h-5 text-emerald-600" />
                  <span>{calculationResult.equivalents.treesNeeded}</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Trees absorbed / year</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
              {/* Donut Chart: Device Breakdown */}
              <div className="p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-neutral-200/50 dark:border-white/5">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                  Emissions Breakdown by Device
                </h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculationResult.devices}
                        dataKey="totalCO2Kg"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={4}
                      >
                        {calculationResult.devices.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#061A13',
                          borderColor: '#10B981',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [`${val ?? 0} kg CO₂`, 'Emissions']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-xs pt-2">
                  {calculationResult.devices.map((d, i) => (
                    <div key={d.deviceId} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-neutral-600 dark:text-neutral-300">
                        {d.name} ({d.percentageOfTotal}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart: Operational vs Embodied */}
              <div className="p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-neutral-200/50 dark:border-white/5">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                  Operational (kWh) vs Embodied (Manufacturing)
                </h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculationResult.devices}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#061A13',
                          borderColor: '#10B981',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="operationalCO2Kg" name="Operational Grid CO₂" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="embodiedCO2Kg" name="Embodied Lifecycle CO₂" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Real-World Equivalents */}
            <div className="pt-4 border-t border-neutral-200/50 dark:border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                Your Footprint in Real-World Terms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">
                      {calculationResult.equivalents.kmDriven} km
                    </div>
                    <div className="text-xs text-neutral-500">Driven in gasoline vehicle</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">
                      {calculationResult.equivalents.smartphoneCharges.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">Smartphone full charges</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">
                      {calculationResult.equivalents.ledBulbHours.toLocaleString()} hrs
                    </div>
                    <div className="text-xs text-neutral-500">10W LED bulb illumination</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToHistory}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save My Footprint</span>
              </button>

              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 font-semibold text-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating PNG...' : 'Download Share Card (PNG)'}</span>
              </button>
            </div>

            <button
              onClick={() => setActiveStep('configure')}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
            >
              Recalculate with different hours
            </button>
          </div>

          {/* 5+ Personalized Actionable Tips */}
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Tailored Optimization Plan
              </span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Personalized Footprint Reduction Actions
              </h3>
              <p className="text-xs text-neutral-500">
                Adopting these 5 actions can eliminate up to ~95 kg CO₂ from your annual academic footprint:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculationResult.tips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-5 rounded-3xl glass-panel interactive-card flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {tip.badge}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600">
                        -{tip.potentialReductionKg} kg CO₂
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{tip.title}</span>
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
                      {tip.description}
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pledge this habit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
