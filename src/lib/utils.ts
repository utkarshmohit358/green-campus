import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: Number.isInteger(val) ? 0 : decimals,
  }).format(val);
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPct(val: number, showSign = true): string {
  const prefix = showSign && val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(1)}%`;
}

export type UserRole = 'student' | 'dept_admin' | 'campus_admin';

export interface UserSession {
  role: UserRole;
  name: string;
  department?: string;
  collegeName: string;
}

export const DEFAULT_USER_SESSION: UserSession = {
  role: 'student',
  name: 'Aarav Sharma',
  department: 'Computer Science & Engineering',
  collegeName: 'National Institute of Technology',
};
