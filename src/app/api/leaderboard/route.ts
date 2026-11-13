import { NextResponse } from 'next/server';
import leaderboardData from '@/data/leaderboard.json';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: leaderboardData,
  });
}
