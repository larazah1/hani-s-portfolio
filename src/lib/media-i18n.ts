// Media `type` is a small fixed enum (see src/db/schema.ts mediaTypeEnum),
// translated via this static map for the admin UI, same pattern as
// publication-i18n.ts.
export const mediaTypeAr: Record<string, string> = {
  Interview: "لقاء",
  Article: "مقال",
  Video: "فيديو",
  "News Feature": "تقرير إخباري",
  Other: "أخرى",
};
