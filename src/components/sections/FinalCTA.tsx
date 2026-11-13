import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto rounded-3xl p-10 sm:p-16 relative overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#092B21] to-[#04140F] text-white shadow-2xl border border-emerald-500/20">
        {/* Abstract Glowing Aura */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 1,280+ Campus Changemakers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to lead your college towards net-zero computing?
          </h2>

          <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-2xl">
            Whether you&apos;re a student optimizing your laptop battery habits, a lab instructor killing vampire power, or a university dean building NAAC green credentials—it all starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/calculator"
              className="px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-neutral-900 font-bold text-sm transition-all shadow-lg shadow-emerald-400/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Calculate My Footprint Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Campus Command Center</span>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-emerald-200/60 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              100% Free &amp; Open for Academic Institutions
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Personal Data Collection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
