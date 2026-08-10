// Central content source for the public site.
// Every field here will become editable from the admin panel (CMS) later.

export const profile = {
  name: "Dr. Hani Mahmoud Zahran",
  nameAr: "د. هاني محمود زهران",
  credentials: "PhD",
  credentialsAr: "دكتوراه",
  title: "Geophysicist & Seismologist | Technical Advisor | Earthquake & Volcano Researcher",
  titleAr: "جيوفيزيائي وعالم زلازل | مستشار فني | باحث في الزلازل والبراكين",
  tagline:
    "More than three decades of experience in geophysics, seismology, seismic hazard assessment, disaster risk reduction, and geological research.",
  taglineAr:
    "أكثر من ثلاثة عقود من الخبرة في الجيوفيزياء وعلم الزلازل وتقييم المخاطر الزلزالية والحد من مخاطر الكوارث والبحث الجيولوجي.",
  location: "Jeddah, Saudi Arabia",
  locationAr: "جدة، المملكة العربية السعودية",
  email: "zahran.hm@sgs.org.sa",
  phone: "+966 50 598 1677",
  primaryCta: { label: "Explore My Research", labelAr: "استكشف أبحاثي", to: "/publications" },
  secondaryCta: { label: "Get in Touch", labelAr: "تواصل معي", to: "/contact" },
};

export const summary = [
  "Dr. Hani Mahmoud Zahran is a geophysicist and seismologist with more than three decades of experience across governmental and research sectors. He currently serves as Technical Advisor for the Vice President of Geological Programs at the Saudi Geological Survey.",
  "His career includes extensive work in earthquake and volcanic hazard assessment, seismicity monitoring, seismic signal processing, geophysical methods, numerical simulations, disaster risk reduction, and scientific research.",
  "He has contributed to international research collaborations, peer-reviewed publications, scientific conferences, workshops, and professional training.",
];

export type Stat = { label: string; labelAr: string; value: string };
export const stats: Stat[] = [
  { label: "Years of Experience", labelAr: "سنوات الخبرة", value: "34+" },
  { label: "Publications", labelAr: "المنشورات", value: "41" },
  { label: "Citations", labelAr: "الاستشهادات", value: "1,218" },
  { label: "H-Index", labelAr: "مؤشر H", value: "22" },
  { label: "Scientific Books", labelAr: "الكتب العلمية", value: "2" },
];

export type CareerEntry = {
  position: string;
  positionAr: string;
  organization: string;
  organizationAr: string;
  start: string;
  end: string;
  description?: string;
  descriptionAr?: string;
};

const SGS = "Saudi Geological Survey";
const SGS_AR = "الهيئة السعودية للمساحة الجيولوجية";

export const career: CareerEntry[] = [
  {
    position: "Technical Advisor for the Vice President of Geological Programs",
    positionAr: "مستشار فني لنائب رئيس البرامج الجيولوجية",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "Jul 2026",
    end: "Present",
  },
  {
    position: "Technical Advisor for the Geological Hazard Center",
    positionAr: "مستشار فني لمركز المخاطر الجيولوجية",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "May 2025",
    end: "Jul 2026",
  },
  {
    position: "Manager of the Disaster and Crisis Center",
    positionAr: "مدير مركز الكوارث والأزمات",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "Sep 2021",
    end: "May 2025",
  },
  {
    position: "Consultant for Earthquakes and Volcanoes",
    positionAr: "استشاري الزلازل والبراكين",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "Apr 2019",
    end: "Sep 2021",
  },
  {
    position: "General Manager, National Center for Earthquake and Volcanoes",
    positionAr: "المدير العام للمركز الوطني للزلازل والبراكين",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "Feb 2005",
    end: "Apr 2019",
    description:
      "Led Saudi Arabia's national seismic and volcanic monitoring programs, including development of the Saudi National Seismic Network.",
    descriptionAr:
      "قاد برامج المملكة العربية السعودية الوطنية لمراقبة الزلازل والبراكين، بما في ذلك تطوير الشبكة الوطنية السعودية لرصد الزلازل.",
  },
  {
    position: "Head of Geophysical Exploration Department",
    positionAr: "رئيس قسم المسح الجيوفيزيائي",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "2003",
    end: "2005",
  },
  {
    position: "Manager of Geophysical Management",
    positionAr: "مدير إدارة الجيوفيزياء",
    organization: SGS,
    organizationAr: SGS_AR,
    start: "2000",
    end: "2003",
  },
  {
    position: "Senior Geophysicist",
    positionAr: "جيوفيزيائي أول",
    organization: "French Geological Survey (BRGM)",
    organizationAr: "المكتب الفرنسي للأبحاث الجيولوجية والمنجمية (BRGM)",
    start: "1997",
    end: "1999",
  },
  {
    position: "Geophysicist",
    positionAr: "جيوفيزيائي",
    organization: "French Geological Survey (BRGM)",
    organizationAr: "المكتب الفرنسي للأبحاث الجيولوجية والمنجمية (BRGM)",
    start: "1993",
    end: "1997",
  },
];

export const collaborations: CareerEntry[] = [
  {
    position: "Research Collaborator",
    positionAr: "متعاون بحثي",
    organization: "United States Geological Survey (USGS), USA",
    organizationAr: "هيئة المسح الجيولوجي الأمريكية (USGS)، الولايات المتحدة الأمريكية",
    start: "2015",
    end: "Present",
  },
];

