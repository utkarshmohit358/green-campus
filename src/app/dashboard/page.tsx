'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/components/providers/RoleProvider';
import departmentsData from '@/data/departments.json';
import ewasteData from '@/data/ewaste.json';
import leaderboardData from '@/data/leaderboard.json';
import { formatNumber } from '@/lib/utils';
import {
  LayoutDashboard,
  Zap,
  Trash2,
  Calculator,
  Trophy,
  ArrowRight,
  TrendingDown,
  Clock,
  PlusCircle,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { session } = useRole();

  // Aggregate high-level stats
  const totalLabsKwh = departmentsData.departments.reduce(
    (acc, d) => acc + d.labs.reduce((lAcc, l) => lAcc + l.currentMonthlyKWh, 0),
    0
  );
  const totalWorkstations = departmentsData.departments.reduce(
    (acc, d) => acc + d.labs.reduce((lAcc, l) => lAcc + l.pcCount, 0),
    0
  );
  const totalEwasteKg = ewasteData.summary.totalKgCollected;
  const topDept = leaderboardData.departmentRankings[0];

  // Aggregated 12-month power trend
  const trendData = departmentsData.departments[0].monthlyHistory.map((m, i) => {
    let totalKwhForMonth = 0;
    departmentsData.departments.forEach((dept) => {
      totalKwhForMonth += dept.monthlyHistory[i]?.kwh || 0;
    });
    return {
      month: m.month,
      kwh: totalKwhForMonth,
      co2Tonnes: Number(((totalKwhForMonth * 0.71) / 1000).toFixed(1)),
    };
  });

  const recentActivities = [
    {
      time: '12 mins ago',
      title: 'New Student Footprint Pledged',
      desc: 'Priya Sharma (CSE) logged 3 devices and committed to 5-yr lifecycle extension.',
      icon: <Calculator className="w-4 h-4 text-emerald-500" />,
    },
    {
      time: '45 mins ago',
      title: 'Smart Bin Telemetry Alert',
      desc: 'Library Atrium Bin reached 82% capacity. Facilities collection team notified.',
      icon: <Trash2 className="w-4 h-4 text-amber-500" />,
    },
    {
      time: '2 hours ago',
      title: 'Sub-Meter Reading Verified',
      desc: 'TB-401 Deep Learning Lab recorded 3,950 kWh (6.0% below target budget).',
      icon: <Zap className="w-4 h-4 text-sky-500" />,
    },
    {
      time: '5 hours ago',
      title: 'Leaderboard Ranking Update',
      desc: 'IT Department gained +1 rank overtaking CSE with 92.4 Green Score.',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Central Management &amp; Analytics Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Campus Command Center
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Welcome back, <strong className="text-neutral-900 dark:text-white">{session.name}</strong>. Real-time telemetry combining all 4 decarbonization modules across campus.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Footprint</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-xs font-semibold hover:bg-neutral-100 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Audit Reports</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Module Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Calculator */}
        <Link
          href="/calculator"
          className="p-6 rounded-3xl glass-panel interactive-card space-y-4 group block"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Calculator className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Student Computing
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              1,280 Pledges
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Average Greener Score: 84/100
            </p>
          </div>
        </Link>

        {/* Module 2: Lab Electricity */}
        <Link
          href="/labs"
          className="p-6 rounded-3xl glass-panel interactive-card space-y-4 group block"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Zap className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Lab Electricity
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              {formatNumber(totalLabsKwh, 0)} <span className="text-xs font-normal">kWh/mo</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Across {totalWorkstations} PCs • -16.4% below baseline</span>
            </p>
          </div>
        </Link>

        {/* Module 3: E-Waste */}
        <Link
          href="/ewaste"
          className="p-6 rounded-3xl glass-panel interactive-card space-y-4 group block"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              E-Waste Recovered
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              {formatNumber(totalEwasteKg, 0)} <span className="text-xs font-normal">kg</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              98.4% diverted • 135g Gold
            </p>
          </div>
        </Link>

        {/* Module 4: Leaderboard */}
        <Link
          href="/leaderboard"
          className="p-6 rounded-3xl glass-panel interactive-card space-y-4 group block"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Campus Leader
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              {topDept.departmentName}
            </div>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">
              Green Score: {topDept.greenScore} pts
            </p>
          </div>
        </Link>
      </div>

      {/* Main Historical Chart & Recent Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Overall Campus Power Draw Curve */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Campus-Wide Computing Electricity Trajectory (kWh)
              </h3>
              <p className="text-xs text-neutral-500">
                12-month aggregated consumption across all 8 academic block sub-meters
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 px-3 py-1 rounded-full bg-emerald-500/10">
              Down 14.8% YoY
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  formatter={(val: any) => [`${formatNumber(Number(val ?? 0), 0)} kWh`, 'Total Draw']}
                />
                <Area
                  type="monotone"
                  dataKey="kwh"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorKwh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Campus Activity Feed */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200/50 dark:border-white/5">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Live Activity Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-4">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5 shrink-0 mt-0.5">
                  {act.icon}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {act.title}
                  </div>
                  <div className="text-neutral-500 mt-0.5 leading-relaxed">
                    {act.desc}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
