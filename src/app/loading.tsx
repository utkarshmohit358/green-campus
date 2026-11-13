import React from 'react';

export default function Loading() {
  return (
    <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 pb-6 border-b border-neutral-200/60 dark:border-white/10">
        <div className="w-44 h-5 rounded-full bg-neutral-200 dark:bg-white/10" />
        <div className="w-80 h-10 rounded-2xl bg-neutral-300 dark:bg-white/15" />
        <div className="w-full max-w-xl h-4 rounded-lg bg-neutral-200 dark:bg-white/10" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl glass-panel space-y-3 border border-neutral-200/50 dark:border-white/5"
          >
            <div className="w-24 h-4 rounded-md bg-neutral-200 dark:bg-white/10" />
            <div className="w-32 h-8 rounded-lg bg-neutral-300 dark:bg-white/15" />
            <div className="w-20 h-3 rounded-md bg-neutral-200 dark:bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main Chart Card skeleton */}
      <div className="p-8 rounded-3xl glass-panel space-y-4 border border-neutral-200/50 dark:border-white/5">
        <div className="w-56 h-6 rounded-lg bg-neutral-300 dark:bg-white/15" />
        <div className="w-full h-64 rounded-2xl bg-neutral-200/60 dark:bg-white/5" />
      </div>
    </div>
  );
}
