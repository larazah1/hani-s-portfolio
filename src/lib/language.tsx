import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

// useLayoutEffect warns during SSR; fall back to a no-op there since this
// hook is only ever needed to sync state before the client's first paint.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Language = "en" | "ar";

const STORAGE_KEY = "site-lang";

const dictionary = {
  home: { en: "Home", ar: "الرئيسية" },
  aboutMe: { en: "About Me", ar: "نبذة عني" },
  publications: { en: "Publications", ar: "المنشورات" },
  interviewsArticles: { en: "Interviews & Articles", ar: "لقاءات ومقالات" },
  contact: { en: "Contact", ar: "تواصل" },
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  closeMenu: { en: "Close", ar: "إغلاق" },
  switchToArabic: { en: "العربية", ar: "English" },
  languageToggleLabel: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },

  professionalSummary: { en: "Professional Summary", ar: "نبذة مهنية" },
  anOverview: { en: "An overview", ar: "نظرة عامة" },
  currentRole: { en: "Current Role", ar: "المنصب الحالي" },
  career: { en: "Career", ar: "المسيرة المهنية" },
  careerHighlights: { en: "Career highlights", ar: "أبرز محطات المسيرة المهنية" },
  researchCollaboration: { en: "Research Collaboration", ar: "تعاون بحثي" },
  expertise: { en: "Expertise", ar: "مجالات الخبرة" },
  keyExpertise: { en: "Key expertise", ar: "أبرز مجالات الخبرة" },
  selectedResearch: { en: "Selected Research", ar: "أبحاث مختارة" },
  myPublications: { en: "My Publications", ar: "منشوراتي العلمية" },
  publicationsIntro: {
    en: "Selected research and scientific contributions in geophysics, seismology, seismic hazards, and the geology of Saudi Arabia.",
    ar: "أبحاث ومساهمات علمية مختارة في الجيوفيزياء وعلم الزلازل والمخاطر الزلزالية وجيولوجيا المملكة العربية السعودية.",
  },
  exploreAllPublications: { en: "Explore All Publications", ar: "استعراض جميع المنشورات" },
  media: { en: "Media", ar: "الإعلام" },
  interviewsArticlesHeadline: { en: "Interviews & articles", ar: "لقاءات ومقالات" },
  exploreInterviewsArticles: {
    en: "Explore Interviews & Articles",
    ar: "استعراض اللقاءات والمقالات",
  },
  recommendations: { en: "Recommendations", ar: "توصيات" },
  recommendationsHeadline: {
    en: "Recommendations & professional recognition",
    ar: "التوصيات والتقدير المهني",
  },

  about: { en: "About", ar: "نبذة" },
  biography: { en: "Biography", ar: "السيرة الذاتية" },
  education: { en: "Education", ar: "التعليم" },
  academicBackground: { en: "Academic background", ar: "المؤهلات الأكاديمية" },
  experience: { en: "Experience", ar: "الخبرة" },
  professionalExperience: { en: "Professional experience", ar: "الخبرة المهنية" },
  research: { en: "Research", ar: "البحث العلمي" },
  researchSpecialties: { en: "Research specialties", ar: "التخصصات البحثية" },
  affiliations: { en: "Affiliations", ar: "العضويات" },
  membershipsCommittees: { en: "Memberships & committees", ar: "العضويات واللجان" },
  activities: { en: "Activities", ar: "الأنشطة" },
  scientificActivities: { en: "Scientific activities", ar: "الأنشطة العلمية" },
  languages: { en: "Languages", ar: "اللغات" },
  personal: { en: "Personal", ar: "شخصي" },
  interests: { en: "Interests", ar: "الاهتمامات" },

  researchOutput: { en: "Research output", ar: "الإنتاج البحثي" },
  publicationsHeadline: { en: "Publications", ar: "المنشورات" },
  publicationsPageIntro: {
    en: "Research, studies, and scientific contributions spanning geophysics, seismology, seismic hazards, and geological sciences.",
    ar: "أبحاث ودراسات ومساهمات علمية تشمل الجيوفيزياء وعلم الزلازل والمخاطر الزلزالية والعلوم الجيولوجية.",
  },
  searchPublications: { en: "Search publications", ar: "البحث في المنشورات" },
  allYears: { en: "All years", ar: "كل السنوات" },
  allTypes: { en: "All types", ar: "كل الأنواع" },
  allAreas: { en: "All areas", ar: "كل المجالات" },
  noPublicationsMatch: {
    en: "No publications match your filters.",
    ar: "لا توجد منشورات مطابقة لعوامل التصفية المحددة.",
  },
  goToPublication: { en: "Go to Publication", ar: "الانتقال إلى المنشور" },
  linkComingSoon: { en: "Link coming soon", ar: "الرابط قريبًا" },
  doi: { en: "DOI", ar: "المعرف الرقمي DOI" },

  interviewsArticlesIntro: {
    en: "Media appearances, interviews, video features and articles by and about Dr. Hani Mahmoud Zahran.",
    ar: "ظهور إعلامي ولقاءات ومقاطع فيديو ومقالات بقلم الدكتور هاني محمود زهران وعنه.",
  },
  view: { en: "View", ar: "عرض" },
  watchVideo: { en: "Watch Video", ar: "مشاهدة الفيديو" },
  readArticle: { en: "Read Article", ar: "قراءة المقال" },
  video: { en: "Video", ar: "فيديو" },
  interview: { en: "Interview", ar: "لقاء" },
  article: { en: "Article", ar: "مقال" },

  letsConnect: { en: "Let’s Connect", ar: "لنتواصل" },
  contactIntro: {
    en: "For professional inquiries, research collaboration, consulting, media requests, or scientific discussions, feel free to get in touch.",
    ar: "لأي استفسارات مهنية أو تعاون بحثي أو استشارات أو طلبات إعلامية أو نقاشات علمية، يسعدنا تواصلكم.",
  },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  fullNamePlaceholder: { en: "Your name", ar: "اسمك" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailPlaceholder: { en: "Email address", ar: "البريد الإلكتروني" },
  subject: { en: "Subject", ar: "الموضوع" },
  subjectPlaceholder: { en: "Subject", ar: "الموضوع" },
  message: { en: "Message", ar: "الرسالة" },
  messagePlaceholder: { en: "Message", ar: "رسالتك" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  sendMessage: { en: "Send Message", ar: "إرسال الرسالة" },
  sendSuccess: {
    en: "Thank you — your message has been sent successfully.",
    ar: "شكرًا لك — تم إرسال رسالتك بنجاح.",
  },
  sendError: {
    en: "Something went wrong sending your message. Please try again.",
    ar: "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.",
  },
  phone: { en: "Phone", ar: "الهاتف" },
  location: { en: "Location", ar: "الموقع" },
  profiles: { en: "Profiles", ar: "الحسابات" },

  quickLinks: { en: "Quick Links", ar: "روابط سريعة" },
  geophysicistSeismologist: { en: "Geophysicist & Seismologist", ar: "جيوفيزيائي وعالم زلازل" },
  allRightsReserved: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },

  pageNotFound: { en: "Page not found", ar: "الصفحة غير موجودة" },
  pageNotFoundBody: {
    en: "The page you're looking for doesn't exist or has been moved.",
    ar: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  },
  goHome: { en: "Go home", ar: "العودة إلى الرئيسية" },
  didntLoad: { en: "This page didn't load", ar: "تعذر تحميل هذه الصفحة" },
  errorBody: {
    en: "Something went wrong on our end. You can try refreshing or head back home.",
    ar: "حدث خطأ من جانبنا. يمكنك إعادة تحميل الصفحة أو العودة إلى الرئيسية.",
  },
  tryAgain: { en: "Try again", ar: "إعادة المحاولة" },

  yearLabel: { en: "Year", ar: "السنة" },
  present: { en: "Present", ar: "حتى الآن" },

  emptyCareer: {
    en: "Career positions will appear here once added.",
    ar: "ستظهر المناصب المهنية هنا بعد إضافتها.",
  },
  emptyExperience: {
    en: "Experience entries will appear here once added.",
    ar: "ستظهر الخبرات المهنية هنا بعد إضافتها.",
  },
  emptyEducation: {
    en: "Education entries will appear here once added.",
    ar: "ستظهر المؤهلات الأكاديمية هنا بعد إضافتها.",
  },
  emptyResearchSpecialties: {
    en: "Research specialties will appear here once added.",
    ar: "ستظهر التخصصات البحثية هنا بعد إضافتها.",
  },
  emptyMemberships: {
    en: "Memberships will appear here once added.",
    ar: "ستظهر العضويات هنا بعد إضافتها.",
  },
  emptyActivities: {
    en: "Scientific activities will appear here once added.",
    ar: "ستظهر الأنشطة العلمية هنا بعد إضافتها.",
  },
  emptyLanguages: {
    en: "Languages will appear here once added.",
    ar: "ستظهر اللغات هنا بعد إضافتها.",
  },
  emptyInterests: {
    en: "Interests will appear here once added.",
    ar: "ستظهر الاهتمامات هنا بعد إضافتها.",
  },
  emptyFeaturedPublications: {
    en: "Featured publications will appear here once added.",
    ar: "ستظهر المنشورات المميزة هنا بعد إضافتها.",
  },
  emptyFeaturedMedia: {
    en: "Featured interviews and articles will appear here once added.",
    ar: "ستظهر اللقاءات والمقالات المميزة هنا بعد إضافتها.",
  },
  emptyRecommendations: {
    en: "Recommendations will appear here once added.",
    ar: "ستظهر التوصيات هنا بعد إضافتها.",
  },
  emptyInterviews: {
    en: "Interviews and articles will appear here once added.",
    ar: "ستظهر اللقاءات والمقالات هنا بعد إضافتها.",
  },

  journalArticles: { en: "Journal Articles", ar: "المقالات العلمية" },
  scientificBooks: { en: "Scientific Books", ar: "الكتب العلمية" },
  reportsOther: { en: "Reports & Other", ar: "التقارير وغيرها" },
} as const;

export type DictionaryKey = keyof typeof dictionary;

type LanguageContextValue = {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: DictionaryKey) => string;
  pick: (en: string, ar?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" ? "ar" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start in English so the first client render matches the
  // server-rendered HTML; the stored preference (if any) is applied in a
  // layout effect below, before the browser paints, to avoid a hydration
  // mismatch while still avoiding a visible flash.
  const [language, setLanguageState] = useState<Language>("en");

  useIsomorphicLayoutEffect(() => {
    const stored = readStoredLanguage();
    if (stored !== "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback((key: DictionaryKey) => dictionary[key][language], [language]);

  const pick = useCallback(
    (en: string, ar?: string) => (language === "ar" ? (ar ?? en) : en),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir: language === "ar" ? "rtl" : "ltr",
      setLanguage,
      toggleLanguage,
      t,
      pick,
    }),
    [language, setLanguage, toggleLanguage, t, pick],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
