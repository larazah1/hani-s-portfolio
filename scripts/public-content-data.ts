// Content imported from the public site repo (../zahran-portal/scripts/seed-data.ts)
// that wasn't already in src/content/site.ts. Matched on title, and also on
// URL/DOI so items that differ only in title wording aren't duplicated.
// Used by scripts/seed-content.ts (fresh DB) and scripts/import-public-content.ts
// (idempotent, safe on a live DB).

import type * as schema from "../src/db/schema";

type NewPublication = Omit<typeof schema.publications.$inferInsert, "id" | "sortOrder" | "status">;
type NewMediaItem = Omit<typeof schema.mediaItems.$inferInsert, "id" | "sortOrder" | "status">;

export const importedPublications: NewPublication[] = [
  {
    title:
      "Gamma-ray exposure maps from airborne spectrometric data (Open-File Report SGS-OF-2006-9)",
    titleAr:
      "Gamma-ray exposure maps from airborne spectrometric data (Open-File Report SGS-OF-2006-9)",
    authors: "Zahran H.M., Stewart I.C.F.",
    journal: "Saudi Geological Survey",
    year: 2006,
    type: "Report",
    area: "Geophysics",
    areaAr: "الجيوفيزياء",
    doi: null,
    url: null,
    summary: null,
    featured: false,
  },
  {
    title:
      "Detailed mineral exploration studies in the Shatban prospect, western Saudi Arabia (Master's thesis)",
    titleAr:
      "Detailed mineral exploration studies in the Shatban prospect, western Saudi Arabia (Master's thesis)",
    authors: "Zahran H.M., Sadek H.S.",
    journal: "King Abdulaziz University",
    year: 1999,
    type: "Other",
    area: "Mineral Exploration",
    areaAr: "التنقيب عن المعادن",
    doi: null,
    url: null,
    summary: null,
    featured: false,
  },
];

