import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { SECTION_TYPES } from "@/lib/section-types";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const adminStatusEnum = pgEnum("admin_status", ["pending", "active", "disabled"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);
export const publicationTypeEnum = pgEnum("publication_type", [
  "Journal Article",
  "Scientific Book",
  "Conference Paper",
  "Report",
  "Other",
]);
export const mediaTypeEnum = pgEnum("media_type", [
  "Interview",
  "Article",
  "Video",
  "News Feature",
  "Other",
]);
export const messageStatusEnum = pgEnum("message_status", ["unread", "read"]);
export const sectionTypeEnum = pgEnum("section_type", SECTION_TYPES);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const admins = pgTable(
  "admins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash"),
    status: adminStatusEnum("status").notNull().default("pending"),
    setupTokenHash: text("setup_token_hash"),
    setupTokenExpiresAt: timestamp("setup_token_expires_at", { withTimezone: true }),
    failedAttempts: integer("failed_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    invitedBy: uuid("invited_by"),
    ...timestamps,
  },
  (t) => [uniqueIndex("admins_email_idx").on(t.email)],
);

// ---------------------------------------------------------------------------
// Profile (singleton) & site-wide settings (singleton)
// ---------------------------------------------------------------------------

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  credentials: text("credentials").notNull(),
  credentialsAr: text("credentials_ar").notNull(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  tagline: text("tagline").notNull(),
  taglineAr: text("tagline_ar").notNull(),
  location: text("location").notNull(),
  locationAr: text("location_ar").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  primaryCtaLabel: text("primary_cta_label").notNull(),
  primaryCtaLabelAr: text("primary_cta_label_ar").notNull(),
  primaryCtaTo: text("primary_cta_to").notNull(),
  secondaryCtaLabel: text("secondary_cta_label").notNull(),
  secondaryCtaLabelAr: text("secondary_cta_label_ar").notNull(),
  secondaryCtaTo: text("secondary_cta_to").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  siteName: text("site_name").notNull(),
  siteNameAr: text("site_name_ar").notNull(),
  siteDescription: text("site_description").notNull(),
  siteDescriptionAr: text("site_description_ar").notNull(),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  defaultMetaTitle: text("default_meta_title").notNull(),
  defaultMetaTitleAr: text("default_meta_title_ar").notNull(),
  defaultMetaDescription: text("default_meta_description").notNull(),
  defaultMetaDescriptionAr: text("default_meta_description_ar").notNull(),
  ogImageUrl: text("og_image_url"),
  footerDescription: text("footer_description").notNull(),
  footerDescriptionAr: text("footer_description_ar").notNull(),
  copyrightText: text("copyright_text").notNull(),
  copyrightTextAr: text("copyright_text_ar").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Simple ordered collections (generic-CRUD-factory candidates)
// ---------------------------------------------------------------------------

const orderedCollection = {
  id: uuid("id").primaryKey().defaultRandom(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
};

export const stats = pgTable("stats", {
  ...orderedCollection,
  label: text("label").notNull(),
  labelAr: text("label_ar").notNull(),
  value: text("value").notNull(),
});

export const careerEntries = pgTable("career_entries", {
  ...orderedCollection,
  position: text("position").notNull(),
  positionAr: text("position_ar").notNull(),
  organization: text("organization").notNull(),
  organizationAr: text("organization_ar").notNull(),
  startLabel: text("start_label").notNull(),
  endLabel: text("end_label").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
});

export const collaborations = pgTable("collaborations", {
  ...orderedCollection,
  position: text("position").notNull(),
  positionAr: text("position_ar").notNull(),
  organization: text("organization").notNull(),
  organizationAr: text("organization_ar").notNull(),
  startLabel: text("start_label").notNull(),
  endLabel: text("end_label").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
});

export const expertiseItems = pgTable("expertise_items", {
  ...orderedCollection,
  en: text("en").notNull(),
  ar: text("ar").notNull(),
});

export const educationEntries = pgTable("education_entries", {
  ...orderedCollection,
  degree: text("degree").notNull(),
  degreeAr: text("degree_ar").notNull(),
  field: text("field").notNull(),
  fieldAr: text("field_ar").notNull(),
  university: text("university").notNull(),
  universityAr: text("university_ar").notNull(),
  location: text("location").notNull(),
  locationAr: text("location_ar").notNull(),
  year: text("year").notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
});

export const researchSpecialties = pgTable("research_specialties", {
  ...orderedCollection,
  en: text("en").notNull(),
  ar: text("ar").notNull(),
});

export const memberships = pgTable("memberships", {
  ...orderedCollection,
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  period: text("period"),
  description: text("description"),
  descriptionAr: text("description_ar"),
});

export const activities = pgTable("activities", {
  ...orderedCollection,
  en: text("en").notNull(),
  ar: text("ar").notNull(),
});

export const languagesList = pgTable("languages_list", {
  ...orderedCollection,
  en: text("en").notNull(),
  ar: text("ar").notNull(),
});

export const interests = pgTable("interests", {
  ...orderedCollection,
  en: text("en").notNull(),
  ar: text("ar").notNull(),
});

export const socialLinks = pgTable("social_links", {
  ...orderedCollection,
  label: text("label").notNull(),
  url: text("url").notNull(),
});

// ---------------------------------------------------------------------------
// Rich collections (hand-written server functions, not the generic factory)
// ---------------------------------------------------------------------------

export const publications = pgTable("publications", {
  ...orderedCollection,
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal").notNull(),
  year: integer("year").notNull(),
  type: publicationTypeEnum("type").notNull(),
  area: text("area").notNull(),
  areaAr: text("area_ar"),
  doi: text("doi"),
  url: text("url"),
  summary: text("summary"),
  featured: boolean("featured").notNull().default(false),
  status: contentStatusEnum("status").notNull().default("draft"),
});

export const mediaItems = pgTable("media_items", {
  ...orderedCollection,
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  source: text("source").notNull(),
  dateLabel: text("date_label").notNull(),
  type: mediaTypeEnum("type").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  articleUrl: text("article_url"),
  thumbnail: text("thumbnail"),
  featured: boolean("featured").notNull().default(false),
  status: contentStatusEnum("status").notNull().default("draft"),
});

export const recommendations = pgTable("recommendations", {
  ...orderedCollection,
  name: text("name").notNull(),
  position: text("position").notNull(),
  organization: text("organization").notNull().default(""),
  body: text("body").notNull(),
  dateLabel: text("date_label"),
  featured: boolean("featured").notNull().default(false),
  status: contentStatusEnum("status").notNull().default("draft"),
});

// ---------------------------------------------------------------------------
// Pages & sections
// ---------------------------------------------------------------------------

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    title: text("title").notNull(),
    titleAr: text("title_ar").notNull(),
    navLabel: text("nav_label"),
    navLabelAr: text("nav_label_ar"),
    showInNav: boolean("show_in_nav").notNull().default(true),
    isCore: boolean("is_core").notNull().default(false),
    metaTitle: text("meta_title"),
    metaTitleAr: text("meta_title_ar"),
    metaDescription: text("meta_description"),
    metaDescriptionAr: text("meta_description_ar"),
    status: contentStatusEnum("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("pages_path_idx").on(t.path)],
);

export const sections = pgTable(
  "sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    type: sectionTypeEnum("type").notNull(),
    eyebrow: text("eyebrow"),
    eyebrowAr: text("eyebrow_ar"),
    title: text("title"),
    titleAr: text("title_ar"),

    // config shape varies per section type (see src/lib/section-types.ts);
    // typed loosely here so it round-trips through server functions without
    // tripping their "may not be serializable" check on a bare `unknown`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: jsonb("config").notNull().default({}).$type<Record<string, any>>(),
    visible: boolean("visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("sections_page_id_idx").on(t.pageId)],
);

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: messageStatusEnum("status").notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Dashboard support: activity log & page views
// ---------------------------------------------------------------------------

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => admins.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pageViewCounts = pgTable("page_view_counts", {
  path: text("path").primaryKey(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
