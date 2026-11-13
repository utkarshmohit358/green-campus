import { NextResponse } from 'next/server';
import ewasteData from '@/data/ewaste.json';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ewasteData,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.category || !body.donorName || !body.quantity) {
      return NextResponse.json(
        { success: false, error: 'Category, donorName, and quantity are required.' },
        { status: 400 }
      );
    }

    const newDonation = {
      id: `donation-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'E-waste item logged successfully.',
      data: newDonation,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