export const importedMedia: NewMediaItem[] = [
  {
    title:
      "مدير إدارة الأزمات والكوارث في هيئة المساحة الجيولوجية السعودية الدكتور هاني زهران: رصدنا هزة أرضية شمال شرقي حائل وإحساسها ضعيف ولا أضرار فيها #برنامج_120",
    titleAr:
      "مدير إدارة الأزمات والكوارث في هيئة المساحة الجيولوجية السعودية الدكتور هاني زهران: رصدنا هزة أرضية شمال شرقي حائل وإحساسها ضعيف ولا أضرار فيها #برنامج_120",
    source: "Nabd",
    dateLabel: "2024-07-28",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://nabd.com/s/139256313-2d1d86/%D9%81%D9%8A%D8%AF%D9%8A%D9%88-%D9%85%D8%AF%D9%8A%D8%B1-%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%A3%D8%B2%D9%85%D8%A7%D8%AA-%D9%88%D8%A7%D9%84%D9%83%D9%88%D8%A7%D8%B1%D8%AB-%D9%81%D9%8A-%D9%87%D9%8A%D8%A6%D8%A9-%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%AD%D8%A9-%D8%A7%D9%84%D8%AC%D9%8A%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A9-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1-%D9%87%D8%A7%D9%86%D9%8A-%D8%B2%D9%87%D8%B1%D8%A7%D9%86-%D8%B1%D8%B5%D8%AF%D9%86%D8%A7-%D9%87%D8%B2%D8%A9-%D8%A3%D8%B1%D8%B6%D9%8A%D8%A9-%D8%B4%D9%85%D8%A7%D9%84-%D8%B4%D8%B1%D9%82%D9%8A-%D8%AD%D8%A7%D8%A6%D9%84-%D9%88%D8%A5%D8%AD%D8%B3%D8%A7%D8%B3%D9%87%D8%A7-%D8%B6%D8%B9%D9%8A%D9%81-%D9%88%D9%84%D8%A7-%D8%A3%D8%B6%D8%B1%D8%A7%D8%B1-%D9%81%D9%8A%D9%87%D8%A7",
    thumbnail: null,
    featured: true,
  },
  {
    title: "“المساحة الجيولوجية”: دول الخليج العربي بعيدة عن نشاط الزلازل المدمرة",
    titleAr: "“المساحة الجيولوجية”: دول الخليج العربي بعيدة عن نشاط الزلازل المدمرة",
    source: "Al-Manatiq",
    dateLabel: "2023-03-06",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://almnatiq.net/%d8%a7%d9%84%d9%85%d8%b3%d8%a7%d8%ad%d8%a9-%d8%a7%d9%84%d8%ac%d9%8a%d9%88%d9%84%d9%88%d8%ac%d9%8a%d8%a9-%d8%af%d9%88%d9%84-%d8%a7%d9%84%d8%ae%d9%84%d9%8a%d8%ac-%d8%a7%d9%84%d8%b9%d8%b1%d8%a8/",
    thumbnail: null,
    featured: false,
  },
  {
    title: "هذه أسباب الهزات الأرضية بشرق أملج",
    titleAr: "هذه أسباب الهزات الأرضية بشرق أملج",
    source: "Al Yaum",
    dateLabel: "2018-11-12",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://www.alyaum.com/articles/6061997/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9-%D8%A7%D9%84%D9%8A%D9%88%D9%85/%D9%87%D8%B0%D9%87-%D8%A3%D8%B3%D8%A8%D8%A7%D8%A8-%D8%A7%D9%84%D9%87%D8%B2%D8%A7%D8%AA-%D8%A7%D9%84%D8%A3%D8%B1%D8%B6%D9%8A%D8%A9-%D8%A8%D8%B4%D8%B1%D9%82-%D8%A3%D9%85%D9%84%D8%AC",
    thumbnail: null,
    featured: false,
  },
  {
    title: '"مركز رصد الزلازل": 9 هزات أرضية في أملج خلال أسبوعين.. ويرجح استمرارها',
    titleAr: '"مركز رصد الزلازل": 9 هزات أرضية في أملج خلال أسبوعين.. ويرجح استمرارها',
    source: "Akhbaar 24",
    dateLabel: "2018-10-25",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://www.akhbaar24.com/article/detail/413941",
    thumbnail: null,
    featured: false,
  },
  {
    title:
      "مراجعة وتحديث خرائط المخاطر الزلزالية في كود البناء السعودي احتمالية تعرض حرة الشاقة لهزات أرضية",
    titleAr:
      "مراجعة وتحديث خرائط المخاطر الزلزالية في كود البناء السعودي احتمالية تعرض حرة الشاقة لهزات أرضية",
    source: "Al-Wakad",
    dateLabel: "2018-02-11",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://www.alwakad.net/1930800.html",
    thumbnail: null,
    featured: false,
  },
  {
    title: "زهران: 10 دول بجانب السعودية تشارك في المؤتمر الجيولوجي الـ 12",
    titleAr: "زهران: 10 دول بجانب السعودية تشارك في المؤتمر الجيولوجي الـ 12",
    source: "Sabq",
    dateLabel: "2018-01-24",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://sabq.org/saudia/hrjy5k",
    thumbnail: null,
    featured: false,
  },
  {
    title: "Saudi Geological Survey: ‘Bronze Age findings in Khybar will be vital to the future’",
    titleAr: null,
    source: "Arab News",
    dateLabel: "2018-01-21",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://www.arabnews.com/node/1230091/saudi-arabia",
    thumbnail: null,
    featured: false,
  },
  {
    title: "هزة أرضية تضرب شمال غرب المدينة المنورة",
    titleAr: "هزة أرضية تضرب شمال غرب المدينة المنورة",
    source: "Al Riyadh",
    dateLabel: "2018-01-16",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://www.alriyadh.com/1654930",
    thumbnail: null,
    featured: false,
  },
  {
    title: "هاني زهران يكشف تفاصيل هزة المدينة.. والأرصاد تتابع",
    titleAr: "هاني زهران يكشف تفاصيل هزة المدينة.. والأرصاد تتابع",
    source: "Al-Mowaten",
    dateLabel: "2018-01-16",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://www.almowaten.net/2018/01/%D9%87%D8%A7%D9%86%D9%8A-%D8%B2%D9%87%D8%B1%D8%A7%D9%86-%D9%8A%D9%83%D8%B4%D9%81-%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84-%D9%87%D8%B2%D8%A9-%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9-%D9%88%D8%A7%D9%84/",
    thumbnail: null,
    featured: false,
  },
  {
    title:
      "عام / المساحة الجيولوجية تؤكد إنخفاظ عدد الهزات وقوتها في منطقة الصدوع الأرضية بمحافظة النماص",
    titleAr:
      "عام / المساحة الجيولوجية تؤكد إنخفاظ عدد الهزات وقوتها في منطقة الصدوع الأرضية بمحافظة النماص",
    source: "Saudi Press Agency",
    dateLabel: "2017-11-16",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://www.spa.gov.sa/w538798",
    thumbnail: null,
    featured: false,
  },
  {
    title: 'خبراء أمريكيون : "زلزال كبير" يهددإيران ودول الخليج',
    titleAr: 'خبراء أمريكيون : "زلزال كبير" يهددإيران ودول الخليج',
    source: "Bawabati",
    dateLabel: "2017-11-15",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://bawabatii.net/news162516.html",
    thumbnail: null,
    featured: false,
  },
  {
    title: "عودة مخاوف البراكين في العيص.. و«المساحة الجيولوجية» تبث التطمينات",
    titleAr: "عودة مخاوف البراكين في العيص.. و«المساحة الجيولوجية» تبث التطمينات",
    source: "Asharq Al-Awsat",
    dateLabel: "2011-06-25",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl: "https://archive.aawsat.com/details.asp?section=43&article=628228&issueno=11897",
    thumbnail: null,
    featured: false,
  },
  {
    title:
      "في أقل من 4 أيام.. القنفذة تتعرض لثالث هزة أرضية بقوة 3.4 درجة.. «المساحة الجيولوجية» : غرب السعودية منطقة زلازل وعلى سكانها تطبيق دليل البناء المقاوم لها",
    titleAr:
      "في أقل من 4 أيام.. القنفذة تتعرض لثالث هزة أرضية بقوة 3.4 درجة.. «المساحة الجيولوجية» : غرب السعودية منطقة زلازل وعلى سكانها تطبيق دليل البناء المقاوم لها",
    source: "Alrakoba",
    dateLabel: "2011-09-01",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://www.alrakoba.net/284721/%D9%81%D9%8A-%D8%A3%D9%82%D9%84-%D9%85%D9%86-4-%D8%A3%D9%8A%D8%A7%D9%85-%D8%A7%D9%84%D9%82%D9%86%D9%81%D8%B0%D8%A9-%D8%AA%D8%AA%D8%B9%D8%B1%D8%B6-%D9%84%D8%AB%D8%A7%D9%84%D8%AB-%D9%87%D8%B2%D8%A9/",
    thumbnail: null,
    featured: false,
  },
  {
    title: "التفاف كامل بين المسؤولين والمواطنين لاحتواء “هزات العيص”",
    titleAr: "التفاف كامل بين المسؤولين والمواطنين لاحتواء “هزات العيص”",
    source: "Al-Madina",
    dateLabel: "2010-08-14",
    type: "Article",
    description: null,
    videoUrl: null,
    articleUrl:
      "https://www.al-madina.com/article/42979/%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D9%81-%D9%83%D8%A7%D9%85%D9%84-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85%D8%B3%D8%A4%D9%88%D9%84%D9%8A%D9%86-%D9%88%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%B7%D9%86%D9%8A%D9%86-%D9%84%D8%A7%D8%AD%D8%AA%D9%88%D8%A7%D8%A1-%D9%87%D8%B2%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D9%8A%D8%B5",
    thumbnail: null,
    featured: false,
  },
];

/** Thumbnails (public/media) for interview videos already in site.ts, keyed by video URL. */
export const interviewThumbnails: { videoUrl: string; thumbnail: string }[] = [
  {
    videoUrl: "https://www.youtube.com/watch?v=DMFNhK_j7xo",
    thumbnail: "/media/interview-1.jpg",
  },
  {
    videoUrl: "https://www.alekhbariya.net/ar/Video-Library/CORE9E3E0844F9F74A4BA464AA130BE6CBAE",
    thumbnail: "/media/interview-5.jpg",
  },
  {
    videoUrl: "https://slaati.com/2023/09/12/p2369452.html",
    thumbnail: "/media/interview-6.jpg",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=TubyV5nMH04",
    thumbnail: "/media/interview-7.jpg",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=RdKlU7qpFY8",
    thumbnail: "/media/interview-3.jpg",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=4zECbRTH_oE",
    thumbnail: "/media/interview-4.jpg",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=G6e2arbq_BU",
    thumbnail: "/media/interview-2.jpg",
  },
];
