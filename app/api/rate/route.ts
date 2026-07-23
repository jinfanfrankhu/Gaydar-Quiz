import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { files, ratings as ratingsTable } from '@/db/schema';

interface RatingInput {
  fileId: string;
  rating: number;
}

interface RequestBody {
  ratings: RatingInput[];
  birthYear: number;
  raterRace: string;
  nativeEng: boolean;
  isProlific: boolean;
  isStraight: boolean;
  sessionId: string;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { ratings: ratingInputs, birthYear, raterRace, nativeEng, isProlific, isStraight, sessionId } = body;

  const fileIds = ratingInputs.map(r => r.fileId);

  // Insert all ratings
  await db.insert(ratingsTable).values(
    ratingInputs.map(r => ({
      sessionId,
      fileId: r.fileId,
      birthYear,
      raterRace,
      nativeEng,
      isProlific,
      isStraight,
      rating: r.rating,
    }))
  );

  // Increment rating_count for each file
  for (const fileId of fileIds) {
    await db
      .update(files)
      .set({ ratingCount: sql`${files.ratingCount} + 1` })
      .where(eq(files.fileId, fileId));
  }

  // Return true scores so the client can calculate the batch score
  const scores = await db
    .select({ fileId: files.fileId, trueScore: files.trueScore })
    .from(files)
    .where(inArray(files.fileId, fileIds));

  return NextResponse.json(scores);
}
