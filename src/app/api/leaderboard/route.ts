import { NextResponse } from 'next/server';
import leaderboardData from '@/data/leaderboard.json';
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function GET() {
  if (isSupabaseServerConfigured()) {
    const client = getSupabaseServerClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('department_rankings')
          .select('*')
          .order('rank', { ascending: true });

        if (!error && data && (data as any[]).length > 0) {
          const formatted = (data as any[]).map((d: any) => ({
            rank: d.rank,
            previousRank: d.previous_rank,
            departmentId: d.department_id,
            departmentName: d.department_name,
            code: d.code,
            greenScore: Number(d.green_score),
            energyReductionPct: Number(d.energy_reduction_pct),
            perStudentFootprintKg: Number(d.per_student_footprint_kg),
            ewasteKgPerCapita: Number(d.ewaste_kg_per_capita),
            participationRatePct: Number(d.participation_rate_pct),
            badges: d.badges,
            sparkline: d.sparkline,
            allTimeScore: Number(d.all_time_score),
            semesterScore: Number(d.semester_score),
            monthScore: Number(d.month_score),
          }));

          return NextResponse.json({
            success: true,
            source: 'supabase',
            data: {
              departmentRankings: formatted,
              studentRankings: leaderboardData.studentRankings,
            },
          });
        }
      } catch {
        // Fallback
      }
    }
  }

  return NextResponse.json({
    success: true,
    source: 'local',
    data: leaderboardData,
  });
}
