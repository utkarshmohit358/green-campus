'use client';

import React, { useState } from 'react';
import reportsData from '@/data/reports.json';
import { useToast } from '@/components/ui/Toast';
import { formatNumber, formatCurrencyINR } from '@/lib/utils';
import {
  FileText,
  Printer,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
  Trash2,
  TreeDeciduous,
  CloudRain,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  const { toast } = useToast();
  const [selectedReportId, setSelectedReportId] = useState<string>('2024-10');

  const report =
    reportsData.reports.find((r) => r.id === selectedReportId) || reportsData.reports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast('Report share link copied to clipboard!', {
        description: 'Verified public audit URL is ready to distribute.',
        type: 'success',
      });
    }
  };

  // Performance comparison data for chart
  const deptPerformanceData = [
    ...report.departmentHighlights.topPerforming.map((d) => ({
      name: d.department.replace('& Engineering', '').replace('Department', ''),
      reduction: d.reductionPct,
      type: 'Top Performer',
    })),
    ...report.departmentHighlights.needsImprovement.map((d) => ({
      name: d.department.replace('& Engineering', '').replace('Department', ''),
      reduction: d.reductionPct,
      type: 'Needs Improvement',
    })),
  ];

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Editorial Header Controls (Hidden during print) */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>UN SDG 12.6 Institutional Sustainability Reporting</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Campus Sustainability Dossier
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Automated, editorial-grade environmental disclosure report. Verifiable metrics on computing energy, carbon abatement, and circular hardware triage for academic accreditation boards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Month Timeline Picker (no-print) */}
      <div className="no-print flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-neutral-500 shrink-0">Historical Reports:</span>
        {reportsData.reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReportId(r.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedReportId === r.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            {r.month}
          </button>
        ))}
      </div>

      {/* EDITORIAL REPORT DOCUMENT (Print styled) */}
      <article className="print-page p-8 sm:p-14 rounded-3xl glass-panel border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#071811] text-neutral-900 dark:text-white shadow-2xl space-y-12">
        {/* Document Masthead */}
        <div className="border-b-2 border-neutral-900 dark:border-emerald-500 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
              <span>National Institute of Technology</span>
              <span>•</span>
              <span>Division of Sustainability</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {report.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
              <span>Reporting Period: <strong>{report.month}</strong></span>
              <span>•</span>
              <span>Published: <strong>{report.publishDate}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                NIRF / NAAC Criterion 7 Validated
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Official Institutional Release
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            1. Executive Summary
          </h3>
          <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-200 leading-relaxed font-serif italic pl-4 border-l-4 border-emerald-600">
            &ldquo;{report.executiveSummary}&rdquo;
          </p>
        </section>

        {/* 4 Core KPIs Strip */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            2. Verified Campus Environmental Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Power Reduced</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-1">
                {formatNumber(report.kpis.kwhReduced, 0)}{' '}
                <span className="text-xs font-normal">kWh</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                Saved {formatCurrencyINR(report.kpis.costSavingsINR)}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Carbon Abated</span>
                <CloudRain className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {formatNumber(report.kpis.co2SavedKg, 0)}{' '}
                <span className="text-xs font-normal">kg CO₂</span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Grid Intensity @ 0.71 kg/kWh
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>E-Waste Collected</span>
                <Trash2 className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-1">
                {report.kpis.ewasteCollectedKg}{' '}
                <span className="text-xs font-normal">kg</span>
              </div>
              <div className="text-[11px] text-sky-600 mt-1">
                98.4% landfill diversion
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Trees Equivalent</span>
                <TreeDeciduous className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
                {report.kpis.treeEquivalents}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Yearly absorption equivalent
              </div>
            </div>
          </div>
        </section>

        {/* Department Benchmarks & Chart */}
        <section className="space-y-4 print-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            3. Department Energy Optimization Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Achieving Departments</span>
              </div>
              <div className="space-y-2">
                {report.departmentHighlights.topPerforming.map((d, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-emerald-500/20 text-xs"
                  >
                    <div className="flex justify-between font-bold text-neutral-900 dark:text-white">
                      <span>{d.department}</span>
                      <span className="text-emerald-700 dark:text-emerald-400">+{d.reductionPct}% Cut</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">{d.keyAction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Improvement */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Areas for Remediation</span>
              </div>
              <div className="space-y-2">
                {report.departmentHighlights.needsImprovement.map((d, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-amber-500/20 text-xs"
                  >
                    <div className="flex justify-between font-bold text-neutral-900 dark:text-white">
                      <span>{d.department}</span>
                      <span className="text-amber-700 dark:text-amber-400">+{d.reductionPct}% Cut</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">{d.issue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Chart */}
          <div className="pt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: 'Energy Cut (%)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#061A13',
                    borderColor: '#10B981',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`+${val ?? 0}%`, 'Energy Reduction']}
                />
                <Bar dataKey="reduction" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Key Achievements & Recommendations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-200/60 dark:border-white/10 print-break-inside-avoid">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              4. Key Milestones
            </h3>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {report.keyAchievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              5. Strategic Directives
            </h3>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* UN SDG Target Contributions */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/60 dark:border-white/10 print-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            6. UN SDG Alignment &amp; Accreditations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#CF8D2A]/10 border border-[#CF8D2A]/30 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#CF8D2A] text-white flex items-center justify-center font-bold text-xs">
                  12
                </div>
                <h5 className="font-bold text-xs text-neutral-900 dark:text-white">
                  {report.sdgContributions.sdg12.title}
                </h5>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                {report.sdgContributions.sdg12.statement}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                {report.sdgContributions.sdg12.metrics.map((m, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-neutral-500 text-[10px]">{m.label}</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#3F7E44]/10 border border-[#3F7E44]/30 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#3F7E44] text-white flex items-center justify-center font-bold text-xs">
                  13
                </div>
                <h5 className="font-bold text-xs text-neutral-900 dark:text-white">
                  {report.sdgContributions.sdg13.title}
                </h5>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                {report.sdgContributions.sdg13.statement}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                {report.sdgContributions.sdg13.metrics.map((m, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white/60 dark:bg-black/20">
                    <div className="text-neutral-500 text-[10px]">{m.label}</div>
                    <div className="font-bold text-neutral-900 dark:text-white">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Sign-off Block */}
        <div className="pt-8 border-t-2 border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-500">
          <div>
            <div>Audited by: <strong>Campus Sustainability Committee</strong></div>
            <div>Registry ID: <strong>GC-NIT-2024-OCT-091</strong></div>
          </div>
          <div className="text-right">
            <div>Authorized Signatory: <strong>Dr. Rajesh Verma</strong></div>
            <div>Chief Sustainability Officer</div>
          </div>
        </div>
      </article>
    </div>
  );
}
