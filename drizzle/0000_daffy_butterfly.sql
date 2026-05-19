CREATE TABLE "files" (
	"file_id" text PRIMARY KEY NOT NULL,
	"true_score" integer,
	"rating_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text,
	"file_id" text NOT NULL,
	"birth_year" integer NOT NULL,
	"native_eng" boolean NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "ratings_file_id_idx" ON "ratings" USING btree ("file_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ratings_session_file_idx" ON "ratings" USING btree ("session_id","file_id");