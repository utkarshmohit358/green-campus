import { NextResponse } from 'next/server';
import departmentsData from '@/data/departments.json';

export async function GET() {
  return NextResponse.json({
    success: true,
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
