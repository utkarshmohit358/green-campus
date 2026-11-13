'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import leaderboardData from '@/data/leaderboard.json';
import { LEADERBOARD_WEIGHTS } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';

type TimePeriod = 'month' | 'semester' | 'all-time';
type SortKey = 'greenScore' | 'energyReductionPct' | 'perStudentFootprintKg' | 'ewasteKgPerCapita' | 'participationRatePct';

export default function LeaderboardPage() {
  const { toast } = useToast();

  const [period, setPeriod] = useState<TimePeriod>('month');
  const [activeTab, setActiveTab] = useState<'departments' | 'students'>('departments');
  const [sortKey, setSortKey] = useState<SortKey>('greenScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [anonymizeStudents, setAnonymizeStudents] = useState<boolean>(false);
  const [showWeightInfo, setShowWeightInfo] = useState<boolean>(false);

  // Dynamic sorting for departments
  const sortedDepartments = useMemo(() => {
    const list = [...leaderboardData.departmentRankings];

    list.sort((a, b) => {
      let valA: number;
      let valB: number;

      if (period === 'month') {
        valA = sortKey === 'greenScore' ? a.monthScore : a[sortKey];
        valB = sortKey === 'greenScore' ? b.monthScore : b[sortKey];
      } else if (period === 'semester') {
        valA = sortKey === 'greenScore' ? a.semesterScore : a[sortKey];
        valB = sortKey === 'greenScore' ? b.semesterScore : b[sortKey];
      } else {
        valA = sortKey === 'greenScore' ? a.allTimeScore : a[sortKey];
        valB = sortKey === 'greenScore' ? b.allTimeScore : b[sortKey];
      }

      // For footprint, lower is better when sorted by rank
      if (sortKey === 'perStudentFootprintKg') {
        return sortAsc ? valB - valA : valA - valB;
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [period, sortKey, sortAsc]);

  const top3 = sortedDepartments.slice(0, 3);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
    toast(`Sorted by ${key}`, { type: 'info' });
  };

  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Campus Sustainability Leaderboard &amp; Honors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Sustainability Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Departments and students ranked by our transparent, multi-factor Green Score algorithm. Recognizing leadership in lab energy cuts, digital footprint awareness, and circular e-waste drop-offs.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowWeightInfo(!showWeightInfo)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Formula Weights</span>
          </button>

          {/* Month / Semester / All-time */}
          <div className="flex items-center gap-1 bg-neutral-200/60 dark:bg-white/5 p-1 rounded-full text-xs">
            {(['month', 'semester', 'all-time'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all capitalize cursor-pointer ${
                  period === p
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {p.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Formula Transparency Drawer */}
      {showWeightInfo && (
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-500/5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Transparent Multi-Factor Green Score Algorithm</span>
            </h3>
            <button onClick={() => setShowWeightInfo(false)} className="text-xs text-neutral-500">
              Dismiss
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
              <div className="text-neutral-500">Lab Energy Reduction</div>
              <div className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mt-1">
                {(LEADERBOARD_WEIGHTS.energyReductionPct * 100).toFixed(0)}% Weight
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Drop in kWh against semester target</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
              <div className="text-neutral-500">Per-Student Footprint</div>
              <div className="font-bold text-lg text-sky-600 dark:text-sky-400 mt-1">
                {(LEADERBOARD_WEIGHTS.perStudentFootprint * 100).toFixed(0)}% Weight
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Average kg CO₂ per student device</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
              <div className="text-neutral-500">E-Waste Diverted</div>
              <div className="font-bold text-lg text-amber-600 dark:text-amber-400 mt-1">
                {(LEADERBOARD_WEIGHTS.ewasteCollectionKg * 100).toFixed(0)}% Weight
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">kg of hardware dropped per capita</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
              <div className="text-neutral-500">Student Participation</div>
              <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mt-1">
                {(LEADERBOARD_WEIGHTS.participationRate * 100).toFixed(0)}% Weight
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">% enrolled taking green computing pledge</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Switch: Departments vs Individual Students */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'
          }`}
        >
          Department Standings ({sortedDepartments.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'
          }`}
        >
          Individual Students ({leaderboardData.studentRankings.length})
        </button>
      </div>

      {/* Tab A: Department Rankings */}
      {activeTab === 'departments' && (
        <div className="space-y-10 animate-in fade-in">
          {/* Top 3 Animated Visual Podium */}
          <div className="pt-8 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
              {/* Silver #2 */}
              {top3[1] && (
                <div className="p-6 rounded-3xl glass-panel order-2 md:order-1 border-t-4 border-t-slate-400 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-lg mx-auto flex items-center justify-center shadow-md">
                    🥈 2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                      {top3[1].departmentName}
                    </h3>
                    <div className="text-xs text-neutral-500">{top3[1].code}</div>
                  </div>
                  <div className="text-3xl font-black text-neutral-900 dark:text-white">
                    {period === 'month' ? top3[1].monthScore : period === 'semester' ? top3[1].semesterScore : top3[1].allTimeScore}
                    <span className="text-xs font-normal text-neutral-500"> pts</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    +{top3[1].energyReductionPct}% Energy Cut
                  </div>
                </div>
              )}

              {/* Gold #1 */}
              {top3[0] && (
                <div className="p-8 rounded-3xl glass-panel order-1 md:order-2 border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white/90 dark:from-[#172E21] dark:to-[#071811] text-center space-y-4 shadow-2xl relative md:-translate-y-6">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-neutral-900 font-extrabold text-xs shadow-md">
                    Semester Leader
                  </div>
                  <div className="w-16 h-16 rounded-full bg-amber-400 text-neutral-900 font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
                    🥇 1
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white">
                      {top3[0].departmentName}
                    </h3>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      {top3[0].code} • {top3[0].badges[0]}
                    </div>
                  </div>
                  <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400">
                    {period === 'month' ? top3[0].monthScore : period === 'semester' ? top3[0].semesterScore : top3[0].allTimeScore}
                    <span className="text-xs font-normal text-neutral-500"> pts</span>
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    {top3[0].participationRatePct}% Participation • {top3[0].ewasteKgPerCapita} kg/student e-waste
                  </div>
                </div>
              )}

              {/* Bronze #3 */}
              {top3[2] && (
                <div className="p-6 rounded-3xl glass-panel order-3 border-t-4 border-t-amber-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-800/20 text-amber-800 dark:text-amber-400 font-black text-lg mx-auto flex items-center justify-center shadow-md">
                    🥉 3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                      {top3[2].departmentName}
                    </h3>
                    <div className="text-xs text-neutral-500">{top3[2].code}</div>
                  </div>
                  <div className="text-3xl font-black text-neutral-900 dark:text-white">
                    {period === 'month' ? top3[2].monthScore : period === 'semester' ? top3[2].semesterScore : top3[2].allTimeScore}
                    <span className="text-xs font-normal text-neutral-500"> pts</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    +{top3[2].energyReductionPct}% Energy Cut
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Ranked Table with FLIP Animation */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                All Departments Standings ({period.toUpperCase()})
              </h3>
              <span className="text-xs text-neutral-500">
                Click column headers to re-sort
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/60 dark:border-white/10 text-neutral-500 font-bold">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Department</th>
                    <th
                      onClick={() => handleSort('greenScore')}
                      className="py-3 px-3 cursor-pointer hover:text-emerald-600"
                    >
                      Green Score {sortKey === 'greenScore' ? (sortAsc ? '↑' : '↓') : ''}
                    </th>
                    <th
                      onClick={() => handleSort('energyReductionPct')}
                      className="py-3 px-3 cursor-pointer hover:text-emerald-600"
                    >
                      Energy Cut (%) {sortKey === 'energyReductionPct' ? (sortAsc ? '↑' : '↓') : ''}
                    </th>
                    <th
                      onClick={() => handleSort('perStudentFootprintKg')}
                      className="py-3 px-3 cursor-pointer hover:text-emerald-600"
                    >
                      Footprint / Head {sortKey === 'perStudentFootprintKg' ? (sortAsc ? '↑' : '↓') : ''}
                    </th>
                    <th
                      onClick={() => handleSort('ewasteKgPerCapita')}
                      className="py-3 px-3 cursor-pointer hover:text-emerald-600"
                    >
                      E-Waste / Head {sortKey === 'ewasteKgPerCapita' ? (sortAsc ? '↑' : '↓') : ''}
                    </th>
                    <th
                      onClick={() => handleSort('participationRatePct')}
                      className="py-3 px-3 cursor-pointer hover:text-emerald-600"
                    >
                      Participation {sortKey === 'participationRatePct' ? (sortAsc ? '↑' : '↓') : ''}
                    </th>
                    <th className="py-3 px-3">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/40 dark:divide-white/5">
                  <AnimatePresence>
                    {sortedDepartments.map((dept, index) => {
                      const rankChange = dept.previousRank - (index + 1);
                      const currentScore =
                        period === 'month'
                          ? dept.monthScore
                          : period === 'semester'
                          ? dept.semesterScore
                          : dept.allTimeScore;

                      return (
                        <motion.tr
                          key={dept.departmentId}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-neutral-100/60 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-3 font-bold">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  index === 0
                                    ? 'bg-amber-400 text-neutral-900 font-black'
                                    : index === 1
                                    ? 'bg-slate-300 text-neutral-900'
                                    : index === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'text-neutral-500'
                                }`}
                              >
                                {index + 1}
                              </span>
                              {rankChange > 0 && (
                                <span className="flex items-center text-[10px] text-emerald-600 font-bold">
                                  <ArrowUp className="w-3 h-3" />
                                  {rankChange}
                                </span>
                              )}
                              {rankChange < 0 && (
                                <span className="flex items-center text-[10px] text-rose-500 font-bold">
                                  <ArrowDown className="w-3 h-3" />
                                  {Math.abs(rankChange)}
                                </span>
                              )}
                              {rankChange === 0 && (
                                <span className="text-[10px] text-neutral-400">
                                  <Minus className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="font-bold text-neutral-900 dark:text-white">
                              {dept.departmentName}
                            </div>
                            <div className="text-[10px] text-neutral-400">{dept.code}</div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                              {currentScore}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-semibold text-neutral-900 dark:text-white">
                            +{dept.energyReductionPct}%
                          </td>

                          <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-300">
                            {dept.perStudentFootprintKg} kg
                          </td>

                          <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-300">
                            {dept.ewasteKgPerCapita} kg
                          </td>

                          <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-300">
                            {dept.participationRatePct}%
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {dept.badges.map((b) => (
                                <span
                                  key={b}
                                  className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-500/20"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Individual Student Leaderboard */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                  Student Carbon Champions
                </h3>
                <p className="text-xs text-neutral-500">
                  Recognizing students with the lowest computing footprint and active e-waste contributions
                </p>
              </div>

              {/* Privacy Anonymize Toggle */}
              <button
                onClick={() => setAnonymizeStudents(!anonymizeStudents)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-white/10 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {anonymizeStudents ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{anonymizeStudents ? 'Anonymized Mode' : 'Show Real Names'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {leaderboardData.studentRankings.map((stud) => (
                <div
                  key={stud.rank}
                  className="p-5 rounded-3xl glass-panel interactive-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                        #{stud.rank}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        {stud.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                      {anonymizeStudents ? stud.anonymizedName : stud.name}
                    </h4>
                    <div className="text-xs text-neutral-500">
                      {stud.department} • {stud.year}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200/50 dark:border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Score:</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                        {stud.score} / 100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Device Footprint:</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {stud.footprintKg} kg/yr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">E-Waste Donated:</span>
                      <span className="font-semibold text-sky-600">
                        {stud.ewasteDonatedKg} kg
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
