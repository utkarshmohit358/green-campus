import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function SDGSection() {
  const mappings = [
    {
      feature: 'Student Device Calculator',
      sdg: 'SDG 12.8 & 13.3',
      title: 'Digital Footprint Awareness & Literacy',
      desc: 'Builds individual institutional capacity by educating students on the hidden carbon intensity of hardware and software usage habits.',
    },
    {
      feature: 'Department Lab Tracker',
      sdg: 'SDG 13.2',
      title: 'Institutional Power Decarbonization',
      desc: 'Integrates automated energy management into department governance, directly abating metric tonnes of grid emissions from idle workstations.',
    },
    {
      feature: 'E-Waste Circular Hub',
      sdg: 'SDG 12.5',
      title: '98.4% Zero-Landfill Hardware Diversion',
      desc: 'Diverts electronics from municipal dumping grounds through student triage, hardware refurbishment for local schools, and certified R2 hydrometallurgical recycling.',
    },
    {
      feature: 'Campus Leaderboard',
      sdg: 'SDG 12 & 13',
      title: 'Collective Culture Transformation',
      desc: 'Uses transparent multi-factor scoring to reward academic departments that proactively eliminate computing waste and promote circular reuse.',
    },
    {
      feature: 'Monthly ESG Reports',
      sdg: 'SDG 12.6',
      title: 'Transparent Institutional Reporting',
      desc: 'Provides automated, verifiable environmental documentation ready for NIRF, NAAC, university board audits, and climate disclosure frameworks.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Official UN Badges & Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                United Nations Agenda 2030
              </span>
              <h2 className="section-title text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
                Engineered from the ground up for SDGs 12 &amp; 13.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                GreenCampus isn&apos;t just an energy dashboard. It is an intentional framework that bridges UN Sustainable Development Goals with collegiate computing infrastructure.
              </p>
            </div>

            {/* UN Official Badge Replicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* SDG 12 Badge */}
              <div className="p-5 rounded-3xl bg-[#CF8D2A]/10 border border-[#CF8D2A]/30 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#CF8D2A] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    12
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">SDG 12</div>
                    <div className="text-[11px] text-[#CF8D2A] font-semibold">Responsible Consumption</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Target 12.5 (waste prevention, reduction, recycling) and Target 12.6 (sustainability reporting).
                </p>
              </div>

              {/* SDG 13 Badge */}
              <div className="p-5 rounded-3xl bg-[#3F7E44]/10 border border-[#3F7E44]/30 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3F7E44] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    13
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">SDG 13</div>
                    <div className="text-[11px] text-[#3F7E44] dark:text-[#5FB765] font-semibold">Climate Action</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Target 13.2 (climate measures into policies) and Target 13.3 (human and institutional awareness).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sdg"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors group"
              >
                <span>Read our full SDG Methodology Document</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Feature Mapping Matrix */}
          <div className="lg:col-span-7 space-y-3">
            {mappings.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel interactive-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {m.feature}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      {m.sdg}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {m.title}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
                    {m.desc}
                  </p>
                </div>
                <div className="shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
