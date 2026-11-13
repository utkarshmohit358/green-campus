'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calculator,
  Zap,
  Trash2,
  Trophy,
  FileText,
  LayoutDashboard,
  Info,
  Globe2,
  Moon,
  Sun,
  UserCheck,
  ArrowRight,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRole } from '@/components/providers/RoleProvider';

interface PaletteItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Roles';
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { setRole } = useRole();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const items: PaletteItem[] = [
    {
      id: 'nav-dashboard',
      title: 'Campus Command Center (Unified Dashboard)',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/dashboard'),
      keywords: 'overview metrics summary kpi',
    },
    {
      id: 'nav-calculator',
      title: 'Student Device Emission Calculator',
      category: 'Navigation',
      icon: <Calculator className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/calculator'),
      keywords: 'footprint carbon laptop compute estimate',
    },
    {
      id: 'nav-labs',
      title: 'Department Lab Electricity Tracker',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      action: () => navigateTo('/labs'),
      keywords: 'energy kwh power meters departments computer labs',
    },
    {
      id: 'nav-ewaste',
      title: 'E-Waste Collection & Circular Monitor',
      category: 'Navigation',
      icon: <Trash2 className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/ewaste'),
      keywords: 'recycle bins recovery drop-off copper gold',
    },
    {
      id: 'nav-leaderboard',
      title: 'Sustainability Leaderboard & Gamification',
      category: 'Navigation',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      action: () => navigateTo('/leaderboard'),
      keywords: 'ranks departments podium green score students',
    },
    {
      id: 'nav-reports',
      title: 'Monthly Executive Sustainability Reports',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/reports'),
      keywords: 'pdf monthly summary download audit',
    },
    {
      id: 'nav-sdg',
      title: 'UN SDG 12 & SDG 13 Alignment Deep-Dive',
      category: 'Navigation',
      icon: <Globe2 className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/sdg'),
      keywords: 'sdg un goals climate action responsible consumption',
    },
    {
      id: 'nav-about',
      title: 'About Methodology & Emission Factors',
      category: 'Navigation',
      icon: <Info className="w-4 h-4 text-sky-500" />,
      action: () => navigateTo('/about'),
      keywords: 'formulas cea grid factors calculation science',
    },
    {
      id: 'action-theme',
      title: `Toggle Theme (Currently: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'})`,
      category: 'Actions',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => {
        toggleTheme();
        setIsOpen(false);
      },
      keywords: 'dark light mode appearance theme',
    },
    {
      id: 'role-student',
      title: 'Switch Role to Student (Aarav Sharma)',
      category: 'Roles',
      icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
      action: () => {
        setRole('student');
        setIsOpen(false);
      },
      keywords: 'role switch student',
    },
    {
      id: 'role-dept',
      title: 'Switch Role to Department Admin (Prof. Sunita Rao)',
      category: 'Roles',
      icon: <UserCheck className="w-4 h-4 text-amber-500" />,
      action: () => {
        setRole('dept_admin');
        setIsOpen(false);
      },
      keywords: 'role switch department admin professor',
    },
    {
      id: 'role-campus',
      title: 'Switch Role to Campus Sustainability Officer (Dr. Verma)',
      category: 'Roles',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      action: () => {
        setRole('campus_admin');
        setIsOpen(false);
      },
      keywords: 'role switch campus admin chief sustainability officer',
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl rounded-2xl glass-panel shadow-2xl overflow-hidden z-10 border border-emerald-500/25 bg-white/95 dark:bg-[#071811]/95 text-neutral-900 dark:text-neutral-100"
            >
              {/* Search Bar */}
              <div className="flex items-center px-4 py-3.5 border-b border-neutral-200/80 dark:border-white/10 gap-3">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or jump to page... (ESC to exit)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 font-medium"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-neutral-400">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-sm hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
                          {item.icon}
                        </div>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-neutral-200/40 dark:border-white/5">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer shortcut helper */}
              <div className="px-4 py-2 bg-neutral-50/70 dark:bg-white/[0.02] border-t border-neutral-200/60 dark:border-white/5 flex items-center justify-between text-xs text-neutral-400">
                <span>Navigation & Actions</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-white/10 font-mono text-[10px]">
                    ⌘K
                  </kbd>{' '}
                  opens anytime
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
