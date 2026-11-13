import React from 'react';
import Link from 'next/link';
import { Leaf, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
        <Leaf className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          Error 404 • Page Off-Grid
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 dark:text-white tracking-tight">
          Zero-Carbon Wilderness
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          The sustainability page or metric you are looking for has been powered down or moved to conserve campus bandwidth.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-100 transition-colors"
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Campus Command Center</span>
        </Link>
      </div>
    </div>
  );
}
