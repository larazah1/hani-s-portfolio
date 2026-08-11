// Canonical list of homepage/page "section" types. Shared by the DB schema
// (as a Postgres enum), the admin section-builder UI, and the public-site
// section renderer registry — the single source of truth for what a section
// is allowed to be. Adding a new type means: add it here, add a DB migration
// to extend the enum, add a config Zod schema, and add a renderer component.
export const SECTION_TYPES = [
  "hero",
  "summary",
  "stats-row",
  "career-timeline",
  "expertise-grid",
  "education-grid",
  "experience-timeline",
  "memberships-list",
  "list-block",
  "publications-carousel",
  "media-carousel",
  "recommendations-grid",
  "publications-full-list",
  "media-full-grid",
  "rich-text",
  "contact-block",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  summary: "Professional Summary",
  "stats-row": "Statistics Row",
  "career-timeline": "Career Timeline",
  "expertise-grid": "Expertise Grid",
  "education-grid": "Education Grid",
  "experience-timeline": "Experience Timeline",
  "memberships-list": "Memberships List",
  "list-block": "List (Specialties / Activities / Languages / Interests)",
  "publications-carousel": "Publications Carousel",
  "media-carousel": "Media Carousel",
  "recommendations-grid": "Recommendations Grid",
  "publications-full-list": "Full Publications List (with filters)",
  "media-full-grid": "Full Media Grid",
  "rich-text": "Rich Text Block",
  "contact-block": "Contact Form & Info",
};

/** Section types that make sense to add to an arbitrary/custom page, as
 * opposed to ones tightly bound to a specific core page's original layout
 * (e.g. `contact-block` on a non-contact page would have nothing to submit
 * to). Used to keep the "Add Section" picker sane for new pages. */
export const GENERAL_PURPOSE_SECTION_TYPES: SectionType[] = [
  "summary",
  "stats-row",
  "expertise-grid",
  "list-block",
  "publications-carousel",
  "media-carousel",
  "recommendations-grid",
  "rich-text",
];
