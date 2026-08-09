// Central content source for the public site.
// Every field here will become editable from the admin panel (CMS) later.

export const profile = {
  name: "Dr. Hani Mahmoud Zahran",
  credentials: "PhD",
  title: "Geophysicist & Seismologist | Technical Advisor | Earthquake & Volcano Researcher",
  tagline:
    "More than three decades of experience in geophysics, seismology, seismic hazard assessment, disaster risk reduction, and geological research.",
  location: "Jeddah, Saudi Arabia",
  email: "zahran.hm@sgs.org.sa",
  phone: "+966 505 613 667",
  primaryCta: { label: "Explore My Research", to: "/publications" },
  secondaryCta: { label: "Get in Touch", to: "/contact" },
};

export const summary = [
  "Dr. Hani Mahmoud Zahran is a geophysicist and seismologist with more than three decades of experience across governmental and research sectors. He currently serves as Technical Advisor for the Vice President of Geological Programs at the Saudi Geological Survey.",
  "His career includes extensive work in earthquake and volcanic hazard assessment, seismicity monitoring, seismic signal processing, geophysical methods, numerical simulations, disaster risk reduction, and scientific research.",
  "He has contributed to international research collaborations, peer-reviewed publications, scientific conferences, workshops, and professional training.",
];

export type Stat = { label: string; value: string };
export const stats: Stat[] = [
  { label: "Years of Experience", value: "34+" },
  { label: "Publications", value: "41" },
  { label: "Citations", value: "1,218" },
  { label: "H-Index", value: "22" },
  { label: "Scientific Books", value: "2" },
];

export type CareerEntry = {
  position: string;
  organization: string;
  start: string;
  end: string;
  description?: string;
};
export const career: CareerEntry[] = [
  {
    position: "Technical Advisor for the Vice President of Geological Programs",
    organization: "Saudi Geological Survey",
    start: "Jul 2026",
    end: "Present",
  },
  {
    position: "Technical Advisor for the Geological Hazard Center",
    organization: "Saudi Geological Survey",
    start: "May 2025",
    end: "Jul 2026",
  },
  {
    position: "Manager of the Disaster and Crisis Center",
    organization: "Saudi Geological Survey",
    start: "Sep 2021",
    end: "May 2025",
  },
  {
    position: "Consultant for Earthquakes and Volcanoes",
    organization: "Saudi Geological Survey",
    start: "Apr 2019",
    end: "Sep 2021",
  },
  {
    position: "General Manager, National Center for Earthquake and Volcanoes",
    organization: "Saudi Geological Survey",
    start: "Feb 2005",
    end: "Apr 2019",
    description:
      "Led Saudi Arabia's national seismic and volcanic monitoring programs, including development of the Saudi National Seismic Network.",
  },
  {
    position: "Head of Geophysical Exploration Department",
    organization: "Saudi Geological Survey",
    start: "2003",
    end: "2005",
  },
  {
    position: "Manager of Geophysical Management",
    organization: "Saudi Geological Survey",
    start: "2000",
    end: "2003",
  },
  {
    position: "Senior Geophysicist",
    organization: "French Geological Survey (BRGM)",
    start: "1997",
    end: "1999",
  },
  {
    position: "Geophysicist",
    organization: "French Geological Survey (BRGM)",
    start: "1993",
    end: "1997",
  },
];

export const collaborations: CareerEntry[] = [
  {
    position: "Research Collaborator",
    organization: "United States Geological Survey (USGS), USA",
    start: "2015",
    end: "Present",
  },
];