export type LocalizedItem = { en: string; ar: string };
export const expertise: LocalizedItem[] = [
  { en: "Applied Geophysics", ar: "الجيوفيزياء التطبيقية" },
  { en: "Seismology", ar: "علم الزلازل" },
  { en: "Seismic Hazard Assessment", ar: "تقييم المخاطر الزلزالية" },
  { en: "Earthquake Research", ar: "أبحاث الزلازل" },
  { en: "Volcanic Hazard Assessment", ar: "تقييم المخاطر البركانية" },
  { en: "Seismic Signal Processing", ar: "معالجة الإشارات الزلزالية" },
  { en: "Disaster Risk Reduction", ar: "الحد من مخاطر الكوارث" },
  { en: "Mineral Exploration", ar: "التنقيب عن المعادن" },
  { en: "Geothermal Prospecting", ar: "استكشاف الطاقة الحرارية الأرضية" },
  { en: "Numerical Simulation", ar: "المحاكاة العددية" },
  { en: "Geophysical Data Analysis", ar: "تحليل البيانات الجيوفيزيائية" },
  { en: "High-Performance Computing", ar: "الحوسبة عالية الأداء" },
];

export type PublicationType =
  "Journal Article" | "Scientific Book" | "Conference Paper" | "Report" | "Other";

export const publicationTypeAr: Record<PublicationType, string> = {
  "Journal Article": "مقال علمي",
  "Scientific Book": "كتاب علمي",
  "Conference Paper": "ورقة مؤتمر",
  Report: "تقرير",
  Other: "أخرى",
};

export const publicationAreaAr: Record<string, string> = {
  "Seismic Hazard Assessment": "تقييم المخاطر الزلزالية",
  Geophysics: "الجيوفيزياء",
  Seismology: "علم الزلازل",
  Volcanology: "علم البراكين",
  "Mineral Exploration": "التنقيب عن المعادن",
};

