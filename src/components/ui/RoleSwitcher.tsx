'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '@/components/providers/RoleProvider';
import { UserRole } from '@/lib/utils';
import { ShieldCheck, GraduationCap, Building2, ChevronDown, Check } from 'lucide-react';

export function RoleSwitcher() {
  const { session, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'student',
      title: 'Student Mode',
      subtitle: 'Aarav Sharma (3rd Yr CS)',
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'dept_admin',
      title: 'Department Admin',
      subtitle: 'Prof. Sunita Rao (CSE Chair)',
      icon: <Building2 className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'campus_admin',
      title: 'Campus Sustainability Officer',
      subtitle: 'Dr. Rajesh Verma (Campus Lead)',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
  ];

  const currentRoleConfig = roles.find((r) => r.id === session.role) || roles[0];

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all shadow-xs"
        aria-label="Switch User Role"
      >
        <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60">
          {currentRoleConfig.icon}
        </span>
        <span className="hidden sm:inline font-medium text-neutral-800 dark:text-neutral-200">
          {currentRoleConfig.title}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel shadow-2xl p-2 z-50 border border-emerald-500/20 bg-white/95 dark:bg-[#071811]/95 text-neutral-900 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Demo Persona Switcher
          </div>
          <div className="space-y-1">
            {roles.map((r) => {
              const isSelected = r.id === session.role;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/80 dark:bg-white/10 border border-neutral-200/50 dark:border-white/10">
                      {r.icon}
                    </div>
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {r.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
