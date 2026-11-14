'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calculator,
  Zap,
  Trash2,
  Trophy,
  FileText,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  TreeDeciduous,
} from 'lucide-react';

interface FeatureStory {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  link: string;
  linkText: string;
  icon: React.ReactNode;
}

const FEATURES: FeatureStory[] = [
  {
    id: 'calculator',
    badge: 'Module 01 • Student Computing',
    title: 'Personal Device Footprint Calculator',
    subtitle: 'Uncover both operational power and hidden manufacturing carbon.',
    description:
      'Students and staff configure their daily device ecosystem. Our pure calculation engine computes real-world operational kWh against India’s national grid factor (0.71 kg CO₂/kWh) plus amortized embodied lifecycle emissions.',
    highlights: [
      'Multi-device catalog with eco, normal & performance power profiles',
      'Instant breakdown: operational vs embodied manufacturing carbon',
      'Equivalencies in mature trees, km driven, and smartphone charges',
      'Exportable high-res PNG footprint card to share on social feeds',
    ],
    link: '/calculator',
    linkText: 'Launch Device Calculator',
    icon: <Calculator className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: 'labs',
    badge: 'Module 02 • Department Infrastructure',
    title: 'Department Lab Electricity Tracker',
    subtitle: 'Zero in on lab consumption, idle overnight drain, and peak surges.',
    description:
      'Campus departments monitor power draw across 14+ computer labs. Compare month-over-month trends, detect overnight vampire loads when labs are empty, and simulate what-if shutdowns.',
    highlights: [
      'Dynamic kWh per workstation metrics with India tariff cost modeling',
      'Interactive 24x7 heatmap identifying after-hours waste',
      'What-if slider: project savings from 6:00 PM idle shutdowns',
      'Role-governed meter reading logging with instant validation',
    ],
    link: '/labs',
    linkText: 'Explore Lab Energy Tracker',
    icon: <Zap className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'ewaste',
    badge: 'Module 03 • Circular Electronics',
    title: 'E-Waste Collection & Circular Monitor',
    subtitle: 'Track campus electronics from student donation to zero-landfill triage.',
    description:
      'Close the loop on campus electronic hardware. Monitor smart bin fill levels on an interactive campus map, schedule student collection drives, and view quantified precious material recoveries.',
    highlights: [
      'Circular disposal flow: triage, donation to local schools, R2 recycling',
      'Recovered resource calculations: gold, copper, aluminium, and silver',
      'Campus SVG map with live fill-level indicators for all 6 smart drop bins',
      'Supports UN SDG Target 12.5 with 98.4% landfill diversion',
    ],
    link: '/ewaste',
    linkText: 'Open E-Waste Hub',
    icon: <Trash2 className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'leaderboard',
    badge: 'Module 04 • Inter-Department Gamification',
    title: 'Sustainability Leaderboard & Podium',
    subtitle: 'Celebrate top departments and students with transparent scoring.',
    description:
      'Rank academic departments using a transparent multi-criteria Green Score formula balancing lab energy reduction (35%), student footprint (25%), e-waste collected (20%), and participation (20%).',
    highlights: [
      'Animated podium for the top 3 greenest departments',
      'Sortable rankings with rank-change arrows and 6-month sparklines',
      'Earnable badges: "Energy Saver", "Zero Vampire Load", "Upcycler"',
      'Student individual rankings with privacy-first anonymization',
    ],
    link: '/leaderboard',
    linkText: 'View Campus Leaderboard',
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'reports',
    badge: 'Module 05 • Executive Compliance',
    title: 'Monthly Sustainability Report Generator',
    subtitle: 'Editorial-grade ESG reports ready for NIRF, NAAC, and leadership.',
    description:
      'One-click auto-generated campus sustainability dossiers. Features executive summaries, KPI trends, top and bottom performing departments, verified carbon abated, and printable PDF layouts.',
    highlights: [
      'Historical archive with one-click month navigation',
      'Direct mapping to UN SDG 12 & SDG 13 indicator criteria',
      'Print-ready stylesheet layout for executive board briefings',
      'Cryptographically shareable links for institutional audits',
    ],
    link: '/reports',
    linkText: 'Read Monthly Reports',
    icon: <FileText className="w-5 h-5 text-emerald-500" />,
  },
];

