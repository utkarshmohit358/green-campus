'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all text-neutral-700 dark:text-neutral-200 shadow-xs cursor-pointer"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle visual theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-800 animate-in spin-in-90 duration-200" />
      )}
    </button>
  );
}
