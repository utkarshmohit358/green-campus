import { NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function GET() {
  const configured = isSupabaseServerConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      status: 'fallback',
      message: 'Running in Local Fallback mode. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable Supabase Cloud.',
    });
  }

  const client = getSupabaseServerClient();
  if (!client) {
    return NextResponse.json({
      configured: false,
      status: 'error',
      message: 'Supabase client could not be instantiated.',
    });
  }

  const start = performance.now();
  try {
    const { error } = await client.from('departments').select('id', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return NextResponse.json({
        configured: true,
        status: 'schema_needed',
        latencyMs,
        message: `Connected to Supabase project, but query returned: ${error.message}. Please execute supabase/schema.sql in your Supabase SQL Editor.`,
      });
    }

    return NextResponse.json({
      configured: true,
      status: 'connected',
      latencyMs,
      message: 'Successfully connected to Supabase PostgreSQL database.',
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      status: 'unreachable',
      message: err?.message || 'Failed to communicate with Supabase endpoint.',
    });
  }
}