export type Publication = {
  id: string;
  title: string;
  titleAr: string;
  authors: string;
  journal: string;
  year: number;
  type: PublicationType;
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
    titleAr:
      "تحليل احتمالي للمخاطر الزلزالية باستخدام مصادر مساحية ومصادر فالقية بالاعتماد على نموذج الزلزال المميز وأسلوب مونت كارلو: نموذج تطبيقي من منطقة خليج العقبة",
    authors: "Sokolov V., Zahran H.M., Toni M.",
    journal: "Soil Dynamics and Earthquake Engineering",
    year: 2024,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    summary:
      "A probabilistic seismic hazard analysis of the Gulf of Aqaba region combining areal- and fault-source models with a characteristic earthquake model and Monte-Carlo simulation.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0267726124004937",
    featured: true,
  },
  {
    id: "pub-2",
    title: "Thickness of the Saudi Arabian Crust",
    titleAr: "سماكة القشرة الأرضية في المملكة العربية السعودية",
    authors: "Blanchette A.R., Klemperer S.L., Mooney W.D., Zahran H.M.",
    journal: "US Geological Survey Professional Paper 1862 (Chapter M)",
    year: 2023,
    type: "Report",
    area: "Geophysics",
    summary: "An assessment of crustal thickness beneath Saudi Arabia.",
    url: "https://pubs.usgs.gov/publication/pp1862M",
    featured: true,
  },
  {
    id: "pub-3",
    title: "Teleseismic P-Wave Attenuation Beneath the Arabian Plate",
    titleAr: "توهين الموجات الزلزالية البعيدة من نوع P أسفل الصفيحة العربية",
    authors: "Zahran H.M. et al.",
    journal: "Geosciences",
    year: 2023,
    type: "Journal Article",
    area: "Seismology",
    summary:
      "An investigation of teleseismic P-wave attenuation structure beneath the Arabian Plate.",
    doi: "10.3390/geosciences13110343",
    url: "https://doi.org/10.3390/geosciences13110343",
    featured: true,
  },
  {
    id: "pub-4",
    title:
      "Isotropic and Radially Anisotropic S-Velocity Structure Beneath the Arabian Plate Inferred from Surface Wave Tomography",
    titleAr:
      "البنية المتناحية وغير المتناحية شعاعيًا لسرعة الموجات S أسفل الصفيحة العربية المستنتجة من التصوير المقطعي للموجات السطحية",
    authors: "Kim R., Witek M., Chang S-J., Lim J-A., Mai P.M., Zahran H.M.",
    journal: "Tectonophysics",
    year: 2023,
    type: "Journal Article",
    area: "Seismology",
    summary:
      "Surface wave tomography constraining isotropic and radially anisotropic shear-velocity structure beneath the Arabian Plate.",
    url: "https://www.sciencedirect.com/science/article/pii/S0040195123002664",
    featured: true,
  },
  {
    id: "pub-5",
    title:
      "The Duration and Characteristics of Magmatic Differentiation from Basalt to Trachyte Within the Matan Volcanic Center, Northern Harrat Rahat, Kingdom of Saudi Arabia",
    titleAr:
      "مدة وخصائص التمايز الصهاري من البازلت إلى التراكيت في مركز متعن البركاني، شمال حرة راهط، المملكة العربية السعودية",
    authors: "Zahran H.M. et al.",
    journal: "US Geological Survey Professional Paper 1862 (Chapter F)",
    year: 2023,
    type: "Journal Article",
    area: "Volcanology",
    summary:
      "A study of the timescales and characteristics of magmatic differentiation from basalt to trachyte at the Matan Volcanic Center, northern Harrat Rahat.",
    url: "https://pubs.usgs.gov/publication/pp1862F",
    featured: true,
  },
  {
    id: "pub-6",
    title:
      "Shear Velocity Structure Beneath Saudi Arabia From the Joint Inversion of P and S Wave Receiver Functions, and Rayleigh Wave Group Velocity Dispersion Data",
    titleAr:
      "بنية سرعة موجات القص أسفل المملكة العربية السعودية من الانعكاس المشترك لدوال المستقبل لموجات P وS، وبيانات تشتت سرعة مجموعة موجات رايلي",
    authors: "Zahran H.M. et al.",
    journal: "Solid Earth",
    year: 2019,
    type: "Journal Article",
    area: "Seismology",
    url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018JB017131",
  },
  {
    id: "pub-7",
    title: "Crustal imaging of northern Harrat Rahat, Saudi Arabia, from ambient noise tomography",
    titleAr:
      "تصوير القشرة الأرضية لشمال حرة راهط، المملكة العربية السعودية، باستخدام التصوير المقطعي للضوضاء المحيطية",
    authors: "Zahran H.M. et al.",
    journal: "Geophysical Journal International",
    year: 2019,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://academic.oup.com/gji/article/219/3/1532/5551483",
  },
  {
    id: "pub-8",
    title: "Crustal magmatism and anisotropy beneath the Arabian Shield - a cautionary tale",
    titleAr: "النشاط الصهاري القشري والتباين الاتجاهي أسفل الدرع العربي - دراسة تحذيرية",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Geophysical Research: Solid Earth",
    year: 2019,
    type: "Journal Article",
    area: "Geophysics",
    url: "https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2019JB017903",
  },
  {
    id: "pub-9",
    title: "Deterministic seismic hazard assessment for the Makkah region, western Saudi Arabia",
    titleAr: "التقييم الحتمي للمخاطر الزلزالية لمنطقة مكة المكرمة، غرب المملكة العربية السعودية",
    authors: "Zahran H.M., Sokolov V., El-Hadidy S.",
    journal: "Arabian Journal of Geosciences",
    year: 2019,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    url: "https://ouci.dntb.gov.ua/en/works/7nEmP8m9/",
    featured: true,
  },
  {
    id: "pub-10",
    title:
      "Crustal structure of the northern Harrat Rahat volcanic field (Saudi Arabia) from gravity and aeromagnetic data",
    titleAr:
      "البنية القشرية لحقل حرة راهط البركاني الشمالي (المملكة العربية السعودية) من بيانات الجاذبية والمغناطيسية الجوية",
    authors: "Zahran H.M. et al.",
    journal: "Tectonophysics",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0040195118303834",
    featured: true,
  },
  {
    id: "pub-11",
    title:
      "Reconstructing lava flow emplacement histories with rheological and morphological analyses: the Harrat Rahat volcanic field, Kingdom of Saudi Arabia",
    titleAr:
      "إعادة بناء تاريخ توضع تدفقات الحمم البركانية من خلال التحليل الريولوجي والمورفولوجي: حقل حرة راهط البركاني، المملكة العربية السعودية",
    authors: "Dietterich H., Downs D., Stelten M., Zahran H.",
    journal: "Bulletin of Volcanology",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://pubs.usgs.gov/publication/70201168",
    featured: true,
  },
  {
    id: "pub-12",
    title:
      "Evidence for crustal low shear-wave speed in western Saudi Arabia from multi-scale fundamental-mode Rayleigh-wave group-velocity tomography",
    titleAr:
      "دلائل على انخفاض سرعة موجات القص القشرية في غرب المملكة العربية السعودية من التصوير المقطعي متعدد المقاييس لسرعة مجموعة موجات رايلي في النمط الأساسي",
    authors: "Zahran H.M. et al.",
    journal: "Earth and Planetary Science Letters",
    year: 2018,
    type: "Journal Article",
    area: "Seismology",
    url: "https://repository.kaust.edu.sa/items/29dcafeb-16da-41a7-bbba-273b80dbf021",
  },
  {
    id: "pub-13",
    title:
      "Generation of stochastic earthquake ground motion in western Saudi Arabia as a first step in development of regional ground motion prediction model",
    titleAr:
      "توليد الحركة الأرضية الزلزالية العشوائية في غرب المملكة العربية السعودية كخطوة أولى نحو تطوير نموذج إقليمي للتنبؤ بالحركة الأرضية",
    authors: "Sokolov V., Zahran H.",
    journal: "Arabian Journal of Geosciences",
    year: 2018,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    url: "https://www.semanticscholar.org/paper/Generation-of-stochastic-earthquake-ground-motion-a-Sokolov-Zahran/aab2a35fbf50db1d4a88efee371d865d5d2392ba",
  },
  {
    id: "pub-14",
    title: "Integrated Studies for Assessment of Seismic Hazard in Harrat Lunayyir",
    titleAr: "دراسات متكاملة لتقييم المخاطر الزلزالية في حرة لنير",
    authors: "Zahran H.M.",
    journal: "LAMBERT Academic Publishing",
    year: 2018,
    type: "Scientific Book",
    area: "Seismic Hazard Assessment",
    url: "https://my.lap-publishing.com/catalog/details/store/tr/book/978-3-659-43709-0/integrated-studies-for-assessment-of-seismic-hazard-in-harrat-lunayyir",
  },
  {
    id: "pub-15",
    title:
      "Seismic microzonation of Ubhur district, Jeddah, Saudi Arabia, using H/V spectral ratio",
    titleAr:
      "التقسيم الزلزالي الدقيق لحي أبحر، جدة، المملكة العربية السعودية، باستخدام نسبة H/V الطيفية",
    authors: "Zahran H.M. et al.",
    journal: "Arabian Journal of Geosciences",
    year: 2018,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    url: "https://www.researchgate.net/publication/323699564_Seismic_microzonation_of_Ubhur_district_Jeddah_Saudi_Arabia_using_HV_spectral_ratio",
  },
  {
    id: "pub-16",
    title:
      "Timescales of magmatic differentiation from alkali basalt to trachyte within the Harrat Rahat volcanic field, Kingdom of Saudi Arabia",
    titleAr:
      "الجداول الزمنية للتمايز الصهاري من البازلت القلوي إلى التراكيت في حقل حرة راهط البركاني، المملكة العربية السعودية",
    authors: "Zahran H.M. et al.",
    journal: "Contributions to Mineralogy and Petrology",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://pubs.usgs.gov/publication/70198364",
  },
  {
    id: "pub-17",
    title:
      "Two-stage Red Sea rifting inferred from mantle earthquakes in Neoproterozoic lithosphere",
    titleAr:
      "تصدع البحر الأحمر على مرحلتين المستنتج من زلازل الوشاح في الغلاف الصخري للعصر البروتيروزوي الحديث",
    authors: "Zahran H.M. et al.",
    journal: "Earth and Planetary Science Letters",
    year: 2018,
    type: "Journal Article",
    area: "Seismology",
    url: "https://www.researchgate.net/publication/326093068_Two-stage_Red_Sea_rifting_inferred_from_mantle_earthquakes_in_Neoproterozoic_lithosphere",
  },
  {
    id: "pub-18",
    title:
      "Volcanic history of the northernmost part of the Harrat Rahat volcanic field, Saudi Arabia",
    titleAr:
      "التاريخ البركاني لأقصى الجزء الشمالي من حقل حرة راهط البركاني، المملكة العربية السعودية",
    authors: "Zahran H.M. et al.",
    journal: "Geosphere",
    year: 2018,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://pubs.usgs.gov/publication/70196286",
  },
  {
    id: "pub-19",
    title: "Seismic hazard assessment for Harrat Lunayyir – A lava field in western Saudi Arabia",
    titleAr: "تقييم المخاطر الزلزالية لحرة لنير – حقل حمم بركانية في غرب المملكة العربية السعودية",
    authors: "Zahran H., El-Hady S.",
    journal: "Soil Dynamics and Earthquake Engineering",
    year: 2017,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0267726117301975",
  },
  {
    id: "pub-20",
    title: "Aeromagnetic data over Harrat Lunayyir and surrounding areas, western Saudi Arabia",
    titleAr:
      "بيانات المغناطيسية الجوية فوق حرة لنير والمناطق المحيطة بها، غرب المملكة العربية السعودية",
    authors: "Zahran H., El-Hady S., Abuelnaga H.",
    journal: "Arabian Journal of Geosciences",
    year: 2017,
    type: "Journal Article",
    area: "Geophysics",
    url: "https://www.researchgate.net/publication/313022835_Aeromagnetic_data_over_Harrat_Lunayyir_and_surrounding_areas_western_Saudi_Arabia",
  },
  {
    id: "pub-21",
    title:
      "Surface soil assessment in the Ubhur area, north of Jeddah, western Saudi Arabia, using a multichannel analysis of surface waves method",
    titleAr:
      "تقييم التربة السطحية في منطقة أبحر، شمال جدة، غرب المملكة العربية السعودية، باستخدام طريقة التحليل متعدد القنوات للموجات السطحية",
    authors: "Zahran H.M. et al.",
    journal: "Journal of the Geological Society of India",
    year: 2017,
    type: "Journal Article",
    area: "Geophysics",
    url: "https://link.springer.com/article/10.1007/s12594-017-0626-7",
  },
  {
    id: "pub-22",
    title:
      "Upper mantle velocity structure beneath the Arabian shield from Rayleigh surface wave tomography and its implications",
    titleAr:
      "بنية سرعة الوشاح العلوي أسفل الدرع العربي من التصوير المقطعي لموجات رايلي السطحية ودلالاتها",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Geophysical Research: Solid Earth",
    year: 2017,
    type: "Journal Article",
    area: "Seismology",
    url: "https://www.researchgate.net/publication/318654917_Upper_mantle_velocity_structure_beneath_the_Arabian_Shield_from_Rayleigh_surface_wave_tomography_and_its_implications",
  },
  {
    id: "pub-23",
    title: "Geophysical Atlas of Central and Western Saudi Arabia",
    titleAr: "الأطلس الجيوفيزيائي لوسط وغرب المملكة العربية السعودية",
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
    titleAr:
      "ظروف توضع حقل تدفق حمم المدينة المنورة لعام 1256م في حرة راهط، المملكة العربية السعودية — رؤى من المورفولوجيا السطحية ومحاكاة تدفق الحمم",
    authors: "Kereszturi G., Németh K., Moufti M.R. et al.",
    journal: "Journal of Volcanology and Geothermal Research",
    year: 2016,
    type: "Journal Article",
    area: "Volcanology",
    url: "https://www.researchgate.net/publication/284114516_Emplacement_conditions_of_the_1256_AD_Al-Madinah_lava_flow_field_in_Harrat_Rahat_Kingdom_of_Saudi_Arabia_-_Insights_from_surface_morphology_and_lava_flow_simulations",
  },
  {
    id: "pub-25",
    title: "Imaging of magma intrusions beneath Harrat Al-Madinah in Saudi Arabia",
    titleAr: "تصوير التداخلات الصهارية أسفل حرة المدينة المنورة في المملكة العربية السعودية",
    authors: "Zahran H.M. et al.",
    journal: "Journal of Asian Earth Sciences",
    year: 2016,
    type: "Journal Article",
    area: "Volcanology",
    doi: "10.1016/j.jseaes.2016.01.023",
    url: "https://www.academia.edu/79641698/Imaging_of_magma_intrusions_beneath_Harrat_Al_Madinah_in_Saudi_Arabia",
  },
  {
    id: "pub-26",
    title:
      "On the development of a seismic source zonation model for seismic hazard assessment in western Saudi Arabia",
    titleAr:
      "حول تطوير نموذج لتقسيم مصادر الزلازل لأغراض تقييم المخاطر الزلزالية في غرب المملكة العربية السعودية",
    authors: "Zahran H.M., Sokolov V., Roobol M.J., Stewart I.C.F., El-Hadidy S.Y., El-Hadidy M.",
    journal: "Journal of Seismology",
    year: 2016,
    type: "Journal Article",
    area: "Seismic Hazard Assessment",
    doi: "10.1007/s10950-016-9555-y",
    url: "https://www.researchgate.net/publication/292342309_On_the_development_of_a_seismic_source_zonation_model_for_seismic_hazard_assessment_in_western_Saudi_Arabia",
  },
  {
    id: "pub-27",
    title:
      "The lithospheric shear-wave velocity structure of Saudi Arabia: Young volcanism in an old shield",
    titleAr:
      "بنية سرعة موجات القص في الغلاف الصخري للمملكة العربية السعودية: نشاط بركاني حديث في درع قديم",
    authors: "Zahran H.M. et al.",
    journal: "Tectonophysics",
    year: 2016,
    type: "Journal Article",
    area: "Seismology",
    url: "https://repository.kaust.edu.sa/items/cfed2960-8faa-4fe8-8ba8-f45da6bd62b6",
  },
  {
    id: "pub-28",
    title:
      "Broad accommodation of rift-related extension recorded by dyke intrusion in Saudi Arabia",
    titleAr:
      "استيعاب واسع للتمدد المرتبط بالتصدع سجلته التداخلات الجيرية (الديايك) في المملكة العربية السعودية",
    authors: "Zahran H.M. et al.",
    journal: "Nature Geoscience",
    year: 2010,
    type: "Journal Article",
    area: "Geophysics",
    url: "https://www.researchgate.net/publication/252322351_Broad_accommodation_of_rift-related_extension_recorded_by_dyke_intrusion_in_Saudi_Arabia",
  },
  {
    id: "pub-29",
    title: "The Saudi National Seismic Network",
    titleAr: "الشبكة الوطنية السعودية لرصد الزلازل",
    authors: "Zahran H.M. et al.",
    journal: "Seismological Research Letters",
    year: 2007,
    type: "Journal Article",
    area: "Seismology",
    url: "https://pubs.geoscienceworld.org/ssa/srl/article-abstract/78/4/439/143376/The-Saudi-National-Seismic-Network",
  },
  {
    id: "pub-30",
    title:
      "Gamma-Ray Exposure Maps From Airborne Spectrometric Data (Open-File Report SGS-OF-2006-9)",
    titleAr: "خرائط التعرض لأشعة غاما من بيانات المطيافية الجوية (تقرير مفتوح رقم SGS-OF-2006-9)",
    authors: "Zahran H.M., Stewart I.C.F.",
    journal: "Saudi Geological Survey",
    year: 2006,
    type: "Report",
    area: "Geophysics",
  },
  {
    id: "pub-31",
    title: "Aeromagnetic-anomaly maps of central and western Saudi Arabia",
    titleAr: "خرائط الشذوذ المغناطيسي الجوي لوسط وغرب المملكة العربية السعودية",
    authors: "Zahran H.M., Stewart I.C.F., Johnson P.R., Basahel M.H.",
    journal: "Saudi Geological Survey",
    year: 2003,
    type: "Report",
    area: "Geophysics",
    url: "https://www.academia.edu/88319699/Aeromagnetic_data_over_Harrat_Lunayyir_and_surrounding_areas_western_Saudi_Arabia",
  },
  {
    id: "pub-32",
    title:
      "The Ar Rayn Terrane: Geotectonic Implications of Unique Metallogeny in the Arabian Shield (Report SGS-OF-2002-8)",
    titleAr:
      "إقليم الرين: الدلالات الجيوتكتونية لتكوين معدني فريد في الدرع العربي (تقرير رقم SGS-OF-2002-8)",
    authors: "Zahran H.M. et al.",
    journal: "Saudi Geological Survey",
    year: 2001,
    type: "Report",
    area: "Mineral Exploration",
    url: "https://www.researchgate.net/publication/238382833_The_Ar_Rayn_Terrane_Geotectonic_Implications_of_Unique_Metallogeny_in_the_Arabian_Shield",
  },
  {
    id: "pub-33",
    title:
      "Detail mineral exploration studies in Shatban prospect, Western Saudi Arabia (Master Thesis)",
    titleAr:
      "دراسات تفصيلية للتنقيب عن المعادن في موقع شطبان الواعد، غرب المملكة العربية السعودية (رسالة ماجستير)",
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
  titleAr?: string;
  source: string;
  date: string;
  type: "Interview" | "Article" | "Video" | "News Feature" | "Other";
  description?: string;
  videoUrl?: string;
  articleUrl?: string;
  thumbnail?: string;
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
    featured: true,
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
    thumbnail: "https://garbnews.net/contents/newsm/81392_0.jpg",
    featured: true,
  },
  {
    id: "media-9",
    title: '"المساحة الجيولوجية": الزلزال الذي حدث وسط البحر الأحمر ضعيف جدا ولا تأثير له',
    source: "Al-Madina",
    date: "Jul 28, 2024",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/897748/",
    thumbnail:
      "https://cdnx.premiumread.com/?url=https://www.al-madina.com/uploads/images/2024/07/28/thumbs/2327733.jpg&w=800&q=100&f=jpg",
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
    thumbnail:
      "https://pbs.twimg.com/amplify_video_thumb/1806659330583740417/img/5Rl8ssxIuGVS9hWN.jpg",
  },
  {
    id: "media-12",
    title: "فيديو | مدير مركز الأزمات والكوارث",
    source: "Alekhbariya TV",
    date: "Jul 27, 2024",
    type: "News Feature",
    articleUrl: "https://x.com/alekhbariyatv/status/1817285826893504777",
    thumbnail:
      "https://pbs.twimg.com/amplify_video_thumb/1806659330583740417/img/5Rl8ssxIuGVS9hWN.jpg",
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
    title: '"المساحة الجيولوجية": دول الخليج العربي بعيدة عن نشاط الزلازل المدمرة',
    source: "Watan",
    date: "Mar 6, 2023",
    type: "News Feature",
    articleUrl: "https://ksa-wats.com/592630",
  },
  {
    id: "media-15",
    title: "Saudi Arabia plans 50 seismic stations in 3 years",
    titleAr: "السعودية تخطط لإنشاء 50 محطة رصد زلزالي خلال 3 سنوات",
    source: "Arab News",
    date: "Dec 2, 2018",
    type: "News Feature",
    articleUrl: "https://www.arabnews.com/node/1414586/saudi-arabia",
    featured: true,
  },
  {
    id: "media-16",
    title: '"زهران" يكشف سبب الهزات الأرضية بأملج ويتوقع استمرارها لفترة بلا خطورة',
    source: "Sabq",
    date: "Nov 12, 2018",
    type: "News Feature",
    articleUrl: "https://sabq.org/saudia/prkmxt",
    thumbnail:
      "https://imagedelivery.net/nU9Yamkp250UHNYBIVAE6w/29ea9a4c-2047-403c-8d68-006390476100/public",
  },
  {
    id: "media-17",
    title: "هيئة المساحة الجيولوجية توضح أسباب الهزات الأرضية في أملج",
    source: "Al-Madina",
    date: "Nov 12, 2018",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/598414/",
    thumbnail:
      "https://cdnx.premiumread.com/?url=https://www.al-madina.com/uploads/images/2018/11/12/1508100.jpg&w=800&q=100&f=jpg",
  },
  {
    id: "media-18",
    title: "هاني زهران لـ «عكاظ»: لا صحة لما تم تداوله عن زلزال قادم بقوة 5 درجات",
    source: "Okaz",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://www.okaz.com.sa/local/na/1586658",
    thumbnail: "https://www.okaz.com.sa/uploads/images/2017/11/04/573864.jpg",
  },
  {
    id: "media-19",
    title: "مدير عام المركز الوطني للزلازل يكشف عن عدد الزلازل التي شهدتها النماص",
    source: "Wtniaat",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://www.wtniaat.com/news-action-s-id-20561.htm",
    thumbnail: "https://www.wtniaat.com/contents/newsm/20561_0.jpg",
  },
  {
    id: "media-20",
    title: 'زلزال ثان يضرب "النماص" السعودية',
    source: "Elaph",
    date: "Nov 4, 2017",
    type: "News Feature",
    articleUrl: "https://elaph.com/Web/News/2017/11/1175282.html",
    thumbnail: "https://s1.elaph.com/resources/images/Politics/2017/11/week1/namas.jpg",
  },
  {
    id: "media-21",
    title: 'مدير عام المركز الوطني للزلازل: اتهام الدكتور عشقي "مرفوض"',
    source: "Okaz",
    date: "Oct 18, 2017",
    type: "News Feature",
    articleUrl: "https://www.okaz.com.sa/local/na/1581650",
    thumbnail: "https://www.okaz.com.sa/uploads/images/2017/10/18/550560.png",
  },
  {
    id: "media-22",
    title: '"زهران" ينفي شائعة حدوث زلزال ضخم بالمنطقة',
    source: "Slaati",
    date: "2017",
    type: "News Feature",
    articleUrl: "https://slaati.com/2017/11/14/p914215.html",
    thumbnail:
      "https://cp.slaati.com//wp-content/uploads/2017/11/d62ded44-8224-400a-a182-60eb4595886d.jpg",
  },
  {
    id: "media-23",
    title: '"زهران": دراسة تتوقع تعرض "حرة الشاقة" لهزات أرضية',
    source: "mz-mz",
    date: "2017",
    type: "News Feature",
    articleUrl: "https://mz-mz.net/1005347/",
    thumbnail: "https://mz-mz.net/wp-content/up/5a7b31e74486b.jpg",
  },
  {
    id: "media-24",
    title: "30 هزة أرضية تراوحت قوتها بين ١ و ٤,٤ درجة على مقياس ريختر",
    source: "Alyaum",
    date: "Jun 28, 2015",
    type: "News Feature",
    articleUrl: "https://www.alyaum.com/articles/1014940/",
    thumbnail: "https://www.alyaum.com/uploads/imported_images/media/article/28_dnmcz39.jpg",
  },
  {
    id: "media-25",
    title: "73 quakes west of Umluj in one week",
    titleAr: "73 هزة أرضية غرب أملج خلال أسبوع واحد",
    source: "Saudi Gazette",
    date: "Jan 18, 2015",
    type: "News Feature",
    articleUrl: "https://saudigazette.com.sa/article/110056",
    featured: true,
  },
  {
    id: "media-26",
    title: '62 زلزالاً بـ "جازان" تُثير المواطنين',
    source: "Elaph",
    date: "Aug 5, 2014",
    type: "News Feature",
    articleUrl: "https://www.sarayanews.com/article/267053",
    thumbnail: "https://www.sarayanews.com/image.php?token=c8b512961f5939ec09a15c165aac3020",
  },
  {
    id: "media-27",
    title: "هزة أرضية بقوة 3.7 جنوب السعودية",
    source: "Sky News Arabia",
    date: "Aug 4, 2014",
    type: "News Feature",
    articleUrl: "https://www.skynewsarabia.com/middle-east/678825",
    thumbnail: "https://www.skynewsarabia.com/images/v1/2013/10/12/459171/1200/630/1-459171.jpg",
  },
  {
    id: "media-28",
    title: "السعودية.. هزة أرضية ثالثة وإرشادات رسمية للتعامل معها",
    source: "CNN Arabic",
    date: "Jan 26, 2014",
    type: "News Feature",
    articleUrl: "https://arabic.cnn.com/middleeast/2014/01/26/saudiearthquake",
    thumbnail:
      "https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1100,h_578,c_fill,q_auto,g_center/t_cnnarabic_watermark_logo_v5/cnnarabic/2014/01/26/images/56285.jpg",
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
    titleAr: "السعودية تنشئ 50 محطة إضافية لرصد الزلازل",
    source: "Arab News",
    date: "Dec 19, 2013",
    type: "News Feature",
    articleUrl: "https://www.arabnews.com/news/495066",
    thumbnail:
      "https://www.arabnews.com/sites/default/files/styles/watermark_670x423/public/media/19/12/2013/1387395850479077100.jpg?itok=WymW1nmU",
    featured: true,
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
    title: 'التفاف كامل بين المسؤولين والمواطنين لاحتواء "هزات العيص"',
    source: "Al Madina",
    date: "Aug 14, 2010",
    type: "News Feature",
    articleUrl: "https://www.al-madina.com/article/42979/",
    thumbnail:
      "https://cdnx.premiumread.com/?url=https://www.al-madina.com/uploads/imported_images/sa/_0/sa_0.jpg&w=800&q=100&f=jpg",
  },
  {
    id: "media-34",
    title: "« الجيولوجية»: إلغاء قرار عودة سكان العيص",
    source: "Al Eqtisadiah",
    date: "Jun 28, 2009",
    type: "News Feature",
    articleUrl: "https://www.aleqt.com/2009/06/28/article_245322.html",
    thumbnail:
      "https://static.aleqt.com/https://archive-files.aleqt.com/a/245322_42086.jpg?w=800&q=75",
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
    title: '2300 زلزال سنويًّا بالشرقية السعودية نتيجة "سحب" البترول',
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
  degreeAr: string;
  field: string;
  fieldAr: string;
  university: string;
  universityAr: string;
  location: string;
  locationAr: string;
  year: string;
  description?: string;
  descriptionAr?: string;
};