export const expertise: string[] = [
  "Applied Geophysics",
  "Seismology",
  "Seismic Hazard Assessment",
  "Earthquake Research",
  "Volcanic Hazard Assessment",
  "Seismic Signal Processing",
  "Disaster Risk Reduction",
  "Mineral Exploration",
  "Geothermal Prospecting",
  "Numerical Simulation",
  "Geophysical Data Analysis",
  "High-Performance Computing",
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
export const publications: Publication[] = [
  {
    id: "pub-1",
    title:
      "Areal-Source and Fault-Source Based Probabilistic Seismic Hazard Analysis Using Characteristic Earthquake Model and Monte-Carlo Approach: An Example of the Gulf of Aqaba Region",
    authors: "Zahran H.M. et al.",
    journal: "Journal not yet specified",
    year: 2024,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    summary:
      "A probabilistic seismic hazard analysis of the Gulf of Aqaba region combining areal- and fault-source models with a characteristic earthquake model and Monte-Carlo simulation.",
    featured: true,
  },
  {
    id: "pub-2",
    title: "Thickness of the Saudi Arabian Crust",
    authors: "Zahran H.M. et al.",
    journal: "US Geological Survey Professional Paper",
    year: 2023,
    type: "Report",
    area: "Geophysics",
    summary: "An assessment of crustal thickness beneath Saudi Arabia.",
    featured: true,
  },
  {
    id: "pub-3",
    title: "Teleseismic P-Wave Attenuation Beneath the Arabian Plate",
    authors: "Zahran H.M. et al.",
    journal: "Geosciences",
    year: 2023,
    type: "Journal Article",
    area: "Seismology",
    summary: "An investigation of teleseismic P-wave attenuation structure beneath the Arabian Plate.",
    featured: true,
  },
  {
    id: "pub-4",
    title:
      "Isotropic and Radially Anisotropic S-Velocity Structure Beneath the Arabian Plate Inferred from Surface Wave Tomography",
    authors: "Zahran H.M. et al.",
    journal: "Tectonophysics",
    year: 2023,
    type: "Journal Article",
    area: "Seismology",
    summary:
      "Surface wave tomography constraining isotropic and radially anisotropic shear-velocity structure beneath the Arabian Plate.",
    featured: true,
  },
  {
    id: "pub-5",
    title:
      "The Duration and Characteristics of Magmatic Differentiation from Basalt to Trachyte Within the Matan Volcanic Center, Northern Harrat Rahat, Kingdom of Saudi Arabia",
    authors: "Zahran H.M. et al.",
    journal: "Journal not yet specified",
    year: 2023,
    type: "Journal Article",
    area: "Volcanology",
    summary:
      "A study of the timescales and characteristics of magmatic differentiation from basalt to trachyte at the Matan Volcanic Center, northern Harrat Rahat.",
    featured: true,
  },
  {
    id: "pub-6",
    title:
      "Shear Velocity Structure Beneath Saudi Arabia From the Joint Inversion of P and S Wave Receiver Functions, and Rayleigh Wave Group Velocity Dispersion Data",
    authors: "Zahran H.M. et al.",
    journal: "Solid Earth",
    year: 2019,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-7",
    title: "Crustal imaging of northern Harrat Rahat, Saudi Arabia, from ambient noise tomography",
    authors: "Zahran H.M. et al.",
    journal: "Geophysical Journal International",
    year: 2019,
    type: "Journal Article",
    area: "Volcanology",
  },
  {
    id: "pub-8",
    title: "Crustal magmatism and anisotropy beneath the Arabian Shield - a cautionary tale",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Geophysical Research: Solid Earth",
    year: 2019,
    type: "Journal Article",
    area: "Geophysics",
  },
  {
    id: "pub-9",
    title: "Deterministic seismic hazard assessment for the Makkah region, western Saudi Arabia",
    authors: "Zahran H.M., Sokolov V., El-Hadidy S.",
    journal: "Arabian Journal of Geosciences",
    year: 2019,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    featured: true,
  },
  {
    id: "pub-10",
    title:
      "Crustal structure of the northern Harrat Rahat volcanic field (Saudi Arabia) from gravity and aeromagnetic data",
    authors: "Zahran H.M. et al.",
    journal: "Tectonophysics",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    featured: true,
  },
  {
    id: "pub-11",
    title:
      "Reconstructing lava flow emplacement histories with rheological and morphological analyses: the Harrat Rahat volcanic field, Kingdom of Saudi Arabia",
    authors: "Dietterich H., Downs D., Stelten M., Zahran H.",
    journal: "Bulletin of Volcanology",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    featured: true,
  },
  {
    id: "pub-12",
    title:
      "Evidence for crustal low shear-wave speed in western Saudi Arabia from multi-scale fundamental-mode Rayleigh-wave group-velocity tomography",
    authors: "Zahran H.M. et al.",
    journal: "Earth and Planetary Science Letters",
    year: 2018,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-13",
    title:
      "Generation of stochastic earthquake ground motion in western Saudi Arabia as a first step in development of regional ground motion prediction model",
    authors: "Sokolov V., Zahran H.",
    journal: "Arabian Journal of Geosciences",
    year: 2018,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
  },
  {
    id: "pub-14",
    title: "Integrated Studies for Assessment of Seismic Hazard in Harrat Lunayyir",
    authors: "Zahran H.M.",
    journal: "LAMBERT Academic Publishing",
    year: 2018,
    type: "Scientific Book",
    area: "Seismic Hazard Assessment",
  },
  {
    id: "pub-15",
    title: "Seismic microzonation of Ubhur district, Jeddah, Saudi Arabia, using H/V spectral ratio",
    authors: "Zahran H.M. et al.",
    journal: "Arabian Journal of Geosciences",
    year: 2018,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
  },
  {
    id: "pub-16",
    title:
      "Timescales of magmatic differentiation from alkali basalt to trachyte within the Harrat Rahat volcanic field, Kingdom of Saudi Arabia",
    authors: "Zahran H.M. et al.",
    journal: "Contributions to Mineralogy and Petrology",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
  },
  {
    id: "pub-17",
    title: "Two-stage Red Sea rifting inferred from mantle earthquakes in Neoproterozoic lithosphere",
    authors: "Zahran H.M. et al.",
    journal: "Earth and Planetary Science Letters",
    year: 2018,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-18",
    title: "Volcanic history of the northernmost part of the Harrat Rahat volcanic field, Saudi Arabia",
    authors: "Zahran H.M. et al.",
    journal: "Geosphere",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
  },
  {
    id: "pub-19",
    title: "Seismic hazard assessment for Harrat Lunayyir – A lava field in western Saudi Arabia",
    authors: "Zahran H., El-Hady S.",
    journal: "Soil Dynamics and Earthquake Engineering",
    year: 2017,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
  },
  {
    id: "pub-20",
    title: "Aeromagnetic data over Harrat Lunayyir and surrounding areas, western Saudi Arabia",
    authors: "Zahran H., El-Hady S., Abuelnaga H.",
    journal: "Arabian Journal of Geosciences",
    year: 2017,
    type: "Journal Article",
    area: "Geophysics",
  },
  {
    id: "pub-21",
    title:
      "Surface soil assessment in the Ubhur area, north of Jeddah, western Saudi Arabia, using a multichannel analysis of surface waves method",
    authors: "Zahran H.M. et al.",
    journal: "Journal of the Geological Society of India",
    year: 2017,
    type: "Journal Article",
    area: "Geophysics",
  },
  {
    id: "pub-22",
    title: "Upper mantle velocity structure beneath the Arabian shield from Rayleigh surface wave tomography and its implications",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Geophysical Research: Solid Earth",
    year: 2017,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-23",
    title: "Geophysical Atlas of Central and Western Saudi Arabia",
    authors: "Zahran H.M., Stewart I.C.F., Johnson P.R., Basahel M.H.",
    journal: "Saudi Geological Survey",
    year: 2017,
    type: "Scientific Book",
    area: "Geophysics",
  },
  {
    id: "pub-24",
    title:
      "Emplacement conditions of the 1256 AD Al-Madinah lava flow field in Harrat Rahat, Kingdom of Saudi Arabia — Insights from surface morphology and lava flow simulations",
    authors: "Kereszturi G., Németh K., Moufti M.R. et al.",
    journal: "Journal of Volcanology and Geothermal Research",
    year: 2016,
    type: "Journal Article",
    area: "Volcanology",
  },
  {
    id: "pub-25",
    title: "Imaging of magma intrusions beneath Harrat Al-Madinah in Saudi Arabia",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Asian Earth Sciences",
    year: 2016,
    type: "Journal Article",
    area: "Volcanology",
    doi: "10.1016/j.jseaes.2016.01.023",
  },
  {
    id: "pub-26",
    title: "On the development of a seismic source zonation model for seismic hazard assessment in western Saudi Arabia",
    authors: "Zahran H.M., Sokolov V., Roobol M.J., Stewart I.C.F., El-Hadidy S.Y., El-Hadidy M.",
    journal: "Journal of Seismology",
    year: 2016,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    doi: "10.1007/s10950-016-9555-y",
  },
  {
    id: "pub-27",
    title: "The lithospheric shear-wave velocity structure of Saudi Arabia: Young volcanism in an old shield",
    authors: "Zahran H.M. et al.",
    journal: "Tectonophysics",
    year: 2016,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-28",
    title: "Broad accommodation of rift-related extension recorded by dyke intrusion in Saudi Arabia",
    authors: "Zahran H.M. et al.",
    journal: "Nature Geoscience",
    year: 2010,
    type: "Journal Article",
    area: "Geophysics",
  },
  {
    id: "pub-29",
    title: "The Saudi National Seismic Network",
    authors: "Zahran H.M. et al.",
    journal: "Seismological Research Letters",
    year: 2007,
    type: "Journal Article",
    area: "Seismology",
  },
  {
    id: "pub-30",
    title: "Gamma-Ray Exposure Maps From Airborne Spectrometric Data (Open-File Report SGS-OF-2006-9)",
    authors: "Zahran H.M., Stewart I.C.F.",
    journal: "Saudi Geological Survey",
    year: 2006,
    type: "Report",
    area: "Geophysics",
  },
  {
    id: "pub-31",
    title: "Aeromagnetic-anomaly maps of central and western Saudi Arabia",
    authors: "Zahran H.M., Stewart I.C.F., Johnson P.R., Basahel M.H.",
    journal: "Saudi Geological Survey",
    year: 2003,
    type: "Report",
    area: "Geophysics",
  },
  {
    id: "pub-32",
    title: "The Ar Rayn Terrane: Geotectonic Implications of Unique Metallogeny in the Arabian Shield (Report SGS-OF-2002-8)",
    authors: "Zahran H.M. et al.",
    journal: "Saudi Geological Survey",
    year: 2001,
    type: "Report",
    area: "Mineral Exploration",
  },
  {
    id: "pub-33",
    title: "Detail mineral exploration studies in Shatban prospect, Western Saudi Arabia (Master Thesis)",
    authors: "Zahran H.M., Sadek H.S.",
    journal: "King Abdulaziz University",
    year: 1999,
    type: "Other",
    area: "Mineral Exploration",
  },
];

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
export const media: MediaItem[] = [
  {
    id: "media-1",
    title: "لقاء مع المهندس هاني زهران حول إحتياطات الزلازل",
    source: "هيئة المساحة الجيولوجية السعودية",
    date: "n.d.",
    type: "Video",
    videoUrl: "https://www.youtube.com/watch?v=DMFNhK_j7xo",
    featured: true,
  },
  {
    id: "media-2",
    title: "زلزال وسط البحر الأحمر غرب الليث ضعيف جدا ومحدود ولا تأثير له",
    source: "قناة الإخبارية",
    date: "Jul 2024",
    type: "Video",
    videoUrl: "https://www.alekhbariya.net/ar/Video-Library/CORE9E3E0844F9F74A4BA464AA130BE6CBAE",
  },
  {
    id: "media-3",
    title: "هاني زهران يوضح الخطوات المتبعة لتقليل مخاطر الزلازل",
    source: "صحيفة صدى",
    date: "Sep 12, 2023",
    type: "Interview",
    videoUrl: "https://slaati.com/2023/09/12/p2369452.html",
    articleUrl: "https://slaati.com/2023/09/12/p2369452.html",
  },
  {
    id: "media-4",
    title: "مركز الزلازل و البراكين: طابة حائل تعد من المواقع البركانية شبه الخامدة ونطمئن الأهالي",
    source: "قناة الإخبارية",
    date: "n.d.",
    type: "Video",
    videoUrl: "https://www.youtube.com/watch?v=TubyV5nMH04",
  },
  {
    id: "media-5",
    title: "المرصد - هزة أرضية خفيفة بمدينة طابة في حائل",
    source: "قناة الإقتصادية",
    date: "n.d.",
    type: "Video",
    videoUrl: "https://www.youtube.com/watch?v=RdKlU7qpFY8",
  },
  {
    id: "media-6",
    title: "هاني زهران ـ برنامج مع الحدث ـ ساحات ينبع",
    source: "ساحات ينبع",
    date: "n.d.",
    type: "Video",
    videoUrl: "https://www.youtube.com/watch?v=4zECbRTH_oE",
  },
  {
    id: "media-7",
    title: "المرصد - م. هاني زهران",
    source: "قناة الإقتصادية",
    date: "n.d.",
    type: "Video",
    videoUrl: "https://www.youtube.com/watch?v=G6e2arbq_BU",
  },
  {
    id: "media-8",
    title: "المركز الوطني للزلازل: سد حلباء تسبب في حدوث الهزة الأرضية بالنماص",
    source: "Garb News",
    date: "Oct 24, 2024",
    type: "News Feature",
    articleUrl: "https://garbnews.net/news/s/81392",
    featured: true,
  },
  {
    id: "media-9",
    title: "\"المساحة الجيولوجية\": الزلزال الذي حدث وسط البحر الأحمر ضعيف جدا ولا تأثير له",
    source: "Al-Madina",
    date: "Jul 28, 2024",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/897748/",
  },
  {
    id: "media-10",
    title: "مدير مركز الأزمات بـ «المساحة الجيولوجية»: زلزال البحر الأحمر ضعيف جدًا ولا تأثير له",
    source: "Ajel",
    date: "Jul 28, 2024",
    type: "News Feature",
    articleUrl: "https://ajel.sa/local/cvuinxnok8",
  },
  {
    id: "media-11",
    title: "مدير إدارة الأزمات والكوارث في هيئة المساحة الجيولوجية السعودية",
    source: "Nabd",
    date: "Jul 28, 2024",
    type: "News Feature",
    articleUrl: "https://nabd.com/s/139256313-2d1d86/",
  },
  {
    id: "media-12",
    title: "فيديو | مدير مركز الأزمات والكوارث",
    source: "Alekhbariya TV",
    date: "Jul 27, 2024",
    type: "News Feature",
    articleUrl: "https://x.com/alekhbariyatv/status/1817285826893504777",
  },
  {
    id: "media-13",
    title: "بالفيديو.. مسؤول بـ«المساحة الجيولوجية»: دول الخليج بعيدة عن الزلازل المدمرة",
    source: "Ajel",
    date: "Mar 6, 2023",
    type: "News Feature",
    articleUrl: "https://ajel.sa/local/x4zgt5wx31",
  },
  {
    id: "media-14",
    title: "\"المساحة الجيولوجية\": دول الخليج العربي بعيدة عن نشاط الزلازل المدمرة",
    source: "Almnatiq",
    date: "Mar 6, 2023",
    type: "News Feature",
    articleUrl: "https://almnatiq.net/",
  },
  {
    id: "media-15",
    title: "Saudi Arabia plans 50 seismic stations in 3 years",
    source: "Arab News",
    date: "Dec 2, 2018",
    type: "News Feature",
    articleUrl: "https://www.arabnews.com/node/1414586/saudi-arabia",
    featured: true,
  },
  {
    id: "media-16",
    title: "\"زهران\" يكشف سبب الهزات الأرضية بأملج ويتوقع استمرارها لفترة بلا خطورة",
    source: "Sabq",
    date: "Nov 12, 2018",
    type: "News Feature",
    articleUrl: "https://sabq.org/saudia/prkmxt",
  },
  {
    id: "media-17",
    title: "هيئة المساحة الجيولوجية توضح أسباب الهزات الأرضية في أملج",
    source: "Al-Madina",
    date: "Nov 12, 2018",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/598414/",
  },
  {
    id: "media-18",
    title: "هاني زهران لـ «عكاظ»: لا صحة لما تم تداوله عن زلزال قادم بقوة 5 درجات",
    source: "Okaz",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://www.okaz.com.sa/local/na/1586658",
  },
  {
    id: "media-19",
    title: "مدير عام المركز الوطني للزلازل يكشف عن عدد الزلازل التي شهدتها النماص",
    source: "Wtniaat",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://www.wtniaat.com/news-action-s-id-20561.htm",
  },
  {
    id: "media-20",
    title: "زلزال ثان يضرب \"النماص\" السعودية",
    source: "Elaph",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://elaph.com/Web/News/2017/11/1175282.html",
  },
  {
    id: "media-21",
    title: "مدير عام المركز الوطني للزلازل: اتهام الدكتور عشقي \"مرفوض\"",
    source: "Okaz",
    date: "Oct 18, 2017",
    type: "News Feature",
    articleUrl: "https://www.okaz.com.sa/local/na/1581650",
  },
  {
    id: "media-22",
    title: "\"زهران\" ينفي شائعة حدوث زلزال ضخم بالمنطقة",
    source: "Slaati",
    date: "2017",
    type: "News Feature",
    articleUrl: "https://slaati.com/2017/11/14/p914215.html",
  },
  {
    id: "media-23",
    title: "\"زهران\": دراسة تتوقع تعرض \"حرة الشاقة\" لهزات أرضية",
    source: "mz-mz",
    date: "2017",
    type: "News Feature",
    articleUrl: "https://mz-mz.net/1005347/",
  },
  {
    id: "media-24",
    title: "30 هزة أرضية تراوحت قوتها بين ١ و ٤,٤ درجة على مقياس ريختر",
    source: "Alyaum",
    date: "Jun 28, 2015",
    type: "News Feature",
    articleUrl: "https://www.alyaum.com/articles/1014940/",
  },
  {
    id: "media-25",
    title: "73 quakes west of Umluj in one week",
    source: "Saudi Gazette",
    date: "Jan 18, 2015",
    type: "News Feature",
    articleUrl: "https://saudigazette.com.sa/article/110056",
    featured: true,
  },
  {
    id: "media-26",
    title: "62 زلزالاً بـ \"جازان\" تُثير المواطنين",
    source: "Elaph",
    date: "Aug 5, 2014",
    type: "News Feature",
    articleUrl: "https://www.sarayanews.com/article/267053",
  },
  {
    id: "media-27",
    title: "هزة أرضية بقوة 3.7 جنوب السعودية",
    source: "Sky News Arabia",
    date: "Aug 4, 2014",
    type: "News Feature",
    articleUrl: "https://www.skynewsarabia.com/middle-east/678825",
  },
  {
    id: "media-28",
    title: "السعودية.. هزة أرضية ثالثة وإرشادات رسمية للتعامل معها",
    source: "CNN Arabic",
    date: "Jan 26, 2014",
    type: "News Feature",
    articleUrl: "https://arabic.cnn.com/middleeast/2014/01/26/saudiearthquake",
  },
  {
    id: "media-29",
    title: "مخاوف على سد جازان بعد الهزات الأرضية الأخيرة",
    source: "Al Arabiya",
    date: "Jan 26, 2014",
    type: "News Feature",
    articleUrl: "https://www.alarabiya.net/saudi-today/2014/01/26/",
  },
  {
    id: "media-30",
    title: "KSA to set up 50 additional seismic monitoring stations",
    source: "Arab News",
    date: "Dec 19, 2013",
    type: "News Feature",
    articleUrl: "https://www.arabnews.com/news/495066",
  },
  {
    id: "media-31",
    title: "عودة مخاوف البراكين في العيص",
    source: "Asharq Al-Awsat",
    date: "Jun 25, 2011",
    type: "News Feature",
    articleUrl: "https://archive.aawsat.com/details.asp?section=43&article=628228",
  },
  {
    id: "media-32",
    title: "في أقل من 4 أيام.. القنفذة تتعرض لثالث هزة أرضية",
    source: "Al Rakoba",
    date: "Sep 1, 2011",
    type: "News Feature",
    articleUrl: "https://www.alrakoba.net/284721/",
  },
  {
    id: "media-33",
    title: "التفاف كامل بين المسؤولين والمواطنين لاحتواء \"هزات العيص\"",
    source: "Al Madina",
    date: "Aug 14, 2010",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/42979/",
  },
  {
    id: "media-34",
    title: "« الجيولوجية»: إلغاء قرار عودة سكان العيص",
    source: "Al Eqtisadiah",
    date: "Jun 28, 2009",
    type: "News Feature",
    articleUrl: "https://www.aleqt.com/2009/06/28/article_245322.html",
  },
  {
    id: "media-35",
    title: "السعودية تعتزم إخلاء منطقة الزلازل",
    source: "Arabian Business",
    date: "May 18, 2009",
    type: "News Feature",
    articleUrl: "https://arabic.arabianbusiness.com/politics-economics/21166",
  },
  {
    id: "media-36",
    title: "مدير المركز الوطني للزلازل والبراكين هاني زهران",
    source: "Al Jazirah",
    date: "Aug 16, 2008",
    type: "News Feature",
    articleUrl: "https://www.al-jazirah.com/2008/20080816/ln1.htm",
  },
  {
    id: "media-37",
    title: "2300 زلزال سنويًّا بالشرقية السعودية نتيجة \"سحب\" البترول",
    source: "Al Fajer TV",
    date: "n.d.",
    type: "News Feature",
    articleUrl: "https://alfajertv.com/cocktail/34446.html",
  },
];

export type Recommendation = {
  id: string;
  name: string;
  position: string;
  organization: string;
  text: string;
  date?: string;
  featured?: boolean;
};
export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    name: "Ahmed Hosny",
    position: "Technical Advisor",
    organization: "National Center for Earthquakes and Volcanoes, Saudi Geological Survey",
    text: "Dr. Hani is very helpful, cooperated person and always pushing the youngest researchers to all progress and successful future.",
    featured: true,
  },
  {
    id: "rec-2",
    name: "Mahmoud Sami",
    position: "Colleague",
    organization: "",
    text: "Dr. Hani has great leadership abilities and has a strong scientific background in his field of work.",
    featured: true,
  },
];

