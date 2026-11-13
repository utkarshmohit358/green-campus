import { NextResponse } from 'next/server';
import reportsData from '@/data/reports.json';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: reportsData,
  });
}