const KAU = "King Abdulaziz University";
const KAU_AR = "جامعة الملك عبدالعزيز";
const JEDDAH = "Jeddah, Saudi Arabia";
const JEDDAH_AR = "جدة، المملكة العربية السعودية";

export const education: EducationEntry[] = [
  {
    degree: "PhD",
    degreeAr: "دكتوراه",
    field: "Geophysics and Seismology",
    fieldAr: "الجيوفيزياء وعلم الزلازل",
    university: KAU,
    universityAr: KAU_AR,
    location: JEDDAH,
    locationAr: JEDDAH_AR,
    year: "2018",
  },
  {
    degree: "MSc",
    degreeAr: "ماجستير",
    field: "Applied Geophysics",
    fieldAr: "الجيوفيزياء التطبيقية",
    university: KAU,
    universityAr: KAU_AR,
    location: JEDDAH,
    locationAr: JEDDAH_AR,
    year: "1999",
    description:
      "Thesis: Detail mineral exploration studies in Shatban prospect, Western Saudi Arabia.",
    descriptionAr:
      "رسالة الماجستير: دراسات تفصيلية للتنقيب عن المعادن في موقع شطبان الواعد، غرب المملكة العربية السعودية.",
  },
  {
    degree: "BSc",
    degreeAr: "بكالوريوس",
    field: "Applied Geophysics",
    fieldAr: "الجيوفيزياء التطبيقية",
    university: KAU,
    universityAr: KAU_AR,
    location: JEDDAH,
    locationAr: JEDDAH_AR,
    year: "1993",
  },
];