export type EducationEntry = {
  degree: string;
  field: string;
  university: string;
  location: string;
  year: string;
  description?: string;
};
export const education: EducationEntry[] = [
  {
    degree: "PhD",
    field: "Geophysics and Seismology",
    university: "King Abdulaziz University",
    location: "Jeddah, Saudi Arabia",
    year: "2018",
  },
  {
    degree: "MSc",
    field: "Applied Geophysics",
    university: "King Abdulaziz University",
    location: "Jeddah, Saudi Arabia",
    year: "1999",
    description: "Thesis: Detail mineral exploration studies in Shatban prospect, Western Saudi Arabia.",
  },
  {
    degree: "BSc",
    field: "Applied Geophysics",
    university: "King Abdulaziz University",
    location: "Jeddah, Saudi Arabia",
    year: "1993",
  },
];

export const researchSpecialties: string[] = [
  "Applied Geophysics",
  "Seismic Hazard Assessment",
  "Disaster Risk Reduction",
  "Seismology",
  "Mineral Exploration",
  "Geothermal Prospecting",
];

export type Membership = { title: string; period?: string };
export const memberships: Membership[] = [
  { title: "Vice Chairman of the Board, Saudi Society for Geoscience", period: "2014 – 2023" },
  { title: "Representative of Saudi Arabia, Global Platform for Disaster Risk Reduction" },
  { title: "Chief, National Advisory Committee for Earthquakes" },
  { title: "Chief, Advisory Committee for Study of Causes and Influence of Earthquakes" },
  { title: "Participant, National Disaster Risk Reduction Committee" },
  { title: "Member, Saudi Building Code Technical and Seismic Committees" },
  { title: "Chairman, Saudi Geological Survey Promotion Committee" },
  { title: "Leadership roles, International Geological Conferences" },
];

