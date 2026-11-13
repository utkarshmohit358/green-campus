'use client';

import React from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Zap, CloudRain, Trash2, TreeDeciduous } from 'lucide-react';

export function ImpactCounters() {
  const stats = [
    {
      label: 'Kilowatt-Hours Reduced',
      value: 68420,
      suffix: ' kWh',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      subtext: 'Across 14 labs via scheduled sleep & idle cutoff',
    },
    {
      label: 'Carbon Abated',
      value: 48578,
      suffix: ' kg',
      icon: <CloudRain className="w-6 h-6 text-emerald-500" />,
      subtext: 'Equivalent to 48.6 metric tonnes CO₂e prevented',
    },
    {
      label: 'E-Waste Safely Diverted',
      value: 4820,
      suffix: ' kg',
      icon: <Trash2 className="w-6 h-6 text-sky-500" />,
      subtext: '98.4% diverted into triage, reuse & certified R2 recycling',
    },
    {
      label: 'Mature Trees Equivalent',
      value: 2231,
      suffix: '',
      icon: <TreeDeciduous className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      subtext: 'Yearly carbon absorption equivalent in campus forestry',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Institutional Environmental Progress
          </span>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Our Campus Impact So Far
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Real metrics aggregated from our department sub-meters, student pledge calculators, and campus smart e-waste drop points.
          </p>
        </div>

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
                <AnimatedCounter value={s.value} suffix={s.suffix} duration={2200} />
              </div>
              <h3 className="text-base font-bold text-neutral-200 mb-1">{s.label}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{s.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