export function PinnedFeatureStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current || !stageRef.current) return;

    const totalFeatures = FEATURES.length;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${totalFeatures * 100}%`,
      pin: stageRef.current,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.5,
      onUpdate: (self) => {
        const rawProgress = self.progress * totalFeatures;
        const index = Math.min(totalFeatures - 1, Math.floor(rawProgress));
        setActiveIndex(index);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, []);

  const currentFeature = FEATURES[activeIndex] || FEATURES[0];

  return (
    <section ref={containerRef} className="relative bg-white dark:bg-[#06120E] transition-colors">
      <div
        ref={stageRef}
        className="h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Story Copy */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2">
              {FEATURES.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-8 bg-emerald-600 dark:bg-emerald-400'
                      : 'w-2 bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-xs font-semibold text-neutral-400 ml-2">
                0{activeIndex + 1} / 0{FEATURES.length}
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
              {currentFeature.icon}
              <span>{currentFeature.badge}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                {currentFeature.title}
              </h2>
              <p className="text-base font-medium text-emerald-700 dark:text-emerald-400">
                {currentFeature.subtitle}
              </p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {currentFeature.description}
            </p>

            {/* Feature Highlights */}
            <ul className="space-y-2 pt-2">
              {currentFeature.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Action CTA Button */}
            <div className="pt-3">
              <Link
                href={currentFeature.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-900/10 hover:translate-x-0.5 transition-all group"
              >
                <span>{currentFeature.linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-Fidelity Animated UI Mockup */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border border-emerald-500/20 bg-gradient-to-br from-white/95 to-neutral-50/90 dark:from-[#0B241B]/90 dark:to-[#05140E]/95 overflow-hidden min-h-[460px] flex flex-col justify-center transition-all duration-500">
              {/* Background Accent Ambient Glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Mockup 1: Calculator */}
              {activeIndex === 0 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Personal Footprint Analysis
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Student Workstation Profile
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      Greener Score: 86/100
                    </span>
                  </div>

                  {/* Device List Mini Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            MacBook Air M2 (14&quot;)
                          </div>
                          <div className="text-xs text-neutral-500">7 hrs/day • Eco Mode</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">68.4 kg CO₂/yr</div>
                        <div className="text-[11px] text-emerald-600">72% Embodied</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            27&quot; 4K External Monitor
                          </div>
                          <div className="text-xs text-neutral-500">4 hrs/day • 35 Watts</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">42.1 kg CO₂/yr</div>
                        <div className="text-[11px] text-sky-600">60% Operational</div>
                      </div>
                    </div>
                  </div>

                  {/* Equivalents Preview */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-center">
                      <TreeDeciduous className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                      <div className="text-base font-extrabold text-neutral-900 dark:text-white">5.1</div>
                      <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Trees to offset</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 text-center">
                      <div className="text-base font-extrabold text-neutral-900 dark:text-white mt-1">576 km</div>
                      <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Gas car equivalent</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 text-center">
                      <div className="text-base font-extrabold text-neutral-900 dark:text-white mt-1">13,475</div>
                      <div className="text-[10px] text-neutral-600 dark:text-neutral-400">Phone charges</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mockup 2: Labs Tracker */}
              {activeIndex === 1 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        CSE Tech Block • Live Metering
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                        AI &amp; Deep Learning Lab TB-401
                      </h4>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      <TrendingDown className="w-3.5 h-3.5" />
                      -16.4% MoM
                    </span>
                  </div>

                  {/* Simulated Chart Bars */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-500 font-medium">
                      <span>Monthly Consumption vs Baseline Target (kWh)</span>
                      <span className="text-emerald-700 dark:text-emerald-400">3,950 / 4,200 kWh</span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[84%]" />
                    </div>
                  </div>

                  {/* Anomaly Detection Banner */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        Overnight Idle Anomaly Detected (Lab GH-206)
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        18 workstations left powered on between 11 PM and 6 AM. Auto-shutdown projected to save ₹14,200 / mo.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                      <div className="text-[11px] text-neutral-500">Workstations Monitored</div>
                      <div className="text-xl font-bold text-neutral-900 dark:text-white">60 Active PCs</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
                      <div className="text-[11px] text-neutral-500">Carbon Abated This Term</div>
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">4,146 kg CO₂</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mockup 3: E-Waste */}
              {activeIndex === 2 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Circular Electronics Flow
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                        4,820 kg Diverted from Landfills
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      98.4% Diverted
                    </span>
                  </div>

                  {/* Flow Stages */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">612 Units</div>
                      <div className="text-neutral-500 mt-0.5">Donated / Reused</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                      <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">584 Units</div>
                      <div className="text-neutral-500 mt-0.5">Refurbished</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">944 Units</div>
                      <div className="text-neutral-500 mt-0.5">R2 Recycled</div>
                    </div>
                  </div>

                  {/* Precious Minerals Bar */}
                  <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Precious Minerals Recovered:
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-amber-500 font-bold">135g</span> Gold
                      </div>
                      <div>
                        <span className="text-emerald-500 font-bold">578kg</span> Copper
                      </div>
                      <div>
                        <span className="text-sky-500 font-bold">410kg</span> Aluminium
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mockup 4: Leaderboard */}
              {activeIndex === 3 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Semester Rankings
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Department Green Standings
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400">
                      Top Performer: IT Dept
                    </span>
                  </div>

                  {/* Mini Podium Row */}
                  <div className="flex items-end justify-center gap-3 pt-2">
                    {/* 2nd place */}
                    <div className="w-1/3 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/15 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-white mb-1">
                        2
                      </div>
                      <div className="w-full bg-neutral-200/70 dark:bg-white/10 rounded-2xl p-3 text-center">
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">CSE</div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">90.8</div>
                      </div>
                    </div>

                    {/* 1st place */}
                    <div className="w-1/3 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-black text-sm text-neutral-900 mb-1 shadow-md shadow-amber-500/30">
                        👑 1
                      </div>
                      <div className="w-full bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-center">
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">IT Dept</div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-black text-base">92.4</div>
                        <span className="text-[10px] text-amber-500 font-semibold">+22.8% Energy Drop</span>
                      </div>
                    </div>

                    {/* 3rd place */}
                    <div className="w-1/3 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-700/60 text-white flex items-center justify-center font-bold text-xs mb-1">
                        3
                      </div>
                      <div className="w-full bg-neutral-200/70 dark:bg-white/10 rounded-2xl p-3 text-center">
                        <div className="font-bold text-xs text-neutral-900 dark:text-white">ECE</div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">87.2</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mockup 5: Reports */}
              {activeIndex === 4 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Executive ESG Summary
                      </span>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                        October 2024 Audit Dossier
                      </h4>
                    </div>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      NIRF Validated
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic bg-neutral-100 dark:bg-white/5 p-3 rounded-2xl border border-neutral-200/50 dark:border-white/5">
                    &ldquo;Recorded institutional reduction of 5,840 kWh across 8 academic departments, abating 4,146 kg CO₂ and achieving 98.4% e-waste circular recovery.&rdquo;
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5">
                      <div className="text-neutral-500">UN SDG 12 Metric</div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">1,180 kg Upcycled</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5">
                      <div className="text-neutral-500">UN SDG 13 Metric</div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">4.15 T Carbon Abated</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
