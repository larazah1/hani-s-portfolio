// Media outlets: their names in both languages and their logos.
// The database stores each outlet's name once, in whichever language it was
// entered; `sourceName` shows it in the visitor's language. Unknown names are
// shown as stored.
import type { Language as Locale } from "./language";

type Names = { en: string; ar: string };

const OUTLETS: Names[] = [
  { en: "Ajel", ar: "عاجل" },
  { en: "Akhbaar 24", ar: "أخبار 24" },
  { en: "Al Arabiya", ar: "العربية" },
  { en: "Al Ekhbariya", ar: "قناة الإخبارية" },
  { en: "Al Eqtisadiah", ar: "الاقتصادية" },
  { en: "Al Eqtisadiah TV", ar: "قناة الاقتصادية" },
  { en: "Al Fajer TV", ar: "قناة الفجر" },
  { en: "Al Riyadh", ar: "الرياض" },
  { en: "Al Yaum", ar: "اليوم" },
  { en: "Al-Jazirah", ar: "الجزيرة" },
  { en: "Al-Madina", ar: "المدينة" },
  { en: "Al-Manatiq", ar: "المناطق" },
  { en: "Al-Mowaten", ar: "المواطن" },
  { en: "Al-Wakad", ar: "الوقد" },
  { en: "Alrakoba", ar: "الراكوبة" },
  { en: "Arab News", ar: "عرب نيوز" },
  { en: "Arabian Business", ar: "أريبيان بزنس" },
  { en: "Asharq Al-Awsat", ar: "الشرق الأوسط" },
  { en: "Bawabati", ar: "بوابتي" },
  { en: "CNN Arabic", ar: "سي إن إن بالعربية" },
  { en: "Elaph", ar: "إيلاف" },
  { en: "Garb News", ar: "غرب الإخبارية" },
  { en: "MZ-MZ", ar: "مزمز" },
  { en: "Nabd", ar: "نبض" },
  { en: "Okaz", ar: "عكاظ" },
  { en: "Sabq", ar: "سبق" },
  { en: "Sada", ar: "صحيفة صدى" },
  { en: "Saraya News", ar: "سرايا نيوز" },
  { en: "Saudi Gazette", ar: "سعودي جازيت" },
  { en: "Saudi Press Agency", ar: "وكالة الأنباء السعودية" },
  { en: "Sky News Arabia", ar: "سكاي نيوز عربية" },
  { en: "Wtniaat", ar: "وطنيات" },
  { en: "Sahat Yanbu", ar: "ساحات ينبع" },
  { en: "Saudi Geological Survey", ar: "هيئة المساحة الجيولوجية السعودية" },
];

const byName = new Map<string, Names>();
for (const o of OUTLETS) {
  byName.set(o.en.toLowerCase(), o);
  byName.set(o.ar, o);
}

/** The outlet's name in the visitor's language (as stored if unknown). */
export function sourceName(source: string | null | undefined, locale: Locale): string {
  if (!source) return "";
  const o = byName.get(source.trim()) ?? byName.get(source.trim().toLowerCase());
  return o ? o[locale] : source;
}

/** Logos saved in public/media/logos, named after the site's domain. */
const LOGOS: Record<string, string> = {
  "ajel.sa": "ajel.sa.png",
  "akhbaar24.com": "akhbaar24.com.png",
  "al-jazirah.com": "al-jazirah.com.jpg",
  "al-madina.com": "al-madina.com.png",
  "alarabiya.net": "alarabiya.net.png",
  "alekhbariya.net": "alekhbariya.net.png",
  "aleqt.com": "aleqt.com.png",
  "alfajertv.com": "alfajertv.com.png",
  "alrakoba.net": "alrakoba.net.jpg",
  "alriyadh.com": "alriyadh.com.png",
  "alwakad.net": "alwakad.net.jpg",
  "alyaum.com": "alyaum.com.png",
  "arabic.arabianbusiness.com": "arabic.arabianbusiness.com.png",
  "arabic.cnn.com": "arabic.cnn.com.png",
  "elaph.com": "elaph.com.png",
  "mz-mz.net": "mz-mz.net.png",
  "okaz.com.sa": "okaz.com.sa.png",
  "sabq.org": "sabq.org.png",
  "sarayanews.com": "sarayanews.com.png",
  "saudigazette.com.sa": "saudigazette.com.sa.png",
  "skynewsarabia.com": "skynewsarabia.com.png",
  "slaati.com": "slaati.com.png",
  "spa.gov.sa": "spa.gov.sa.png",
  "wtniaat.com": "wtniaat.com.png",
  "x.com": "x.com.png",
  "twitter.com": "x.com.png",
  "youtube.com": "youtube.com.png",
  "youtu.be": "youtube.com.png",
};

/** Logo of the site a link points to, or null when we don't have one. */
export function logoFor(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const file = LOGOS[host];
    return file ? `/media/logos/${file}` : null;
  } catch {
    return null;
  }
}
