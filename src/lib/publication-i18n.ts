// Publication `type` is a small fixed enum (see src/db/schema.ts
// publicationTypeEnum) — translated via this static map rather than a
// per-row DB column, since new values need a schema/admin-form change
// anyway. `area` is free text and gets its own areaAr column per row
// instead, since admins can introduce whole new research areas.
export const publicationTypeAr: Record<string, string> = {
  "Journal Article": "مقال علمي",
  "Scientific Book": "كتاب علمي",
  "Conference Paper": "ورقة مؤتمر",
  Report: "تقرير",
  Other: "أخرى",
};
