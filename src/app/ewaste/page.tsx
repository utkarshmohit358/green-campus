'use client';

import React, { useState } from 'react';
import ewasteData from '@/data/ewaste.json';
import { calculateEwasteRecovery } from '@/lib/calculations';
import { StorageService, type EWasteDonationLog } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { useRole } from '@/components/providers/RoleProvider';
import { formatNumber } from '@/lib/utils';
import {
  Trash2,
  Recycle,
  Sparkles,
  MapPin,
  Calendar,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Box,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function EWastePage() {
  const { session } = useRole();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'drives' | 'materials'>('overview');
  const [selectedBin, setSelectedBin] = useState<string | null>(null);

  // Donation form modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [donorName, setDonorName] = useState(session.name);
  const [category, setCategory] = useState('Laptops');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [estimatedKg, setEstimatedKg] = useState<string>('2.5');
  const [condition, setCondition] = useState<'working' | 'repairable' | 'end-of-life'>('working');
  const [binId, setBinId] = useState('bin-1');

  // Compute live recoveries
  const recoveries = calculateEwasteRecovery(ewasteData.summary.totalKgCollected);

  const handleLogDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(estimatedKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast('Please enter a valid weight in kg.', { type: 'warning' });
      return;
    }

    const newDonation: EWasteDonationLog = {
      id: `donation-${Date.now()}`,
      donorName,
      department: session.department || 'General Campus',
      category,
      itemDescription: description || `${quantity}x ${category}`,
      quantity,
      estimatedWeightKg: weightNum,
      condition,
      date: new Date().toISOString().split('T')[0],
      binLocationId: binId,
    };

    StorageService.addEWasteDonation(newDonation);
    toast('Drop-off logged successfully!', {
      description: `Thank you for diverting ${weightNum} kg of ${category} from landfills!`,
      type: 'success',
    });
    setShowLogModal(false);
    setDescription('');
  };

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <Recycle className="w-3.5 h-3.5" />
            <span>UN SDG 12.5 Circular Electronics &amp; Zero-Landfill</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            E-Waste Collection &amp; Circular Monitor
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Track student and department electronic waste from campus bin drop-off to local school triage, refurbishing, and certified R2 closed-loop hydrometallurgical recovery.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Drop-Off / Donation</span>
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Total Collected</span>
            <Trash2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            {formatNumber(ewasteData.summary.totalKgCollected, 0)}{' '}
            <span className="text-xs font-normal text-neutral-500">kg</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            {formatNumber(ewasteData.summary.totalUnitsCollected, 0)} discrete devices collected
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Landfill Diversion Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
            {ewasteData.summary.diversionRatePct}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Zero equipment to municipal dumping
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Direct Community Reuse</span>
            <Box className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            {ewasteData.summary.reusedCount + ewasteData.summary.refurbishedCount}{' '}
            <span className="text-xs font-normal text-neutral-500">Units</span>
          </div>
          <div className="text-[11px] text-sky-600 mt-1">
            Donated to schools &amp; student labs
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-neutral-200/70 dark:border-white/10">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Carbon Avoided</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-2">
            {formatNumber(recoveries.co2AvoidedKg, 0)}{' '}
            <span className="text-xs font-normal text-neutral-500">kg CO₂</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            vs virgin mineral extraction
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-neutral-200/60 dark:border-white/10 pb-3">
        {[
          { id: 'overview', label: 'Categories & Flow', icon: <Layers className="w-4 h-4" /> },
          { id: 'map', label: 'Campus Map & Bins', icon: <MapPin className="w-4 h-4" /> },
          { id: 'materials', label: 'Recovered Precious Minerals', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'drives', label: 'Collection Drives', icon: <Calendar className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Stacked Flow Visual */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Sankey / Stacked Flow Visual */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Disposal Pathway Architecture
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                From Campus Drop-off to Clean Recovery
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Visualizing how every kilogram of collected hardware flows through inspection and zero-landfill triage
              </p>
            </div>

            {/* Stacked Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {ewasteData.disposalPathways.map((path, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 flex flex-col justify-between space-y-3 relative"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-1">
                      <span>Step 0{idx + 1}</span>
                      <span className="text-emerald-700 dark:text-emerald-400">{path.percentage}%</span>
                    </div>
                    <h5 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {path.stage}
                    </h5>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-200/40 dark:border-white/5 flex justify-between items-center text-xs font-bold text-neutral-900 dark:text-white">
                    <span>{formatNumber(path.weightKg, 0)} kg</span>
                    <span className="text-neutral-500 font-normal">{path.items} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Bar Chart */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Collection Weight by Hardware Category (kg)
            </h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ewasteData.categories}>
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
                    formatter={(val: any) => [`${val ?? 0} kg`, 'Collected Weight']}
                  />
                  <Bar dataKey="weightKg" radius={[6, 6, 0, 0]}>
                    {ewasteData.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Campus Map with Bin Pins & Fill Levels */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
          {/* Interactive Campus SVG Map */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Interactive Campus Smart Drop Map
                </h3>
                <p className="text-xs text-neutral-500">
                  Click any drop pin to view live sensor fill-level and emptying status
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                6 Smart Drop Bins Active
              </span>
            </div>

            {/* SVG Visual Map Canvas */}
            <div className="relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#0B3D2E]/10 via-neutral-100 to-emerald-50/30 dark:from-[#051A13] dark:via-[#07241A] dark:to-[#03100B] border border-neutral-300/60 dark:border-white/10 overflow-hidden flex items-center justify-center p-4">
              {/* Campus Landscape Contours */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 50 Q 25 30 50 50 T 100 50 L 100 100 L 0 100 Z" fill="#10B981" />
                <path d="M 10 20 L 40 20 L 40 40 L 10 40 Z" fill="#ffffff" stroke="#10B981" />
                <path d="M 60 15 L 90 15 L 90 35 L 60 35 Z" fill="#ffffff" stroke="#10B981" />
                <path d="M 30 65 L 70 65 L 70 85 L 30 85 Z" fill="#ffffff" stroke="#10B981" />
              </svg>

              {/* Placed Interactive Pins */}
              {ewasteData.bins.map((bin) => {
                const isSelected = selectedBin === bin.id;
                const isCritical = bin.fillPct >= 90;
                const isNearFull = bin.fillPct >= 75 && !isCritical;
                let pinColor = 'bg-emerald-500 text-white';
                if (isCritical) pinColor = 'bg-rose-500 text-white animate-pulse';
                else if (isNearFull) pinColor = 'bg-amber-500 text-white';

                return (
                  <button
                    key={bin.id}
                    onClick={() => setSelectedBin(bin.id)}
                    style={{ left: `${bin.coords.x}%`, top: `${bin.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl ${pinColor} shadow-xl hover:scale-125 transition-all cursor-pointer flex items-center gap-1.5 z-20 ${
                      isSelected ? 'ring-4 ring-white dark:ring-emerald-400 scale-110' : ''
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{bin.fillPct}%</span>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> &lt;75%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 75-89%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> &gt;90%
                </span>
              </div>
            </div>
          </div>

          {/* Bin Inspector Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Bin Telemetry
            </h3>
            {(() => {
              const bin = ewasteData.bins.find((b) => b.id === (selectedBin || 'bin-1')) || ewasteData.bins[0];
              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      {bin.building}
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                      {bin.name}
                    </h4>
                    <div className="text-xs text-neutral-500 mt-0.5">{bin.floor}</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Fill Capacity:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {bin.fillPct}% ({bin.currentKg} / {bin.capacityKg} kg)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          bin.fillPct >= 90 ? 'bg-rose-500' : bin.fillPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-neutral-500 pt-2 border-t border-neutral-200/50 dark:border-white/5">
                    <div>Last Emptied: <strong>{bin.lastEmptied}</strong></div>
                    <div>Status: <span className="capitalize font-semibold text-neutral-800 dark:text-neutral-200">{bin.status.replace('_', ' ')}</span></div>
                  </div>

                  {bin.fillPct >= 80 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      ⚠️ Dispatch alert queued for campus facilities crew.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 3: Precious Materials Recovered */}
      {activeTab === 'materials' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Closed-Loop Resource Mining
              </span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Precious Materials Extracted from Campus E-Waste
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                Recovered through CPCB-authorized certified hydrometallurgical processing, replacing carbon-intensive virgin open-pit mining:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Gold (Au)</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {recoveries.goldGrams}g
                </div>
                <span className="text-[10px] text-neutral-500">From PCB edge pins</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Copper (Cu)</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {recoveries.copperKg} kg
                </div>
                <span className="text-[10px] text-neutral-500">From transformers &amp; wires</span>
              </div>

              <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400">Aluminium (Al)</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {recoveries.aluminiumKg} kg
                </div>
                <span className="text-[10px] text-neutral-500">Heatsinks &amp; casings</span>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Silver (Ag)</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {recoveries.silverGrams}g
                </div>
                <span className="text-[10px] text-neutral-500">Solder alloys &amp; contacts</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-300/40 dark:border-white/10 text-center">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Steel &amp; Iron</span>
                <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {recoveries.steelKg} kg
                </div>
                <span className="text-[10px] text-neutral-500">Chassis &amp; drives</span>
              </div>

              <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">CO₂ Avoided</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatNumber(recoveries.co2AvoidedKg, 0)} kg
                </div>
                <span className="text-[10px] text-neutral-500">Emissions prevented</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Collection Drives Calendar */}
      {activeTab === 'drives' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Drives */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Upcoming Campus Drives</span>
              </h3>
              <div className="space-y-3">
                {ewasteData.drives
                  .filter((d) => d.status === 'upcoming')
                  .map((drive) => (
                    <div
                      key={drive.id}
                      className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                          {drive.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          Upcoming
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        📅 {drive.date} • 📍 {drive.location}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Target: <strong>{drive.targetKg} kg</strong> • Pledges registered:{' '}
                        <strong>{drive.registeredPledges} students</strong>
                      </div>
                      {drive.incentives && (
                        <div className="pt-2 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                          🎁 {drive.incentives}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Past Completed Drives */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-600" />
                <span>Completed Drive Results</span>
              </h3>
              <div className="space-y-3">
                {ewasteData.drives
                  .filter((d) => d.status === 'completed')
                  .map((drive) => (
                    <div
                      key={drive.id}
                      className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {drive.title}
                      </h4>
                      <div className="text-xs text-neutral-500">
                        📅 {drive.date} • 📍 {drive.location}
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold pt-1">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {drive.collectedKg} kg recovered
                        </span>
                        <span className="text-neutral-500">
                          {drive.donorCount} student donors
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Donation Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 space-y-6 bg-white dark:bg-[#071811] text-neutral-900 dark:text-white border border-emerald-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Log Electronic Donation / Drop-off</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogDonationSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  >
                    <option value="Laptops">Laptops &amp; Notebooks</option>
                    <option value="Desktops">Desktop Towers</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Batteries">Batteries &amp; UPS</option>
                    <option value="Cables">Cables &amp; Adapters</option>
                    <option value="Printers">Printers &amp; Peripherals</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Item Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell Inspiron 15, missing battery but motherboard intact"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Est. Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={estimatedKg}
                    onChange={(e) => setEstimatedKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) =>
                      setCondition(e.target.value as 'working' | 'repairable' | 'end-of-life')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                  >
                    <option value="working">Working</option>
                    <option value="repairable">Repairable</option>
                    <option value="end-of-life">End of Life (Scrap)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Drop-Off Smart Bin Location
                </label>
                <select
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-medium"
                >
                  {ewasteData.bins.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.building})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300 dark:border-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Drop-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
