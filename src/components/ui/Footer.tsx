import React from 'react';
import Link from 'next/link';
import { Leaf, Globe, Shield, ExternalLink } from 'lucide-react';
import { GRID_EMISSION_FACTOR_INDIA } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-white/10 bg-neutral-100/40 dark:bg-[#040C08] py-16 text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & SDG Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-neutral-900 dark:text-white tracking-tight">
                Green<span className="text-emerald-700 dark:text-emerald-400">Campus</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              The institutional computing decarbonization and circular electronics monitoring platform for higher education. Empowering departments, labs, and students to measure and slash digital footprints.
            </p>

            {/* UN SDG Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/sdg#sdg12"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors text-amber-700 dark:text-amber-400 text-xs font-semibold"
              >
                <div className="w-4 h-4 rounded bg-[#CF8D2A] text-white flex items-center justify-center font-bold text-[9px]">
                  12
                </div>
                <span>SDG 12: Responsible Consumption</span>
              </Link>
              <Link
                href="/sdg#sdg13"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
              >
                <div className="w-4 h-4 rounded bg-[#3F7E44] text-white flex items-center justify-center font-bold text-[9px]">
                  13
                </div>
                <span>SDG 13: Climate Action</span>
              </Link>
            </div>
          </div>

          {/* Module Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Platform Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculator" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Device Calculator
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Lab Electricity Tracker
                </Link>
              </li>
              <li>
                <Link href="/ewaste" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  E-Waste Circular Monitor
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Campus Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Monthly Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology & Science */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Science & Data
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Methodology & Formulas
                </Link>
              </li>
              <li>
                <Link href="/sdg" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  UN SDG Mapping
                </Link>
              </li>
              <li>
                <span className="text-xs text-neutral-500 dark:text-neutral-500 block">
                  Grid Factor: {GRID_EMISSION_FACTOR_INDIA} kg CO₂/kWh (CEA Baseline v19)
                </span>
              </li>
              <li>
                <span className="text-xs text-neutral-500 dark:text-neutral-500 block">
                  Cradle-to-Grave LCA standards (ISO 14040/44)
                </span>
              </li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Institutional
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>NAAC & NIRF Compliant</span>
              </li>
              <li className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                <Globe className="w-3.5 h-3.5 text-sky-500" />
                <span>WEEE Certified Recyclers</span>
              </li>
              <li>
                <a
                  href="https://sdgs.un.org/goals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-emerald-600 transition-colors"
                >
                  <span>UN Sustainable Goals</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-neutral-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <div className="flex items-center gap-1">
            <span>© 2024 GreenCampus Initiative. Designed with precision for college campuses.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Zero telemetry • LocalStorage demo persistence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
