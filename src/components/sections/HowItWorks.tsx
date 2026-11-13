import React from 'react';
import { Network, Sliders, Trophy } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Audit & Connect Hardware',
      subtitle: 'From personal student laptops to high-power lab rigs',
      description:
        'Departments register their lab sub-meters and computer inventory. Students input their daily workstations into the Calculator to establish an institutional baseline.',
      icon: <Network className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      num: '02',
      title: 'Simulate & Enforce Policies',
      subtitle: 'Kill vampire power and trim idle workstation hours',
      description:
        'Use our interactive what-if projections to see exact kWh, CO₂, and rupee savings from switching idle PCs off after 6:00 PM, undervolting CPUs, and adjusting display timeouts.',
      icon: <Sliders className="w-6 h-6 text-amber-500" />,
    },
    {
      num: '03',
      title: 'Divert E-Waste & Celebrate',
      subtitle: 'Zero landfill disposal and live leaderboard competition',
      description:
        'Drop obsolete devices in smart campus bins, track precious metal recovery, and watch your department climb the live Green Score leaderboard to claim semester awards.',
      icon: <Trophy className="w-6 h-6 text-sky-500" />,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50/60 dark:bg-black/30 border-b border-neutral-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            A Seamless 3-Step Journey
          </span>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white">
            How GreenCampus Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            A frictionless feedback loop transforming academic energy data into verifiable institutional decarbonization.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl glass-panel interactive-card relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-3xl font-black text-neutral-200 dark:text-white/10 tracking-tighter">
                    {s.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                  {s.title}
                </h3>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
                  {s.subtitle}
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-4 border-t border-neutral-200/50 dark:border-white/5">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