export const researchSpecialties: LocalizedItem[] = [
  { en: "Applied Geophysics", ar: "الجيوفيزياء التطبيقية" },
  { en: "Seismic Hazard Assessment", ar: "تقييم المخاطر الزلزالية" },
  { en: "Disaster Risk Reduction", ar: "الحد من مخاطر الكوارث" },
  { en: "Seismology", ar: "علم الزلازل" },
  { en: "Mineral Exploration", ar: "التنقيب عن المعادن" },
  { en: "Geothermal Prospecting", ar: "استكشاف الطاقة الحرارية الأرضية" },
];

export type Membership = { title: string; titleAr: string; period?: string };
export const memberships: Membership[] = [
  {
    title: "Vice Chairman of the Board, Saudi Society for Geoscience",
    titleAr: "نائب رئيس مجلس إدارة الجمعية السعودية لعلوم الأرض",
    period: "2014 – 2023",
  },
  {
    title: "Representative of Saudi Arabia, Global Platform for Disaster Risk Reduction",
    titleAr: "ممثل المملكة العربية السعودية في المنتدى العالمي للحد من مخاطر الكوارث",
  },
  {
    title: "Chief, National Advisory Committee for Earthquakes",
    titleAr: "رئيس اللجنة الاستشارية الوطنية للزلازل",
  },
  {
    title: "Chief, Advisory Committee for Study of Causes and Influence of Earthquakes",
    titleAr: "رئيس اللجنة الاستشارية لدراسة أسباب وتأثيرات الزلازل",
  },
  {
    title: "Participant, National Disaster Risk Reduction Committee",
    titleAr: "عضو مشارك في اللجنة الوطنية للحد من مخاطر الكوارث",
  },
  {
    title: "Member, Saudi Building Code Technical and Seismic Committees",
    titleAr: "عضو اللجان الفنية والزلزالية لكود البناء السعودي",
  },
  {
    title: "Chairman, Saudi Geological Survey Promotion Committee",
    titleAr: "رئيس لجنة الترقيات في الهيئة السعودية للمساحة الجيولوجية",
  },
  {
    title: "Leadership roles, International Geological Conferences",
    titleAr: "أدوار قيادية في المؤتمرات الجيولوجية الدولية",
  },
];

