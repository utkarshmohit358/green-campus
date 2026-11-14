import { NextResponse } from 'next/server';
import ewasteData from '@/data/ewaste.json';
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function GET() {
  if (isSupabaseServerConfigured()) {
    const client = getSupabaseServerClient();
    if (client) {
      try {
        const { data: categories } = await client.from('ewaste_categories').select('*');
        const { data: bins } = await client.from('ewaste_bins').select('*');
        const { data: donations } = await client.from('ewaste_donations').select('*').order('created_at', { ascending: false }).limit(20);

        if (categories && (categories as any[]).length > 0 && bins && (bins as any[]).length > 0) {
          const totalKg = (categories as any[]).reduce((acc: number, c: any) => acc + Number(c.weight_kg), 0);
          const totalUnits = (categories as any[]).reduce((acc: number, c: any) => acc + Number(c.units), 0);

          return NextResponse.json({
            success: true,
            source: 'supabase',
            data: {
              summary: {
                ...ewasteData.summary,
                totalKgCollected: totalKg || ewasteData.summary.totalKgCollected,
                totalUnitsCollected: totalUnits || ewasteData.summary.totalUnitsCollected,
              },
              categories: (categories as any[]).map((c: any) => ({
                id: c.id,
                name: c.name,
                weightKg: Number(c.weight_kg),
                units: Number(c.units),
                co2AvoidedKg: Number(c.co2_avoided_kg),
                color: c.color,
              })),
              bins: (bins as any[]).map((b: any) => ({
                id: b.id,
                name: b.name,
                building: b.building,
                floor: b.floor,
                fillPct: b.fill_pct,
                capacityKg: Number(b.capacity_kg),
                currentKg: Number(b.current_kg),
                coords: { x: Number(b.coords_x), y: Number(b.coords_y) },
                status: b.status,
                lastEmptied: b.last_emptied,
              })),
              disposalPathways: ewasteData.disposalPathways,
              recoveredMaterials: ewasteData.recoveredMaterials,
              drives: ewasteData.drives,
              recentDonations: donations && (donations as any[]).length > 0
                ? (donations as any[]).map((don: any) => ({
                    id: don.id,
                    donorName: don.donor_name,
                    department: don.department,
                    category: don.category,
                    itemDescription: don.item_description,
                    quantity: don.quantity,
                    weightKg: Number(don.estimated_weight_kg),
                    condition: don.condition,
                    date: don.date,
                    binLocation: don.bin_location_id,
                  }))
                : ewasteData.recentDonations,
            },
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

    if (isSupabaseServerConfigured()) {
      const client = getSupabaseServerClient();
      if (client) {
        await client.from('ewaste_donations').insert({
          id: newDonation.id,
          donor_name: body.donorName,
          donor_email: body.donorEmail || null,
          department: body.department || 'General Campus',
          category: body.category,
          item_description: body.itemDescription || body.category,
          quantity: Number(body.quantity) || 1,
          estimated_weight_kg: Number(body.estimatedWeightKg) || 1.0,
          condition: body.condition || 'working',
          date: body.date || new Date().toISOString().split('T')[0],
          bin_location_id: body.binLocationId || 'bin-1',
        } as any);
      }
    }

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
