import { NextRequest, NextResponse } from 'next/server';
import { asc, notInArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { files } from '@/db/schema';

export async function GET(req: NextRequest) {
  const seen = req.nextUrl.searchParams.get('seen');
  const seenIds = seen ? seen.split(',').filter(Boolean) : [];

  const batch = await db
    .select({ fileId: files.fileId })
    .from(files)
    .where(seenIds.length > 0 ? notInArray(files.fileId, seenIds) : undefined)
    .orderBy(asc(files.ratingCount), sql`random()`)
    .limit(5);

  return NextResponse.json(batch);
}
