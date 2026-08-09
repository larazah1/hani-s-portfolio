// Central content source for the public site.
// Every field here will become editable from the admin panel (CMS) later.

export const profile = {
  name: "Dr. Hani Mahmoud Zahran",
  title: "Professor of Applied Geophysics & Seismology",
  tagline:
    "Research and advisory work spanning seismic hazard assessment, volcanology, disaster risk reduction and mineral exploration.",
  location: "Saudi Arabia",
  email: "contact@example.com",
  phone: "",
  primaryCta: { label: "View Publications", to: "/publications" },
  secondaryCta: { label: "About Dr. Zahran", to: "/about" },
};

export const summary = [
  "This professional summary is placeholder text. Replace it with Dr. Zahran's own introduction covering his research focus, leadership roles and contribution to national seismic monitoring and hazard programs.",
  "A second paragraph can describe advisory roles, international collaboration and current research interests.",
];

export type Stat = { label: string; value: string };
export const stats: Stat[] = [
  { label: "Years of Experience", value: "—" },
  { label: "Publications", value: "—" },
  { label: "Citations", value: "—" },
  { label: "H-Index", value: "—" },
  { label: "Scientific Books", value: "—" },
];

export type CareerEntry = {
  position: string;
  organization: string;
  start: string;
  end: string;
  description?: string;
};
export const career: CareerEntry[] = [];

export const expertise: string[] = [
  "Applied Geophysics",
  "Seismology",
  "Seismic Hazard Assessment",
  "Disaster Risk Reduction",
  "Volcanology",
  "Mineral Exploration",
  "Geothermal Prospecting",
];

export type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: "Journal Article" | "Scientific Book" | "Conference Paper" | "Report" | "Other";
  area: string;
  doi?: string;
  url?: string;
  summary?: string;
  featured?: boolean;
};
export const publications: Publication[] = [];

export type MediaItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  type: "Interview" | "Article" | "Video" | "News Feature" | "Other";
  description?: string;
  videoUrl?: string;
  articleUrl?: string;
  featured?: boolean;
};
export const media: MediaItem[] = [];

export type Recommendation = {
  id: string;
  name: string;
  position: string;
  organization: string;
  text: string;
  date?: string;
  featured?: boolean;
};
export const recommendations: Recommendation[] = [];

export type EducationEntry = {
  degree: string;
  field: string;
  university: string;
  location: string;
  year: string;
  description?: string;
};
export const education: EducationEntry[] = [];

export const researchSpecialties: string[] = [];
export const memberships: { organization: string; position: string; period: string }[] = [];
export const activities: string[] = [];
export const languages: string[] = [];
export const interests: string[] = [];

export const socialLinks: { label: string; url: string }[] = [];

export const biography: string[] = [
  "Placeholder biography. Paste Dr. Zahran's full biography here and it will render across the About page.",
];