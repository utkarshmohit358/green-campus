import { NextResponse } from 'next/server';
import departmentsData from '@/data/departments.json';
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function GET() {
  if (isSupabaseServerConfigured()) {
    const client = getSupabaseServerClient();
    if (client) {
      try {
        const { data: depts, error: deptsError } = await client.from('departments').select('*');
        const { data: labs, error: labsError } = await client.from('labs').select('*');

        if (!deptsError && !labsError && depts && (depts as any[]).length > 0) {
          const formatted = (depts as any[]).map((d: any) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            building: d.building,
            floors: d.floors,
            studentCount: d.student_count,
            facultyCount: d.faculty_count,
            labs: (((labs as any[]) || []))
              .filter((l: any) => l.department_id === d.id)
              .map((l: any) => ({
                id: l.id,
                name: l.name,
                room: l.room,
                pcCount: l.pc_count,
                hasGpus: l.has_gpus,
                hoursOpenPerDay: l.hours_open_per_day,
                monthlyTargetKWh: Number(l.monthly_target_kwh),
                currentMonthlyKWh: Number(l.current_monthly_kwh),
                anomalyAlert: l.anomaly_alert,
              })),
            monthlyHistory: departmentsData.departments.find((localD) => localD.id === d.id)?.monthlyHistory || [],
          }));

          return NextResponse.json({
            success: true,
            source: 'supabase',
            data: { departments: formatted, heatmapSchedule: departmentsData.heatmapSchedule },
          });
        }
      } catch {
        // Fallback to local JSON
      }
    }
  }

  return NextResponse.json({
    success: true,
    source: 'local',
    data: departmentsData,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.labId || !body.kwh || body.kwh <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid meter reading payload. labId and positive kwh required.' },
        { status: 400 }
      );
    }

    const newReading = {
      id: `reading-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseServerConfigured()) {
      const client = getSupabaseServerClient();
      if (client) {
        await client.from('meter_readings').insert({
          id: newReading.id,
          lab_id: body.labId,
          lab_name: body.labName || body.labId,
          department_id: body.departmentId || 'cse',
          reading_date: body.date || new Date().toISOString().split('T')[0],
          kwh: Number(body.kwh),
          reported_by: body.reportedBy || 'Staff User',
          notes: body.notes || null,
        } as any);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Meter reading logged successfully.',
      data: newReading,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