export const activities: string[] = [
  "Saudi National Seismic Network",
  "Saudi National Strong Motion Network",
  "Seismic hazard map of the Kingdom of Saudi Arabia",
  "Harrat Al-Madinah seismic and volcanic hazard assessment",
  "Haramain High-Speed Railway seismic risk assessment",
  "HAZUS earthquake loss estimation studies",
  "Seismic and volcanic activity investigations across Saudi Arabia",
];

export const languages: string[] = ["Arabic", "English"];

export const interests: string[] = [
  "Academia / Research / Science",
  "HPC and Data Analysis",
  "Environment and Natural Hazards",
  "Industry / Engineering",
  "International Collaboration",
];

export const socialLinks: { label: string; url: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dr-hani-zahran-b1ba4762/" },
];

export const biography: string[] = [
  "Dr. Hani Mahmoud Zahran is a geophysicist and seismologist with more than three decades of experience across governmental and research sectors. He currently serves as Technical Advisor for the Vice President of Geological Programs at the Saudi Geological Survey.",
  "His career at the Saudi Geological Survey spans more than two decades, including roles as Manager of the Disaster and Crisis Center, Consultant for Earthquakes and Volcanoes, and General Manager of the National Center for Earthquake and Volcanoes (2005–2019), where he led the Kingdom's national seismic and volcanic monitoring programs.",
  "He began his career as a Geophysicist with the French Geological Survey (BRGM) from 1993 to 1999, and has served as a Research Collaborator with the United States Geological Survey (USGS) since 2015. He holds a PhD in Geophysics and Seismology from King Abdulaziz University.",
  "\"Understanding the forces that shape our planet not only prepares us for today's challenges but also empowers safeguarding the future.\"",
];
