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
  hero: "الترويسة الرئيسية",
  summary: "الملخص المهني",
  "stats-row": "صف الإحصائيات",
  "career-timeline": "الجدول الزمني للمسيرة المهنية",
  "expertise-grid": "شبكة مجالات الخبرة",
  "education-grid": "شبكة التعليم",
  "experience-timeline": "الجدول الزمني للخبرات",
  "memberships-list": "قائمة العضويات",
  "list-block": "قائمة (تخصصات / أنشطة / لغات / اهتمامات)",
  "publications-carousel": "عرض شرائح المنشورات",
  "media-carousel": "عرض شرائح الوسائط",
  "recommendations-grid": "شبكة التوصيات",
  "publications-full-list": "القائمة الكاملة للمنشورات (مع الفلاتر)",
  "media-full-grid": "الشبكة الكاملة للوسائط",
  "rich-text": "كتلة نص منسق",
  "contact-block": "نموذج ومعلومات التواصل",
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
