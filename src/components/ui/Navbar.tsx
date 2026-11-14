'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SupabaseStatusBadge } from './SupabaseModal';
import {
  Leaf,
  Menu,
  X,
  Command,
  Calculator,
  Zap,
  Trash2,
  Trophy,
  FileText,
  LayoutDashboard,
  Globe2,
} from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { href: '/labs', label: 'Lab Energy', icon: <Zap className="w-4 h-4" /> },
    { href: '/ewaste', label: 'E-Waste', icon: <Trash2 className="w-4 h-4" /> },
    { href: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { href: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/sdg', label: 'SDG Impact', icon: <Globe2 className="w-4 h-4" /> },
  ];

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 glass-nav shadow-sm border-b border-neutral-200/50 dark:border-white/10'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-[#0B3D2E] dark:from-emerald-500 dark:to-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                Green<span className="text-emerald-700 dark:text-emerald-400">Campus</span>
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                SDG 12 & 13
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight hidden sm:block">
              Sustainable Computing
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/60 dark:bg-black/20 p-1.5 rounded-full border border-neutral-200/60 dark:border-white/5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-neutral-100/70 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cmd+K Quick Search Pill */}
          <button
            onClick={triggerCommandPalette}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/70 dark:border-white/10 hover:border-emerald-500/50 transition-colors"
            title="Open Command Palette (⌘K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="px-1 py-0.5 rounded text-[10px] bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Supabase Status & Config */}
          <SupabaseStatusBadge />

          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 glass-panel border-b border-neutral-200/70 dark:border-white/10 bg-white/95 dark:bg-[#071811]/95 text-neutral-900 dark:text-neutral-100 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="p-1 rounded-lg bg-neutral-100 dark:bg-white/5 text-emerald-600 dark:text-emerald-400">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-neutral-200/50 dark:border-white/10">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  triggerCommandPalette();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Command className="w-4 h-4 text-emerald-500" />
                  Quick Command Palette
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-white/10 text-xs">⌘K</kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
