'use client';

import React, { useState, useMemo } from 'react';
import departmentsData from '@/data/departments.json';
import {
  calculateWhatIfSavings,
  calculateOperationalCO2,
} from '@/lib/calculations';
import {
  GRID_EMISSION_FACTOR_INDIA,
  ELECTRICITY_COST_PER_KWH_INR,
} from '@/lib/constants';
import { type MeterReadingLog } from '@/lib/storage';
import { SupabaseDatabase } from '@/lib/supabase/database';
import { useToast } from '@/components/ui/Toast';
import { useRole } from '@/components/providers/RoleProvider';
import { formatNumber, formatCurrencyINR } from '@/lib/utils';
import {
  Zap,
  TrendingDown,
  AlertTriangle,
  Building2,
  Sliders,
  PlusCircle,
  Cpu,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function LabsTrackerPage() {
  const { session } = useRole();
  const { toast } = useToast();

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'12m' | '6m' | '3m'>('12m');

  // What-If Simulation State
  const [idleHoursOff, setIdleHoursOff] = useState<number>(4);

  // Meter Reading Form Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [readingLabId, setReadingLabId] = useState('');
  const [readingKwh, setReadingKwh] = useState<string>('');
  const [readingDate, setReadingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [readingNotes, setReadingNotes] = useState('');

  // Extract unique buildings
  const buildings = useMemo(() => {
    return Array.from(new Set(departmentsData.departments.map((d) => d.building)));
  }, []);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    return departmentsData.departments.filter((d) => {
      if (selectedDeptId !== 'all' && d.id !== selectedDeptId) return false;
      if (selectedBuilding !== 'all' && d.building !== selectedBuilding) return false;
      return true;
    });
  }, [selectedDeptId, selectedBuilding]);

  // Aggregate stats across filtered departments
  const aggregatedStats = useMemo(() => {
    let totalPcs = 0;
    let totalCurrentKwh = 0;
    let totalTargetKwh = 0;
    const anomalies: { labName: string; alert: string; dept: string }[] = [];

    filteredDepartments.forEach((dept) => {
      dept.labs.forEach((lab) => {
        totalPcs += lab.pcCount;
        totalCurrentKwh += lab.currentMonthlyKWh;
        totalTargetKwh += lab.monthlyTargetKWh;
        if (lab.anomalyAlert) {
          anomalies.push({ labName: lab.name, alert: lab.anomalyAlert, dept: dept.name });
        }
      });
    });

    const kwhPerPc = totalPcs > 0 ? totalCurrentKwh / totalPcs : 0;
    const totalCO2Kg = calculateOperationalCO2(totalCurrentKwh, GRID_EMISSION_FACTOR_INDIA);
    const targetCO2Kg = calculateOperationalCO2(totalTargetKwh, GRID_EMISSION_FACTOR_INDIA);
    const reductionVsTargetPct =
      totalTargetKwh > 0 ? ((totalTargetKwh - totalCurrentKwh) / totalTargetKwh) * 100 : 0;

    return {
      totalPcs,
      totalCurrentKwh,
      totalTargetKwh,
      kwhPerPc,
      totalCO2Kg,
      targetCO2Kg,
      reductionVsTargetPct,
      anomalies,
    };
  }, [filteredDepartments]);

  // 12-Month Chart Series aggregated or single department
  const chartData = useMemo(() => {
    let sliceLength = 12;
    if (selectedTimeframe === '6m') sliceLength = 6;
    if (selectedTimeframe === '3m') sliceLength = 3;

    if (selectedDeptId !== 'all') {
      const targetDept = departmentsData.departments.find((d) => d.id === selectedDeptId);
      if (!targetDept) return [];
      return targetDept.monthlyHistory.slice(-sliceLength);
    }

    // Combine all departments month by month
    const combinedMonths: Record<string, { month: string; kwh: number; target: number; co2Kg: number }> = {};
    filteredDepartments.forEach((dept) => {
      dept.monthlyHistory.forEach((h) => {
        if (!combinedMonths[h.month]) {
          combinedMonths[h.month] = { month: h.month, kwh: 0, target: 0, co2Kg: 0 };
        }
        combinedMonths[h.month].kwh += h.kwh;
        combinedMonths[h.month].target += h.target;
        combinedMonths[h.month].co2Kg += h.co2Kg;
      });
    });

    return Object.values(combinedMonths).slice(-sliceLength);
  }, [selectedDeptId, filteredDepartments, selectedTimeframe]);

  // What-If Savings calculation
  const whatIfSavings = useMemo(() => {
    return calculateWhatIfSavings(
      aggregatedStats.totalCurrentKwh,
      aggregatedStats.totalPcs,
      idleHoursOff,
      GRID_EMISSION_FACTOR_INDIA,
      ELECTRICITY_COST_PER_KWH_INR
    );
  }, [aggregatedStats, idleHoursOff]);

  const handleLogMeterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kwhNum = parseFloat(readingKwh);
    if (isNaN(kwhNum) || kwhNum <= 0) {
      toast('Please enter a valid positive kWh reading.', { type: 'warning' });
      return;
    }
    if (!readingLabId) {
      toast('Please select a computer lab.', { type: 'warning' });
      return;
    }

    const newReading: MeterReadingLog = {
      id: `reading-${Date.now()}`,
      labId: readingLabId,
      labName: readingLabId,
      departmentId: selectedDeptId !== 'all' ? selectedDeptId : 'cse',
      date: readingDate,
      kwh: kwhNum,
      reportedBy: session.name,
      notes: readingNotes,
    };

    const { source } = await SupabaseDatabase.logMeterReading(newReading);
    toast(
      source === 'supabase'
        ? 'Meter reading synced to Supabase Cloud!'
        : 'Meter reading logged successfully!',
      {
        description: `Recorded ${kwhNum} kWh for ${readingLabId} on ${readingDate}.`,
        type: 'success',
      }
    );
    setShowLogModal(false);
    setReadingKwh('');
    setReadingNotes('');
  };

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>UN SDG 13.2 Institutional Energy Decarbonization</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Department Lab Electricity Tracker
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Real-time power monitoring across 8 academic departments and 14 computer labs. Track monthly consumption, uncover overnight phantom waste, and model what-if shutdown policies.
          </p>
        </div>

        {/* Action: Log Reading Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Meter Reading</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-neutral-500">Department:</label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#071811] text-xs font-medium text-neutral-900 dark:text-neutral-100"
            >
              <option value="all">All Departments (Campus-wide)</option>
              {departmentsData.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-neutral-500">Building:</label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#071811] text-xs font-medium text-neutral-900 dark:text-neutral-100"
            >
              <option value="all">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center gap-1 bg-neutral-200/60 dark:bg-white/5 p-1 rounded-full text-xs">
          {(['3m', '6m', '12m'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                selectedTimeframe === tf
                  ? 'bg-white dark:bg-emerald-600 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Monthly Consumption</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            {formatNumber(aggregatedStats.totalCurrentKwh, 0)}{' '}
            <span className="text-xs font-normal text-neutral-500">kWh</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Target: {formatNumber(aggregatedStats.totalTargetKwh, 0)} kWh ({formatNumber(aggregatedStats.reductionVsTargetPct, 1)}% below)</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Intensity per Workstation</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            {formatNumber(aggregatedStats.kwhPerPc, 1)}{' '}
            <span className="text-xs font-normal text-neutral-500">kWh / PC</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Across {aggregatedStats.totalPcs} total workstations
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Carbon Footprint</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
            {formatNumber(aggregatedStats.totalCO2Kg, 0)}{' '}
            <span className="text-xs font-normal text-neutral-500">kg CO₂</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            India Grid CEA @ 0.71 kg/kWh
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Estimated Tariff Cost</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            {formatCurrencyINR(aggregatedStats.totalCurrentKwh * ELECTRICITY_COST_PER_KWH_INR)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            At institutional rate ₹8.50 / kWh
          </div>
        </div>
      </div>

      {/* Anomaly Alerts (e.g. overnight vampire load) */}
      {aggregatedStats.anomalies.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Overnight Idle Anomaly Highlighted</span>
          </div>
          {aggregatedStats.anomalies.map((ano, i) => (
            <p key={i} className="text-xs text-neutral-700 dark:text-neutral-300 pl-7">
              <strong>{ano.dept} ({ano.labName}):</strong> {ano.alert}
            </p>
          ))}
        </div>
      )}

      {/* Main Historical Chart */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Monthly Consumption vs Baseline Target (kWh)
            </h3>
            <p className="text-xs text-neutral-500">
              Comparing actual logged electricity draw against institutional decarbonization targets
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Actual kWh
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Target kWh
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#061A13',
                  borderColor: '#10B981',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${formatNumber(Number(val ?? 0), 0)} kWh`]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="kwh"
                name="Actual Electricity (kWh)"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target Benchmark (kWh)"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24x7 Peak Hours Heatmap & What-If Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Heatmap (7 Days x Hourly Draw) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Peak-Hours Usage Heatmap
              </h3>
              <p className="text-xs text-neutral-500">
                Average kW power demand across days and time slots
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Peak: 2:00 PM – 4:00 PM
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-200/50 dark:border-white/5">
                  <th className="py-2 text-left font-semibold">Time</th>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <th key={day} className="py-2 font-semibold">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/30 dark:divide-white/5">
                {departmentsData.heatmapSchedule.map((row) => (
                  <tr key={row.hour}>
                    <td className="py-2 text-left font-mono text-[11px] text-neutral-400">
                      {row.hour}
                    </td>
                    {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((d) => {
                      const val = row[d];
                      // Color interpolate based on intensity
                      let bg = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
                      if (val > 40) bg = 'bg-amber-500/20 text-amber-700 dark:text-amber-300';
                      if (val > 80) bg = 'bg-rose-500/25 text-rose-700 dark:text-rose-300 font-bold';
                      return (
                        <td key={d} className="p-1">
                          <div className={`py-1 rounded-lg ${bg} text-[11px]`}>{val} kW</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-2">
            <span>Low: &lt; 25 kW</span>
            <span>Moderate: 25 - 60 kW</span>
            <span className="text-rose-500 font-semibold">High Peak: &gt; 80 kW</span>
          </div>
        </div>

        {/* Interactive "What-If" Simulator */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl glass-panel space-y-6 flex flex-col justify-between border-2 border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-[#081F17] dark:via-[#05140F] dark:to-[#040E0A]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive What-If Policy Engine</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Project Savings from Auto-Shutdown
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drag the slider to test policy impacts if all {aggregatedStats.totalPcs} PCs are automatically suspended after class hours:
            </p>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Idle Hours Cut Off Daily:
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 text-sm">
                  {idleHoursOff} hours / day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={idleHoursOff}
                onChange={(e) => setIdleHoursOff(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>1 hr (Minor trim)</span>
                <span>5 hrs (Post-6PM)</span>
                <span>10 hrs (Overnight full cutoff)</span>
              </div>
            </div>
          </div>

          {/* Projected Outcomes */}
          <div className="space-y-3 pt-4 border-t border-neutral-200/60 dark:border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Projected Monthly Savings:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-neutral-500">Power Saved</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {formatNumber(whatIfSavings.monthlySavedKWh, 0)} kWh
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                <div className="text-xs text-neutral-500">CO₂ Abated</div>
                <div className="text-sm sm:text-base font-extrabold text-sky-700 dark:text-sky-400 mt-0.5">
                  {formatNumber(whatIfSavings.co2SavedKg, 0)} kg
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xs text-neutral-500">Budget Saved</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                  {formatCurrencyINR(whatIfSavings.costSavedInr)}
                </div>
              </div>
            </div>

            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold text-center flex items-center justify-center gap-1.5 pt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Projected {whatIfSavings.pctSaved}% drop in total campus computing power!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Lab Inventory Drilldown List */}
      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
          Active Computer Labs ({filteredDepartments.flatMap((d) => d.labs).length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.flatMap((dept) =>
            dept.labs.map((lab) => {
              const pctOfTarget = Math.round((lab.currentMonthlyKWh / lab.monthlyTargetKWh) * 100);
              const isOver = pctOfTarget > 100;
              return (
                <div
                  key={lab.id}
                  className="p-5 rounded-3xl glass-panel interactive-card space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                        {dept.code} • {lab.room}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isOver ? 'text-rose-500' : 'text-emerald-600'
                        }`}
                      >
                        {pctOfTarget}% of Target
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                      {lab.name}
                    </h4>

                    <div className="text-xs text-neutral-500">
                      {lab.pcCount} PCs • {lab.hoursOpenPerDay} hrs open/day {lab.hasGpus && '• High-power GPUs'}
                    </div>
                  </div>

                  {/* Progress Bar against monthly target */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-200/50 dark:border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Current / Target:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {lab.currentMonthlyKWh} / {lab.monthlyTargetKWh} kWh
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pctOfTarget)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Meter Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 space-y-6 bg-white dark:bg-[#071811] text-neutral-900 dark:text-white border border-emerald-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Log New Sub-Meter Reading</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogMeterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Select Computer Lab
                </label>
                <select
                  value={readingLabId}
                  onChange={(e) => setReadingLabId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                >
                  <option value="">-- Choose Lab --</option>
                  {departmentsData.departments.flatMap((d) =>
                    d.labs.map((l) => (
                      <option key={l.id} value={l.name}>
                        [{d.code}] {l.name} ({l.room})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Meter Reading (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3850"
                    value={readingKwh}
                    onChange={(e) => setReadingKwh(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Reading Date
                  </label>
                  <input
                    type="date"
                    value={readingDate}
                    onChange={(e) => setReadingDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Operational Notes (Optional)
                </label>
                <textarea
                  placeholder="Notes on exam schedules, overnight research runs, or AC maintenance..."
                  value={readingNotes}
                  onChange={(e) => setReadingNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium resize-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Submitted by: <strong>{session.name}</strong> ({session.role})</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
