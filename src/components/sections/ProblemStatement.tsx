'use client';

import React from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AlertTriangle, Clock, Cpu, Trash2 } from 'lucide-react';

export function ProblemStatement() {
  const problems = [
    {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      metric: 1840,
      suffix: '+',
      label: 'Lab Workstations Left On Overnight',
      description:
        'Vampire power drain burns over 115,000 kWh every semester across campus computing facilities with zero users present.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      metric: 78,
      suffix: '%',
      label: 'Embodied Manufacturing Carbon',
      description:
        'Up to 80% of a computer’s life-cycle carbon is emitted before unboxing. Premature 2-year replacements double institutional footprints.',
    },
    {
      icon: <Trash2 className="w-6 h-6 text-rose-500" />,
      metric: 82,
      suffix: '%',
      label: 'Campus E-Waste Dumped in Landfills',
      description:
        'Obsolete mice, batteries, and old motherboards leach toxic cadmium and lead into groundwater when discarded informally.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      metric: 710,
      suffix: 'g',
      label: 'CO₂ Per Single Kilowatt-Hour',
      description:
        'At 0.71 kg CO₂/kWh on the Indian national grid, a 24/7 AI compute cluster emits tonnes of carbon unless strictly optimized.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-neutral-200/50 dark:border-white/5 bg-neutral-50/50 dark:bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            The Hidden Academic Footprint
          </span>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-white">
            Universities are power plants of code. <br />
            <span className="text-neutral-500 dark:text-neutral-400">
              Most of it runs blindly.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Higher education drives cutting-edge computer science and engineering research, but rarely accounts for its own servers, student hardware turnover, and lab idle draw.
          </p>
        </div>

        {/* 4 Staggered Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-panel interactive-card flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <div className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
                  <AnimatedCounter value={p.metric} suffix={p.suffix} duration={1800} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {p.label}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4 pt-4 border-t border-neutral-200/40 dark:border-white/5">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
