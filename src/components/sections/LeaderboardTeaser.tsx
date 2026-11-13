import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Award } from 'lucide-react';
import leaderboardData from '@/data/leaderboard.json';

export function LeaderboardTeaser() {
  const top3 = leaderboardData.departmentRankings.slice(0, 3);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Inter-Department Competition
            </span>
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white">
              Who is leading the green revolution?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Departments compete for the semester Green Banner. Transparent scoring based on verified energy drop, e-waste diversion, and student eco-mode adoption.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm transition-all shadow-md group shrink-0"
          >
            <span>Full Standings &amp; Badges</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Rank 2 (CSE) */}
          <div className="p-6 rounded-3xl glass-panel interactive-card order-2 md:order-1 border-t-4 border-t-neutral-400">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-white font-bold text-sm flex items-center justify-center">
                #2
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                +{top3[1].energyReductionPct}% Power Drop
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
              {top3[1].departmentName}
            </h3>
            <div className="text-xs text-neutral-500 mb-4">Code: {top3[1].code}</div>
            <div className="flex items-baseline gap-2 pt-4 border-t border-neutral-200/50 dark:border-white/5">
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                {top3[1].greenScore}
              </span>
              <span className="text-xs text-neutral-500">Green Score</span>
            </div>
          </div>

          {/* Rank 1 (IT) - Elevated Podium */}
          <div className="p-8 rounded-3xl glass-panel interactive-card order-1 md:order-2 border-2 border-emerald-500/50 dark:border-emerald-400/40 bg-gradient-to-b from-emerald-50/70 to-white/90 dark:from-emerald-950/40 dark:to-[#071811]/90 shadow-2xl relative md:-translate-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-neutral-900 font-extrabold text-xs shadow-md flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Campus Champion</span>
            </div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="w-10 h-10 rounded-full bg-amber-400 text-neutral-900 font-black text-base flex items-center justify-center shadow-sm">
                #1
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                +{top3[0].energyReductionPct}% Power Drop
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-1">
              {top3[0].departmentName}
            </h3>
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-4 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{top3[0].badges.join(' • ')}</span>
            </div>
            <div className="flex items-baseline gap-2 pt-4 border-t border-neutral-200/50 dark:border-white/10">
              <span className="text-4xl font-black text-emerald-700 dark:text-emerald-400">
                {top3[0].greenScore}
              </span>
              <span className="text-xs font-bold text-neutral-500">Green Score pts</span>
            </div>
          </div>

          {/* Rank 3 (ECE) */}
          <div className="p-6 rounded-3xl glass-panel interactive-card order-3 border-t-4 border-t-amber-700">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 font-bold text-sm flex items-center justify-center">
                #3
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                +{top3[2].energyReductionPct}% Power Drop
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
              {top3[2].departmentName}
            </h3>
            <div className="text-xs text-neutral-500 mb-4">Code: {top3[2].code}</div>
            <div className="flex items-baseline gap-2 pt-4 border-t border-neutral-200/50 dark:border-white/5">
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                {top3[2].greenScore}
              </span>
              <span className="text-xs text-neutral-500">Green Score</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
