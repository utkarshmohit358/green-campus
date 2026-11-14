'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Server,
  Zap,
  Key,
  Check,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
} from '@/lib/supabase/client';
import { SupabaseDatabase } from '@/lib/supabase/database';
import { useToast } from './Toast';

export function SupabaseStatusBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
        title="Supabase Database Configuration & Status"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden md:inline font-medium text-neutral-700 dark:text-neutral-300">
          {configured ? 'Supabase' : 'Supabase'}
        </span>
      </button>

      <SupabaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpdate={() => setConfigured(isSupabaseConfigured())}
      />
    </>
  );
}

export function SupabaseModal({
  isOpen,
  onClose,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      if (creds.url) setUrl(creds.url);
      if (creds.anonKey) setAnonKey(creds.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Temporarily save to test
    if (url && anonKey) {
      saveCustomSupabaseCredentials(url, anonKey);
    }

    try {
      const res = await SupabaseDatabase.testConnection();
      setTestResult(res);
      if (res.connected) {
        toast('Connected to Supabase PostgreSQL!', { type: 'success' });
        if (onUpdate) onUpdate();
      } else {
        toast('Connection failed: ' + res.message, { type: 'warning' });
      }
    } catch (err: any) {
      setTestResult({ connected: false, message: err?.message || 'Connection error' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!url || !anonKey) {
      toast('Please enter both Supabase URL and Anon Key.', { type: 'warning' });
      return;
    }
    saveCustomSupabaseCredentials(url, anonKey);
    toast('Supabase credentials saved!', {
      description: 'Your browser will now read and write directly to Supabase cloud.',
      type: 'success',
    });
    if (onUpdate) onUpdate();
    onClose();
  };

  const handleClear = () => {
    clearCustomSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    toast('Reset to default local mock layer', { type: 'info' });
    if (onUpdate) onUpdate();
  };

  const handleCopySchema = async () => {
    try {
      const res = await fetch('/api/schema-download');
      let sqlText = '';
      if (res.ok) {
        sqlText = await res.text();
      } else {
        // Fallback schema snippet
        sqlText = `-- GreenCampus Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floors TEXT NOT NULL,
  student_count INT NOT NULL DEFAULT 0,
  faculty_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.labs (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES public.departments(id),
  name TEXT NOT NULL,
  room TEXT NOT NULL,
  pc_count INT NOT NULL DEFAULT 0,
  monthly_target_kwh NUMERIC NOT NULL DEFAULT 2000,
  current_monthly_kwh NUMERIC NOT NULL DEFAULT 2000
);

CREATE TABLE IF NOT EXISTS public.meter_readings (
  id TEXT PRIMARY KEY DEFAULT ('reading-' || uuid_generate_v4()),
  lab_id TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
  kwh NUMERIC NOT NULL,
  reported_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ewaste_donations (
  id TEXT PRIMARY KEY DEFAULT ('donation-' || uuid_generate_v4()),
  donor_name TEXT NOT NULL,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  item_description TEXT NOT NULL,
  quantity INT NOT NULL,
  estimated_weight_kg NUMERIC NOT NULL,
  condition TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  bin_location_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.footprint_records (
  id TEXT PRIMARY KEY DEFAULT ('footprint-' || uuid_generate_v4()),
  student_name TEXT NOT NULL,
  department TEXT NOT NULL,
  inputs JSONB NOT NULL,
  result JSONB NOT NULL,
  grand_total_co2_kg NUMERIC NOT NULL,
  total_annual_kwh NUMERIC NOT NULL,
  greener_score INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ewaste_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footprint_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.labs FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.meter_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.meter_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.ewaste_donations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.ewaste_donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.footprint_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.footprint_records FOR INSERT WITH CHECK (true);
`;
      }
      navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      toast('Full Supabase SQL Schema copied to clipboard!', { type: 'success' });
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      toast('Failed to copy schema to clipboard.', { type: 'warning' });
    }
  };

  const handleSyncData = async () => {
    try {
      setSyncing(true);
      const res = await SupabaseDatabase.syncLocalToSupabase();
      toast('Data synchronized with Supabase!', {
        description: `Uploaded ${res.syncedFootprints} footprints, ${res.syncedReadings} readings, ${res.syncedDonations} donations.`,
        type: 'success',
      });
    } catch (err: any) {
      toast('Sync failed: ' + err?.message, { type: 'warning' });
    } finally {
      setSyncing(false);
    }
  };

  const projectId =
    url && url.includes('.supabase.co')
      ? url.replace(/^https?:\/\//, '').split('.')[0]
      : 'hmmrsmauexvmkuzpsvhh';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 space-y-6 bg-white dark:bg-[#071811] text-neutral-900 dark:text-white border border-emerald-500/30 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">Supabase Cloud Integration</h3>
                  <p className="text-xs text-neutral-500">
                    Connect GreenCampus to your Supabase PostgreSQL database
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Setup Walkthrough */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Quick Supabase Setup Instructions:</span>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>
                  Open your{' '}
                  <a
                    href={`https://supabase.com/dashboard/project/${projectId}/sql`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5"
                  >
                    Supabase SQL Editor ({projectId}) <ExternalLink className="w-3 h-3" />
                  </a>
                  , click <strong>&quot;Copy Schema SQL&quot;</strong> below, paste it into the editor, and press <strong>RUN</strong>.
                </li>
                <li>
                  Copy your <strong>anon public key</strong> from{' '}
                  <a
                    href={`https://supabase.com/dashboard/project/${projectId}/settings/api`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5"
                  >
                    Project Settings → API <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and paste it below.
                </li>
                <li>
                  Click <strong>&quot;Test Connection&quot;</strong> and <strong>&quot;Save Credentials&quot;</strong>.
                </li>
              </ol>
            </div>

            {/* Copy SQL Schema Button */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  Database Migration Script (supabase/schema.sql)
                </div>
                <div className="text-[11px] text-neutral-500">
                  Creates all 8 tables, indexes, RLS policies &amp; initial departments seed.
                </div>
              </div>
              <button
                onClick={handleCopySchema}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy Schema SQL'}</span>
              </button>
            </div>

            {/* Credentials Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-500" />
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#040E0A] text-xs font-mono"
                />
              </div>
            </div>

            {/* Test Connection Output */}
            {testResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${
                  testResult.connected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                }`}
              >
                {testResult.connected ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 dark:border-white/10 text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>

                {isSupabaseConfigured() && (
                  <button
                    type="button"
                    onClick={handleSyncData}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  >
                    <span>{syncing ? 'Syncing...' : 'Sync Local Data'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-xs text-neutral-500 hover:text-rose-500 transition-colors"
                >
                  Reset / Clear
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save &amp; Connect
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
