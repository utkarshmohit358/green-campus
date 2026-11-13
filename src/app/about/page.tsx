import React from 'react';
import Link from 'next/link';
import {
  GRID_EMISSION_FACTOR_INDIA,
  ELECTRICITY_COST_PER_KWH_INR,
  DEVICE_CATALOG,
} from '@/lib/constants';
import {
  BookOpen,
  Cpu,
  Zap,
  TreeDeciduous,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific Transparency &amp; Open Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Methodology &amp; Emission Factors
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          GreenCampus adheres to peer-reviewed environmental engineering standards and official government emission registries. Every number in our dashboard is calculated using deterministic, pure mathematical functions.
        </p>
      </div>

      {/* Section 1: Operational Emissions */}
      <section className="p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              1. Operational Electricity &amp; Grid Emissions
            </h2>
            <p className="text-xs text-neutral-500">
              Measuring the coal-and-gas burn behind every kilowatt-hour
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-black/30 font-mono text-xs text-neutral-800 dark:text-neutral-200 space-y-2 border border-neutral-200 dark:border-white/10">
          <div className="text-neutral-500 font-semibold">{/* Formula 1 */}# Operational Energy Consumption:</div>
          <div className="font-bold text-emerald-700 dark:text-emerald-400">
            Annual kWh = (Effective Watts × Hours/Day × Days/Week × 52 Weeks) / 1000
          </div>
          <div className="pt-2 text-neutral-500 font-semibold">{/* Formula 2 */}# Carbon Dioxide Equivalent:</div>
          <div className="font-bold text-emerald-700 dark:text-emerald-400">
            Operational CO₂ (kg) = Annual kWh × Grid Emission Factor
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <p>
            <strong>Grid Carbon Factor ({GRID_EMISSION_FACTOR_INDIA} kg CO₂/kWh):</strong> Derived from the <em>Central Electricity Authority (CEA) of India, CO₂ Baseline Database for the Indian Power Sector, User Guide Version 19.0</em>. The combined margin national grid average accounts for thermal generation baseload across national interconnections.
          </p>
          <p>
            <strong>Power Profile Multipliers:</strong>
            Eco mode (0.72x) assumes active CPU throttling, 60Hz display refresh, and aggressive display sleep. Performance mode (1.35x) reflects unbounded turbo clocks and high display nits.
          </p>
        </div>
      </section>

      {/* Section 2: Embodied Manufacturing Emissions */}
      <section className="p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              2. Embodied Manufacturing &amp; Lifecycle Carbon (LCA)
            </h2>
            <p className="text-xs text-neutral-500">
              The carbon emitted before the box is ever opened
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-black/30 font-mono text-xs text-neutral-800 dark:text-neutral-200 space-y-2 border border-neutral-200 dark:border-white/10">
          <div className="text-neutral-500 font-semibold">{/* Formula 3 */}# Amortized Annual Embodied Burden:</div>
          <div className="font-bold text-sky-600 dark:text-sky-400">
            Annual Embodied CO₂ = Total Cradle-to-Grave Manufacturing CO₂ / Effective Lifespan (Years)
          </div>
          <div className="text-[11px] text-neutral-400">
            Where Effective Lifespan = Math.max(Standard Lifespan, Actual Device Age)
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Research by Dell, Apple, and IEEE shows that between <strong>70% and 85%</strong> of consumer electronics lifecycle emissions occur in supply chains, silicon wafer fabrication, and precious metal refining. Keeping a laptop for 5 years instead of 3 drops its annualized manufacturing footprint by 40%.
        </p>

        {/* Catalog Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/60 dark:border-white/10 text-neutral-500 font-bold">
                <th className="py-2.5">Device Type</th>
                <th className="py-2.5">Typical Watts</th>
                <th className="py-2.5">Cradle-to-Grave CO₂</th>
                <th className="py-2.5">Target Lifespan</th>
                <th className="py-2.5">Amortized CO₂/yr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/40 dark:divide-white/5">
              {Object.values(DEVICE_CATALOG).map((d) => (
                <tr key={d.id} className="hover:bg-neutral-100/50 dark:hover:bg-white/5">
                  <td className="py-2.5 font-bold text-neutral-900 dark:text-white">{d.name}</td>
                  <td className="py-2.5">{d.defaultWatts} W</td>
                  <td className="py-2.5">{d.embodiedTotalKg} kg</td>
                  <td className="py-2.5">{d.typicalLifespanYears} years</td>
                  <td className="py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">
                    {(d.embodiedTotalKg / d.typicalLifespanYears).toFixed(1)} kg/yr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Physical Equivalents & Formulas */}
      <section className="p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
            <TreeDeciduous className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              3. Physical GHG Equivalents
            </h2>
            <p className="text-xs text-neutral-500">
              Translating kilograms of gas into tangible reality
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 space-y-1">
            <div className="font-bold text-neutral-900 dark:text-white">Mature Tree Absorption</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
              21.77 kg CO₂ / tree / year
            </div>
            <p className="text-neutral-500 text-[11px]">
              Based on US EPA Greenhouse Gas Equivalencies Calculator for 10-year-old urban coniferous and deciduous trees.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 space-y-1">
            <div className="font-bold text-neutral-900 dark:text-white">Gasoline Vehicle Distance</div>
            <div className="text-amber-600 dark:text-amber-400 font-mono font-bold">
              0.192 kg CO₂ / km driven
            </div>
            <p className="text-neutral-500 text-[11px]">
              Average passenger vehicle fuel economy of 22.2 MPG burning standard gasoline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 space-y-1">
            <div className="font-bold text-neutral-900 dark:text-white">Smartphone Full Charge</div>
            <div className="text-sky-600 dark:text-sky-400 font-mono font-bold">
              0.0082 kg CO₂ / charge
            </div>
            <p className="text-neutral-500 text-[11px]">
              Based on a 15.48 Wh smartphone battery with 85% charger conversion efficiency.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 space-y-1">
            <div className="font-bold text-neutral-900 dark:text-white">Institutional Electricity Cost</div>
            <div className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
              ₹{ELECTRICITY_COST_PER_KWH_INR} / kWh
            </div>
            <p className="text-neutral-500 text-[11px]">
              Average commercial HT educational tariff across Indian State Electricity Distribution Companies (Discoms).
            </p>
          </div>
        </div>
      </section>

      {/* Link to SDG page */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-neutral-900 dark:text-white">
            Looking for UN SDG 12 &amp; SDG 13 alignment?
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Explore our target-by-target compliance mapping and sustainability audit documentation.
          </p>
        </div>
        <Link
          href="/sdg"
          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
        >
          <span>View SDG Mapping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
