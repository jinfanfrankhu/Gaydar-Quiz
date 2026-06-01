import { pgTable, serial, text, integer, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const files = pgTable('files', {
  fileId:      text('file_id').primaryKey(),   // e.g. "Aaron_Paul_Ingham"
  trueScore:   integer('true_score'),           // self-reported Kinsey 1-5
  ratingCount: integer('rating_count').default(0).notNull(),
});

export const ratings = pgTable('ratings', {
  id:         serial('id').primaryKey(),
  sessionId:  text('session_id'),               // UUID generated on landing page; nullable for old rows
  fileId:     text('file_id').notNull(),
  birthYear:  integer('birth_year').notNull(),
  nativeEng:  boolean('native_eng').notNull(),
  isProlific: boolean('is_prolific'),            // NULL = pre-Prolific launch (unknown), false = organic, true = Prolific
  rating:     integer('rating').notNull(),       // 1-5
  createdAt:  timestamp('created_at').defaultNow(),
}, (t) => [
  index('ratings_file_id_idx').on(t.fileId),
  uniqueIndex('ratings_session_file_idx').on(t.sessionId, t.fileId),
]);