export const activities: LocalizedItem[] = [
  { en: "Saudi National Seismic Network", ar: "الشبكة الوطنية السعودية لرصد الزلازل" },
  {
    en: "Saudi National Strong Motion Network",
    ar: "الشبكة الوطنية السعودية لرصد الحركة الأرضية القوية",
  },
  {
    en: "Seismic hazard map of the Kingdom of Saudi Arabia",
    ar: "خريطة المخاطر الزلزالية للمملكة العربية السعودية",
  },
  {
    en: "Harrat Al-Madinah seismic and volcanic hazard assessment",
    ar: "تقييم المخاطر الزلزالية والبركانية لحرة المدينة المنورة",
  },
  {
    en: "Haramain High-Speed Railway seismic risk assessment",
    ar: "تقييم المخاطر الزلزالية لقطار الحرمين السريع",
  },
  {
    en: "HAZUS earthquake loss estimation studies",
    ar: "دراسات تقدير خسائر الزلازل باستخدام نظام HAZUS",
  },
  {
    en: "Seismic and volcanic activity investigations across Saudi Arabia",
    ar: "دراسات النشاط الزلزالي والبركاني في أنحاء المملكة العربية السعودية",
  },
];

export const languages: LocalizedItem[] = [
  { en: "Arabic", ar: "العربية" },
  { en: "English", ar: "الإنجليزية" },
];

