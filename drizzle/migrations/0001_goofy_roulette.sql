ALTER TYPE "public"."section_type" ADD VALUE 'recommendation-form';--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "submitted_by_public" boolean DEFAULT false NOT NULL;