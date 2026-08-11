CREATE TYPE "public"."admin_status" AS ENUM('pending', 'active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('Interview', 'Article', 'Video', 'News Feature', 'Other');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('unread', 'read');--> statement-breakpoint
CREATE TYPE "public"."publication_type" AS ENUM('Journal Article', 'Scientific Book', 'Conference Paper', 'Report', 'Other');--> statement-breakpoint
CREATE TYPE "public"."section_type" AS ENUM('hero', 'summary', 'stats-row', 'career-timeline', 'expertise-grid', 'education-grid', 'experience-timeline', 'memberships-list', 'list-block', 'publications-carousel', 'media-carousel', 'recommendations-grid', 'publications-full-list', 'media-full-grid', 'rich-text', 'contact-block');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"en" text NOT NULL,
	"ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"status" "admin_status" DEFAULT 'pending' NOT NULL,
	"setup_token_hash" text,
	"setup_token_expires_at" timestamp with time zone,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"invited_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"position" text NOT NULL,
	"position_ar" text NOT NULL,
	"organization" text NOT NULL,
	"organization_ar" text NOT NULL,
	"start_label" text NOT NULL,
	"end_label" text NOT NULL,
	"description" text,
	"description_ar" text
);
--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"position" text NOT NULL,
	"position_ar" text NOT NULL,
	"organization" text NOT NULL,
	"organization_ar" text NOT NULL,
	"start_label" text NOT NULL,
	"end_label" text NOT NULL,
	"description" text,
	"description_ar" text
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "message_status" DEFAULT 'unread' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"degree" text NOT NULL,
	"degree_ar" text NOT NULL,
	"field" text NOT NULL,
	"field_ar" text NOT NULL,
	"university" text NOT NULL,
	"university_ar" text NOT NULL,
	"location" text NOT NULL,
	"location_ar" text NOT NULL,
	"year" text NOT NULL,
	"description" text,
	"description_ar" text
);
--> statement-breakpoint
CREATE TABLE "expertise_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"en" text NOT NULL,
	"ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"en" text NOT NULL,
	"ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"en" text NOT NULL,
	"ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"title_ar" text,
	"source" text NOT NULL,
	"date_label" text NOT NULL,
	"type" "media_type" NOT NULL,
	"description" text,
	"video_url" text,
	"article_url" text,
	"thumbnail" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"period" text,
	"description" text,
	"description_ar" text
);
--> statement-breakpoint
CREATE TABLE "page_view_counts" (
	"path" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"nav_label" text,
	"nav_label_ar" text,
	"show_in_nav" boolean DEFAULT true NOT NULL,
	"is_core" boolean DEFAULT false NOT NULL,
	"meta_title" text,
	"meta_title_ar" text,
	"meta_description" text,
	"meta_description_ar" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"credentials" text NOT NULL,
	"credentials_ar" text NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"tagline" text NOT NULL,
	"tagline_ar" text NOT NULL,
	"location" text NOT NULL,
	"location_ar" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"primary_cta_label" text NOT NULL,
	"primary_cta_label_ar" text NOT NULL,
	"primary_cta_to" text NOT NULL,
	"secondary_cta_label" text NOT NULL,
	"secondary_cta_label_ar" text NOT NULL,
	"secondary_cta_to" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"authors" text NOT NULL,
	"journal" text NOT NULL,
	"year" integer NOT NULL,
	"type" "publication_type" NOT NULL,
	"area" text NOT NULL,
	"area_ar" text,
	"doi" text,
	"url" text,
	"summary" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"organization" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"date_label" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_specialties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"en" text NOT NULL,
	"ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"type" "section_type" NOT NULL,
	"eyebrow" text,
	"eyebrow_ar" text,
	"title" text,
	"title_ar" text,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_name" text NOT NULL,
	"site_name_ar" text NOT NULL,
	"site_description" text NOT NULL,
	"site_description_ar" text NOT NULL,
	"logo_url" text,
	"favicon_url" text,
	"default_meta_title" text NOT NULL,
	"default_meta_title_ar" text NOT NULL,
	"default_meta_description" text NOT NULL,
	"default_meta_description_ar" text NOT NULL,
	"og_image_url" text,
	"footer_description" text NOT NULL,
	"footer_description_ar" text NOT NULL,
	"copyright_text" text NOT NULL,
	"copyright_text_ar" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"label" text NOT NULL,
	"label_ar" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");--> statement-breakpoint
CREATE INDEX "sections_page_id_idx" ON "sections" USING btree ("page_id");