export const interests: LocalizedItem[] = [
  { en: "Academia / Research / Science", ar: "الأوساط الأكاديمية / البحث العلمي / العلوم" },
  { en: "HPC and Data Analysis", ar: "الحوسبة عالية الأداء وتحليل البيانات" },
  { en: "Environment and Natural Hazards", ar: "البيئة والمخاطر الطبيعية" },
  { en: "Industry / Engineering", ar: "الصناعة / الهندسة" },
  { en: "International Collaboration", ar: "التعاون الدولي" },
];

export const socialLinks: { label: string; url: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dr-hani-zahran-b1ba4762/" },
];

export const biography: string[] = [
  "Dr. Hani Mahmoud Zahran is a geophysicist and seismologist with more than three decades of experience across governmental and research sectors. He currently serves as Technical Advisor for the Vice President of Geological Programs at the Saudi Geological Survey.",
  "His career at the Saudi Geological Survey spans more than two decades, including roles as Manager of the Disaster and Crisis Center, Consultant for Earthquakes and Volcanoes, and General Manager of the National Center for Earthquake and Volcanoes (2005–2019), where he led the Kingdom's national seismic and volcanic monitoring programs.",
  "He began his career as a Geophysicist with the French Geological Survey (BRGM) from 1993 to 1999, and has served as a Research Collaborator with the United States Geological Survey (USGS) since 2015. He holds a PhD in Geophysics and Seismology from King Abdulaziz University.",
  '"Understanding the forces that shape our planet not only prepares us for today\'s challenges but also empowers safeguarding the future."',
];
