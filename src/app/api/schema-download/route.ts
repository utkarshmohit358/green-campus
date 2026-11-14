import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      return new NextResponse(sql, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
  } catch {
    // fallback
  }

  return new NextResponse('-- Schema not found', { status: 404 });
}
