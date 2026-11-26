ALTER TYPE "public"."section_type" ADD VALUE 'quote' BEFORE 'contact-block';--> statement-breakpoint
ALTER TABLE "career_entries" ADD COLUMN "highlight" boolean DEFAULT false NOT NULL;