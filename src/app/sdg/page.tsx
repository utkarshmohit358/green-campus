import React from 'react';
import {
  Globe2,
  ShieldCheck,
  Recycle,
  CloudRain,
  ExternalLink,
} from 'lucide-react';

export default function SDGPage() {
  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <Globe2 className="w-3.5 h-3.5" />
          <span>United Nations Sustainable Development Goals</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          UN SDG 12 &amp; SDG 13 Framework
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          GreenCampus was engineered explicitly to bridge institutional IT infrastructure with the 2030 Agenda for Sustainable Development, focusing on <strong>Responsible Consumption (SDG 12)</strong> and <strong>Climate Action (SDG 13)</strong>.
        </p>
      </div>

      {/* SDG 12 Deep Dive Card */}
      <section id="sdg12" className="p-8 rounded-3xl glass-panel space-y-6 border-2 border-[#CF8D2A]/30">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200/60 dark:border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-[#CF8D2A] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            12
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#CF8D2A]">
              UN Sustainable Development Goal 12
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Responsible Consumption and Production
            </h2>
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Higher education computing environments generate thousands of tonnes of upstream silicon manufacturing emissions and obsolete electronics annually. GreenCampus implements specific tools mapping directly to Target 12.5 and Target 12.6.
        </p>

        {/* Target 12.5 & 12.6 Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#CF8D2A]/10 border border-[#CF8D2A]/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <Recycle className="w-4 h-4 text-[#CF8D2A]" />
              <span>Target 12.5: Substantially Reduce Waste Generation</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <em>&ldquo;By 2030, substantially reduce waste generation through prevention, reduction, recycling and reuse.&rdquo;</em>
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 space-y-1">
              <div>✓ 98.4% campus e-waste diverted from municipal landfills.</div>
              <div>✓ 1,196 units triaged for local school donations &amp; maker spaces.</div>
              <div>✓ Lifespan extension model drops hardware turnover rate by 33%.</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#CF8D2A]/10 border border-[#CF8D2A]/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#CF8D2A]" />
              <span>Target 12.6: Adopt Sustainable Practices &amp; Reporting</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <em>&ldquo;Encourage institutions to adopt sustainable practices and integrate sustainability information into reporting cycles.&rdquo;</em>
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 space-y-1">
              <div>✓ Automated Monthly Campus Sustainability Reports.</div>
              <div>✓ Downloadable PDF dossiers for NIRF &amp; NAAC Criterion 7.</div>
              <div>✓ Public cryptographic share links for independent audit.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SDG 13 Deep Dive Card */}
      <section id="sdg13" className="p-8 rounded-3xl glass-panel space-y-6 border-2 border-[#3F7E44]/30">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-200/60 dark:border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-[#3F7E44] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            13
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3F7E44] dark:text-[#5FB765]">
              UN Sustainable Development Goal 13
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Climate Action
            </h2>
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          On an energy grid with an emission intensity of 0.71 kg CO₂ per kWh, eliminating unnecessary workstation idle load and shifting charging habits delivers immediate, measurable carbon abatement.
        </p>

        {/* Target 13.2 & 13.3 Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#3F7E44]/10 border border-[#3F7E44]/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <CloudRain className="w-4 h-4 text-[#3F7E44]" />
              <span>Target 13.2: Integrate Climate Measures into Policies</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <em>&ldquo;Integrate climate change measures into institutional policies, strategies, and planning.&rdquo;</em>
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 space-y-1">
              <div>✓ Lab tracker anomaly alarms: overnight idle detection.</div>
              <div>✓ What-if policy simulations: 6:00 PM auto-shutdowns save ~14,000 kWh/mo.</div>
              <div>✓ Sub-metering accountability assigned directly to department deans.</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#3F7E44]/10 border border-[#3F7E44]/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-white">
              <Globe2 className="w-4 h-4 text-[#3F7E44]" />
              <span>Target 13.3: Build Human &amp; Institutional Capacity</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <em>&ldquo;Improve education, awareness-raising, and human and institutional capacity on climate change mitigation.&rdquo;</em>
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 space-y-1">
              <div>✓ Student Device Emission Calculator used by 1,280+ students.</div>
              <div>✓ Actionable habit tips (tab discarding, undervolting, power strips).</div>
              <div>✓ Inter-department gamified Leaderboard inspiring healthy competition.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official UN External Citation */}
      <div className="p-6 rounded-3xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          <span>Reference: United Nations Department of Economic and Social Affairs (UNDESA).</span>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            The Sustainable Development Goals Report 2023: Special Edition.
          </div>
        </div>
        <a
          href="https://sdgs.un.org/goals"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
        >
          <span>Official UN SDG Knowledge Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
