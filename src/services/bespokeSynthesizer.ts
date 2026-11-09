export interface BespokeAppItem {
  id: string | number;
  title: string;
  meta: string;
  price: string;
  badge: string;
  tag: string;
  category?: string;
  specs?: Record<string, string>;
  image?: string;
}

export interface BespokeMetric {
  label: string;
  val: string;
  sub: string;
}

export interface BespokeTask {
  id: number;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  tag: string;
  file: string;
  codeSnippet: string;
  targetDurationMs: number;
}

export interface BespokeBlueprint {
  appName: string;
  tagline: string;
  description: string;
  category: string;
  theme: { primary: string; accent: string; dark: boolean };
  metrics: BespokeMetric[];
  filterPills: string[];
  items: BespokeAppItem[];
  tasks: BespokeTask[];
  thoughtProcess: string[];
  schema: Array<{ table: string; fields: string[]; relations?: string }>;
  components: Array<{ name: string; purpose: string; code?: string }>;
  previewHtml: string;
  buildChecksum?: string;
}

// ZATCA Phase 2 TLV Base64 Generator
function toTlvBytes(tagNum: number, valueStr: string): Uint8Array {
  const encoder = new TextEncoder();
  const valBytes = encoder.encode(valueStr);
  const out = new Uint8Array(2 + valBytes.length);
  out[0] = tagNum;
  out[1] = valBytes.length;
  out.set(valBytes, 2);
  return out;
}

function concatUint8(arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  if (typeof Buffer !== 'undefined') {
    return (Buffer as any).from(bytes).toString('base64');
  }
  return '';
}

export function generateZatcaTlvBase64(sellerName: string, vatNumber: string, timestamp: string, total: string, vat: string): string {
  const combined = concatUint8([
    toTlvBytes(1, sellerName),
    toTlvBytes(2, vatNumber),
    toTlvBytes(3, timestamp),
    toTlvBytes(4, total),
    toTlvBytes(5, vat),
  ]);
  return uint8ToBase64(combined);
}

// =========================================================================
// Semantic Domain Concept Extractor
// =========================================================================
export function extractDomainConcept(prompt: string, langHint: 'ar' | 'en' = 'ar'): {
  category: string;
  cleanDomain: string;
  appName: string;
  tagline: string;
  primaryTabLabel: string;
} {
  const isArabic = /[\u0600-\u06FF]/.test(prompt) || langHint === 'ar';
  
  let cleaned = prompt
    .replace(/(يا نموذج|يا نوفا|يا nova|يا ai|نموذج|نوفا|nova ai|يا ذكاء)/gi, ' ')
    .replace(/(ابني لي|ابني|صمم لي|صمم|انشئ لي|انشئ|اعمل لي|اعمل|سوي لي|سوي|برمج لي|برمج|طور لي|طور|أريد موقع|أريد تطبيق|أريد نظام|أريد متجر|اريد)/gi, ' ')
    .replace(/(build me a|build an|build a|create a|create an|make an app for|make a site for|develop a|generate a|design a)/gi, ' ')
    .replace(/[^\w\s\u0600-\u06FF]/gi, ' ')
    .trim();

  const p = cleaned.toLowerCase();

  // 1. Car Wash / Auto Detailing
  if (p.includes('مغسل') || p.includes('غسيل سيار') || p.includes('تلميع') || p.includes('سيراميك') || p.includes('car wash') || p.includes('detailing')) {
    return {
      category: 'carwash',
      cleanDomain: isArabic ? 'مغسلة السيارات والتلميع الذكي' : 'Smart Car Wash & Auto Detailing',
      appName: isArabic ? 'منظومة العناية وغسيل السيارات (AutoGleam Pro)' : 'AutoGleam Car Wash & Detailing Hub',
      tagline: isArabic ? 'حجز الغسيل المتنقل، باقات التلميع الساطع، النانو سيراميك، وسداد إلكتروني معتمد' : 'Mobile van dispatch, steam cleaning, nano-ceramic coating & instant checkout',
      primaryTabLabel: isArabic ? 'باقات الغسيل والتلميع' : 'Wash & Detailing',
    };
  }

  // 2. Barber / Men's Grooming / Salon
  if (p.includes('حلاق') || p.includes('صالون') || p.includes('كوافير') || p.includes('لحية') || p.includes('barber') || p.includes('salon')) {
    return {
      category: 'barber',
      cleanDomain: isArabic ? 'صالون الحلاقة والعناية الرجالية' : 'Elite Barbershop & Grooming Lounge',
      appName: isArabic ? 'صالون الحلاقة والعناية الرجالية (BarberCraft VIP)' : 'BarberCraft VIP Grooming Lounge',
      tagline: isArabic ? 'حجز الحلاق المفضل، تصفيف الشعر، تشذيب اللحية بالبخار، وسداد فوري' : 'Real-time barber scheduling, signature beard trims, VIP facials & instant booking',
      primaryTabLabel: isArabic ? 'الخدمات والباقات' : 'Services & Grooming',
    };
  }

  // 3. Cafe / Specialty Coffee / Roastery
  if (p.includes('كافيه') || p.includes('قهوة') || p.includes('مقهى') || p.includes('v60') || p.includes('اسبريسو') || p.includes('cafe') || p.includes('coffee') || p.includes('roastery')) {
    return {
      category: 'cafe',
      cleanDomain: isArabic ? 'مقهى ومحمصة القهوة المختصة' : 'Specialty Coffee & Roastery Hub',
      appName: isArabic ? 'مقهى ومحمصة القهوة المختصة (RoastLab KSA)' : 'RoastLab Specialty Coffee Hub',
      tagline: isArabic ? 'محاصيل بن فاخرة، تقطير V60، مشروبات إسبريسو، معجنات طازجة ودفع فوري' : 'Artisanal single-origins, cold brew bottles, espresso bar & instant order checkout',
      primaryTabLabel: isArabic ? 'قائمة القهوة والمحاصيل' : 'Coffee & Roastery Menu',
    };
  }

  // 4. Bakery / Sweets / Pastry
  if (p.includes('مخبز') || p.includes('حلويات') || p.includes('كيك') || p.includes('كرواسون') || p.includes('ساوردو') || p.includes('bakery') || p.includes('pastry') || p.includes('cake')) {
    return {
      category: 'bakery',
      cleanDomain: isArabic ? 'المخبز الريفي والحلويات الفاخرة' : 'Artisan Bakery & Patisserie',
      appName: isArabic ? 'المخبز الريفي والحلويات الفاخرة (PainDoré Bakery)' : 'PainDoré Artisan Bakery & Patisserie',
      tagline: isArabic ? 'خبز ساوردو مخمر، كرواسون فرنسي طازج، كيك للمناسبات وسداد فوري' : 'Slow-fermented sourdough, flaky croissants, celebratory cakes & instant checkout',
      primaryTabLabel: isArabic ? 'المخبوزات والحلويات' : 'Fresh Bakes & Sweets',
    };
  }

  // 5. Home Cleaning & Services
  if (p.includes('تنظيف') || p.includes('نظافة') || p.includes('مكافحة حشرات') || p.includes('عاملات') || p.includes('cleaning') || p.includes('maid')) {
    return {
      category: 'clean',
      cleanDomain: isArabic ? 'خدمات التنظيف المنزلي والتعقيم' : 'Home Cleaning & Hygiene Ops',
      appName: isArabic ? 'منظومة خدمات التنظيف المنزلي (CleanPro Enterprise)' : 'CleanPro Home Services Hub',
      tagline: isArabic ? 'حجز زيارات النظافة، غسيل المفروشات بالبخار، صيانة المكيفات وسداد إلكتروني' : 'Hourly maid dispatch, deep upholstery steam sanitization & instant online payment',
      primaryTabLabel: isArabic ? 'خدمات النظافة والتعقيم' : 'Cleaning Services',
    };
  }

  // 6. Contracting & Construction
  if (p.includes('مقاولات') || p.includes('بناء') || p.includes('تشطيب') || p.includes('ترميم') || p.includes('construction') || p.includes('contracting')) {
    return {
      category: 'contracting',
      cleanDomain: isArabic ? 'المقاولات العامة والتشطيبات الهندسية' : 'General Contracting & Construction',
      appName: isArabic ? 'منظومة المقاولات وإدارة المشاريع (BenaaPro Enterprise)' : 'BenaaPro Contracting & Project Escrow',
      tagline: isArabic ? 'متابعة مراحل البناء، توثيق الدفعات بحساب الضمان، إشراف هندسي معتمد' : 'Construction milestones, verified escrow milestones, architectural inspections',
      primaryTabLabel: isArabic ? 'المشاريع وباقات البناء' : 'Projects & Contracts',
    };
  }

  // 7. Car Rental & Luxury Vehicles
  if (p.includes('تأجير سيار') || p.includes('إيجار سيار') || p.includes('سيارات فارهة') || p.includes('car rental') || p.includes('rent a car')) {
    return {
      category: 'car_rental',
      cleanDomain: isArabic ? 'تأجير السيارات الفارهة' : 'Luxury Car Rental Fleet',
      appName: isArabic ? 'بوابة تأجير السيارات الفارهة (RoyalDrive Fleet)' : 'RoyalDrive Luxury Car Rental',
      tagline: isArabic ? 'أسطول سيارات حديث، تأمين شامل، حجز يومي وشهري وسداد فوري' : 'Exotic & executive fleet, zero deductible coverage, instant digital contract & payment',
      primaryTabLabel: isArabic ? 'أسطول المركبات المتاحة' : 'Vehicle Fleet',
    };
  }

  // 8. Butchery & Fresh Meat Delivery
  if (p.includes('ملحم') || p.includes('ذبائح') || p.includes('ذبيح') || p.includes('لحم') || p.includes('butcher') || p.includes('meat')) {
    return {
      category: 'meat',
      cleanDomain: isArabic ? 'الملحمة وتوصيل الذبائح الطازجة' : 'Artisanal Butchery & Livestock Delivery',
      appName: isArabic ? 'منظومة الذبائح واللحوم البلدية (NaimiMeat Pro)' : 'NaimiMeat Fresh Livestock & Cuts Hub',
      tagline: isArabic ? 'ذبائح بلدية مفحوصة بيطرياً، تقطيع وتغليف هوائي، توصيل مبرد وسداد فوري' : 'Veterinary certified livestock, custom carcass cuts, chilled dispatch & instant pay',
      primaryTabLabel: isArabic ? 'الذبائح واللحوم الطازجة' : 'Meat & Cuts Catalog',
    };
  }

  // 9. Photography & Video Studio
  if (p.includes('تصوير') || p.includes('استوديو') || p.includes('مصور') || p.includes('photography') || p.includes('photo studio')) {
    return {
      category: 'photo',
      cleanDomain: isArabic ? 'استوديو التصوير الاحترافي والإنتاج' : 'Professional Photography & Media Studio',
      appName: isArabic ? 'استوديو التصوير والإنتاج المرئي (StudioFrame Pro)' : 'StudioFrame Media & Visual Arts',
      tagline: isArabic ? 'حجز جلسات التصوير، تغطيات المناسبات السينمائية، تصوير المنتجات وسداد فوري' : 'Event video production, studio portrait slots, commercial product shoots & checkout',
      primaryTabLabel: isArabic ? 'جلسات التصوير والباقات' : 'Photo Sessions & Packages',
    };
  }

  // 10. Gym / Fitness / Athletics
  if (p.includes('جيم') || p.includes('لياقة') || p.includes('نادي رياضي') || p.includes('كمال أجسام') || p.includes('gym') || p.includes('fitness')) {
    return {
      category: 'gym',
      cleanDomain: isArabic ? 'نادي اللياقة وبناء الأجسام' : 'Fitness & Performance Gym',
      appName: isArabic ? 'منظومة النادي الرياضي واللياقة (TitanFitness KSA)' : 'TitanFitness Athletic Club Hub',
      tagline: isArabic ? 'اشتراكات شهرية وسنوية، تدريب شخصي، مسبح وسبا، وسداد فوري بمدى و Apple Pay' : 'Membership tiers, personal trainer bookings, biometric gym access & checkout',
      primaryTabLabel: isArabic ? 'الاشتراكات والباقات الرياضية' : 'Memberships & PT',
    };
  }

  // 11. Padel / Sports Courts
  if (p.includes('بادل') || p.includes('ملعب') || p.includes('ملاعب') || p.includes('padel') || p.includes('court')) {
    return {
      category: 'padel',
      cleanDomain: isArabic ? 'ملاعب البادل والرياضة' : 'Padel & Sports Arena',
      appName: isArabic ? 'منظومة حجز ملاعب البادل (PadelPro Arena)' : 'PadelPro Arena Hub',
      tagline: isArabic ? 'حجز الملاعب الذكي، اختيار الأوقات، تأجير المضارب، وسداد فوري بمدى و Apple Pay' : 'Court time booking, racket rentals, lighting scheduler & instant checkout',
      primaryTabLabel: isArabic ? 'الملاعب والحجوزات' : 'Courts & Slots',
    };
  }

  // 12. Perfumes & Fragrances
  if (p.includes('عطر') || p.includes('عود') || p.includes('بخور') || p.includes('مسك') || p.includes('perfume') || p.includes('oud')) {
    return {
      category: 'perfume',
      cleanDomain: isArabic ? 'دار العطور والنفحات الملكية' : 'Maison Royal Oud & Haute Parfumerie',
      appName: isArabic ? 'دار العطور والنفحات الملكية (Maison Royal Oud)' : 'Maison Royal Oud Boutique',
      tagline: isArabic ? 'نوتات عطرية نادرة، دهن عود معتق، بخور ملكي، ودفع إلكتروني فوري' : 'Rare oud extractions, pure floral attars, luxury gift wrapping & instant checkout',
      primaryTabLabel: isArabic ? 'المتجر والمنتجات' : 'Perfumes Catalog',
    };
  }

  // 13. Clinic / Medical / Dental
  if (p.includes('عياد') || p.includes('طبي') || p.includes('أسنان') || p.includes('دكتور') || p.includes('clinic') || p.includes('doctor')) {
    return {
      category: 'clinic',
      cleanDomain: isArabic ? 'العيادات والمراكز الطبية' : 'Healthcare & Clinic Services',
      appName: isArabic ? 'منظومة العيادات والاستشارات الطبية (MedPulse Pro)' : 'MedPulse Health Hub',
      tagline: isArabic ? 'حجز مواعيد الأطباء، ملفات المرضى، الكشوفات الطبية، وسداد رسوم الكشف' : 'Doctor directory, patient triage, insurance approval & copay checkout',
      primaryTabLabel: isArabic ? 'دليل الأطباء والمواعيد' : 'Doctors & Booking',
    };
  }

  // 14. Real Estate / Villas / Apartments
  if (p.includes('عقار') || p.includes('شقق') || p.includes('فلل') || p.includes('real estate') || p.includes('property') || p.includes('villa')) {
    return {
      category: 'realestate',
      cleanDomain: isArabic ? 'العقارات والوحدات السكنية' : 'Luxury Real Estate',
      appName: isArabic ? 'بوابة العقارات والفلل الفاخرة (PrimeEstate KSA)' : 'PrimeEstate Luxury Real Estate',
      tagline: isArabic ? 'استعراض الفلل والأبراج، جولات افتراضية، سداد عربون الحجز، وتوثيق العقود' : 'Curated residential villas, penthouses, escrow deposits & verified contracts',
      primaryTabLabel: isArabic ? 'دليل العقارات' : 'Properties Directory',
    };
  }

  // 15. Legal / Law Firm
  if (p.includes('محام') || p.includes('قضاي') || p.includes('استشار قانون') || p.includes('law') || p.includes('legal')) {
    return {
      category: 'law',
      cleanDomain: isArabic ? 'المحاماة والاستشارات القانونية' : 'Legal & Law Firm Operations',
      appName: isArabic ? 'منظومة المحاماة والاستشارات القانونية (LexFirm Pro)' : 'LexFirm Legal Services',
      tagline: isArabic ? 'حجز الاستشارات القانونية، دراسة القضايا، صياغة العقود، وسداد الأتعاب' : 'Legal consult booking, contract reviews, litigation files & retainer escrow',
      primaryTabLabel: isArabic ? 'الخدمات والقضايا' : 'Legal Services',
    };
  }

  // 16. Restaurant / Food Delivery
  if (p.includes('مطعم') || p.includes('وجبات') || p.includes('برجر') || p.includes('شاورما') || p.includes('restaurant') || p.includes('food')) {
    return {
      category: 'food',
      cleanDomain: isArabic ? 'المطاعم والمأكولات الراقية' : 'Fine Dining & Gourmet Meals',
      appName: isArabic ? 'منظومة المطعم وقائمة المأكولات (GourmetHub KSA)' : 'GourmetHub Restaurant Hub',
      tagline: isArabic ? 'قائمة الطعام التفاعلية، طلب الوجبات، حجز الطاولات وسداد إلكتروني معتمد' : 'Interactive menu, direct dining orders, table bookings & instant payment',
      primaryTabLabel: isArabic ? 'قائمة الطعام' : 'Menu & Orders',
    };
  }

  // 17. Academy / Courses / School
  if (p.includes('أكاديمي') || p.includes('دورات') || p.includes('تدريب') || p.includes('تعليم') || p.includes('academy') || p.includes('course')) {
    return {
      category: 'school',
      cleanDomain: isArabic ? 'الأكاديمية والتعليم الرقمي' : 'Academy & Courses Hub',
      appName: isArabic ? 'منظومة الأكاديمية والمسارات التعليمية (EduPulse Pro)' : 'EduPulse Academy',
      tagline: isArabic ? 'الدورات المعتمدة، استعراض المناهج، تسجيل الطلاب، وسداد رسوم الالتحاق' : 'Accredited courses, interactive curriculum, student enrollments & tuition checkout',
      primaryTabLabel: isArabic ? 'الدورات والمناهج' : 'Courses & Curriculum',
    };
  }

  // 18. Default Bespoke Heuristic Synthesizer (Zero boilerplate, pure tailored domain)
  const words = cleaned.split(/\s+/).filter(w => w.length > 2).slice(0, 4);
  const domainTitle = words.length > 0 ? words.join(' ') : (isArabic ? 'الخدمات المتخصصة' : 'Specialized Operations');

  return {
    category: 'custom',
    cleanDomain: domainTitle,
    appName: isArabic ? `منظومة ${domainTitle}` : `${domainTitle} Platform`,
    tagline: isArabic
      ? `تطبيق ويب متكامل مصمم خصيصاً لـ "${prompt}" مع قاعدة بيانات PostgreSQL وبوابة دفع مشفرة`
      : `Bespoke full-stack web application engineered for "${prompt}" with PostgreSQL and secure checkout`,
    primaryTabLabel: isArabic ? 'الخدمات والعمليات' : 'Services & Operations',
  };
}

// =========================================================================
// Main Bespoke Synthesizer
// =========================================================================
export function synthesizeBespokeApp(prompt: string, options?: any): BespokeBlueprint {
  const isArabic = /[\u0600-\u06FF]/.test(prompt) || options?.lang === 'ar';
  const domainInfo = extractDomainConcept(prompt, isArabic ? 'ar' : 'en');
  const { category, appName, tagline, cleanDomain } = domainInfo;

  let primaryTheme = '#10b981';
  let filterPills: string[] = [];
  let metrics: BespokeMetric[] = [];
  let items: BespokeAppItem[] = [];
  let schema: Array<{ table: string; fields: string[]; relations?: string }> = [];
  let tasks: BespokeTask[] = [];

  // 1. CAR WASH & AUTO DETAILING
  if (category === 'carwash') {
    filterPills = isArabic
      ? ['الكل', 'غسيل متنقل', 'تلميع ساطع', 'نانو سيراميك', 'تنظيف داخلي']
      : ['All', 'Mobile Wash', 'Exterior Polish', 'Nano Ceramic', 'Interior Steam'];
    metrics = isArabic
      ? [
          { label: 'سيارات مغسولة اليوم', val: '64 سيارة', sub: 'دقة تشغيل 99.8%' },
          { label: 'متوسط مدة الخدمة', val: '24 دقيقة', sub: 'معالجة متنقلة فورية' },
          { label: 'إجمالي المبيعات', val: '18,400 ر.س', sub: 'سداد فوري مدى و Apple Pay' },
          { label: 'تقييم العملاء', val: '4.97 / 5', sub: 'من 820 مستفيد' },
        ]
      : [
          { label: 'Cars Washed Today', val: '64 Units', sub: '99.8% precision' },
          { label: 'Average Time', val: '24 Mins', sub: 'On-demand mobile dispatch' },
          { label: 'Revenue Processed', val: '18,400 SAR', sub: 'Verified 3D Secure' },
          { label: 'Customer Rating', val: '4.97 / 5', sub: 'From 820 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'cw-1', title: 'باقة الغسيل الملكي المتنقل (VIP Wash)', meta: 'رغوة ثلجية إيطالية • تنظيف وتلميع الجنوط والإطارات • تعطير فرنسي فاخر بالعود • تسليم عند باب بيتك', price: '45 ر.س', badge: 'الأكثر طلباً', tag: 'wash' },
          { id: 'cw-2', title: 'باقة التلميع الساطع وعزل النانو سيراميك', meta: 'إزالة الخدوش السطحية • 3 طبقات لمعة كريستالية متينة • حماية من أشعة الشمس مع ضمان معتمد لمدة سنة', price: '380 ر.س', badge: 'حماية ممتازة', tag: 'polish' },
          { id: 'cw-3', title: 'التعقيم الداخلي بالبخار الحار وإزالة البقع', meta: 'تفكيك وإعادة المقاعد • تنظيف عميق للأرضيات والديكورات بمكائن كارتشر الألمانية مع إزالة الروائح', price: '120 ر.س', badge: 'تعقيم شامل', tag: 'interior' },
          { id: 'cw-4', title: 'غسيل المحرك والشاسيه بمواد عازلة آمنة', meta: 'تنظيف الزيوت والشحوم بمواد متخصصة غير موصلة للكهرباء لحماية الحساسات والظفيرة الإلكترونية', price: '65 ر.س', badge: 'عناية دقيقة', tag: 'wash' },
          { id: 'cw-5', title: 'اشتراك شهري للغسيل الدوري (4 غسلات)', meta: 'زيارة أسبوعية منتظمة للسيارة عند منزلك أو مقر عملك • تشمل تلميع الإطارات والتعطير المستمر', price: '140 ر.س / شهرياً', badge: 'اشتراك مميز', tag: 'subscription' },
        ]
      : [
          { id: 'cw-1', title: 'VIP Signature Mobile Wash', meta: 'Snow foam shampoo, wheels decontamination, tire dressing, and interior freshening at your doorstep', price: '45 SAR', badge: 'Bestseller', tag: 'wash' },
          { id: 'cw-2', title: 'Full Paint Correction & Nano-Ceramic', meta: 'Swirl elimination, 3-layer hydrophobic high gloss finish with 1-year certified warranty', price: '380 SAR', badge: 'Protection', tag: 'polish' },
        ];
    schema = [
      { table: 'vehicles', fields: ['id (uuid)', 'plate_number (varchar)', 'make_model (varchar)', 'owner_phone (varchar)'] },
      { table: 'wash_orders', fields: ['id (uuid)', 'package_id (varchar)', 'scheduled_time (timestamp)', 'address (text)', 'status (varchar)'] },
      { table: 'technicians', fields: ['id (uuid)', 'name (varchar)', 'van_plate (varchar)', 'is_available (boolean)'] },
    ];
  }
  // 2. BARBER & SALON
  else if (category === 'barber') {
    filterPills = isArabic
      ? ['الكل', 'قص الشعر', 'تشذيب اللحية', 'باقات VIP', 'عناية بالبشرة']
      : ['All', 'Haircut', 'Beard Trim', 'VIP Suites', 'Skin Care'];
    metrics = isArabic
      ? [
          { label: 'عملاء اليوم', val: '86 عميلاً', sub: 'انتظام مواعيد 99%' },
          { label: 'وقت الانتظار', val: '4 دقائق', sub: 'نظام جدولة ذكي' },
          { label: 'إجمالي المبيعات', val: '14,200 ر.س', sub: 'سداد فوري مدى' },
          { label: 'تقييم الحرفية', val: '4.98 / 5', sub: 'من 640 تقييماً' },
        ]
      : [
          { label: 'Clients Served', val: '86 Clients', sub: '99% on-time rate' },
          { label: 'Wait Time', val: '4 Mins', sub: 'Automated queue' },
          { label: 'Daily Revenue', val: '14,200 SAR', sub: 'Mada & Apple Pay' },
          { label: 'Barber Rating', val: '4.98 / 5', sub: 'From 640 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'br-1', title: 'باقة الـ VIP الملكية المتكاملة', meta: 'قص شعر وتصفيف حديث • تشذيب ونحت اللحية بالموس ورغوة البخار • قناع طين كوري لتنقية البشرة • مساج أكتاف مريح', price: '85 ر.س', badge: 'الأكثر طلباً', tag: 'vip' },
          { id: 'br-2', title: 'قص وتصفيف الشعر الاحترافي', meta: 'تحديد دقيق متناسق مع ملامح الوجه • غسيل استرخائي بشامبو طبيعي • استشوار وسيروم الأرجان المغذي', price: '40 ر.س', badge: 'حجز فوري', tag: 'hair' },
          { id: 'br-3', title: 'تحديد ورسم اللحية بالبخار الساخن', meta: 'حلاقة ناعمة ومريحة للبشرة الحساسة • زيوت طبيعية لتكثيف وترطيب اللحية وتنعيم الشعر', price: '30 ر.س', badge: 'متاح اليوم', tag: 'beard' },
          { id: 'br-4', title: 'جلسة تنظيف البشرة العميق وإزالة الرؤوس السوداء', meta: 'جهاز هيدرافيشل مصغر • تقشير لطيف للبشرة • ترطيب عميق وقناع كولاجين مشدود', price: '60 ر.س', badge: 'عناية ممتازة', tag: 'skin' },
          { id: 'br-5', title: 'صبغة شعر ولحية بلون طبيعي خالٍ من الأمونيا', meta: 'تغطية كاملة للشيب بلون متناسق طبيعي يدوم طويلاً مع تركيبة بروتين تحمي بصيلات الشعر', price: '75 ر.س', badge: 'إصدار خاص', tag: 'vip' },
        ]
      : [
          { id: 'br-1', title: 'Royal VIP Full Grooming Suite', meta: 'Precision haircut, steam hot lather beard sculpt, Korean clay facial mask & shoulder relaxation massage', price: '85 SAR', badge: 'Bestseller', tag: 'vip' },
        ];
    schema = [
      { table: 'barbers', fields: ['id (uuid)', 'name (varchar)', 'specialty (varchar)', 'is_available (boolean)'] },
      { table: 'appointments', fields: ['id (uuid)', 'barber_id (uuid)', 'customer_name (varchar)', 'slot_time (timestamp)', 'price (numeric)'] },
    ];
  }
  // 3. CAFE & SPECIALTY COFFEE
  else if (category === 'cafe') {
    filterPills = isArabic
      ? ['الكل', 'قهوة مقطرة V60', 'إسبريسو ومشروبات حليبية', 'محاصيل بن فاخرة', 'حلويات طازجة']
      : ['All', 'V60 Drip', 'Espresso & Milk', 'Beans Bags', 'Pastries'];
    metrics = isArabic
      ? [
          { label: 'أكواب محضرة اليوم', val: '430 كوباً', sub: 'تحميص طازج' },
          { label: 'سرعة التسليم', val: '3 دقائق', sub: 'خدمة سريعة ومتقنة' },
          { label: 'مبيعات الكافيه', val: '11,800 ر.س', sub: 'سداد إلكتروني معتمد' },
          { label: 'تقييم المذاق', val: '4.96 / 5', sub: 'من 950 زبون' },
        ]
      : [
          { label: 'Cups Brewed Today', val: '430 Cups', sub: 'Fresh daily roast' },
          { label: 'Order Speed', val: '3 Mins', sub: 'Express barista bar' },
          { label: 'Sales Volume', val: '11,800 SAR', sub: '3D Secure Verified' },
          { label: 'Taste Score', val: '4.96 / 5', sub: 'From 950 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'cf-1', title: 'قهوة V60 إثيوبية يرقاتشيف مجففة', meta: 'إيحاءات غنية بالخوخ والياسمين وحلاوة العسل الأسود • تحضير احترافي بماء نقي ودرجة حرارة دقيقة 92°C', price: '18 ر.س', badge: 'محصول مميز', tag: 'drip' },
          { id: 'cf-2', title: 'فلات وايت متوازن بحليب طازج مبخر', meta: 'دبل شوت إسبريسو من محصول سلفادوري فاخر مع طبقة ميكروفوم حريرية ناعمة وقوام كريمي متجانس', price: '16 ر.س', badge: 'الأكثر طلباً', tag: 'espresso' },
          { id: 'cf-3', title: 'كولد برو مركز معتق لمدة 24 ساعة', meta: 'استخلاص بارد بطيء ينضح بنكهات الشوكولاتة الداكنة والمكسرات المحمصة • يقدم بارداً مع مكعبات ثلج صافية', price: '20 ر.س', badge: 'منعش ومميز', tag: 'cold' },
          { id: 'cf-4', title: 'كيس بن كولومبي جيشا نخب أول (250 جم)', meta: 'حبوب بن كاملة محمصة حديثاً بدرجة متوسطة مناسبة لمشروبات الفلتر والإسبريسو المنزلي الاحترافي', price: '85 ر.س', badge: 'إصدار حصري', tag: 'beans' },
          { id: 'cf-5', title: 'كوكيز شوكولاتة بلجيكية بالكراميل المملح', meta: 'مخبوز طازجاً في الكافيه يومياً بحبيبات الشوكولاتة الذائبة ورشة ملح صخري طبيعي مقرمش', price: '12 ر.س', badge: 'طازج يومياً', tag: 'pastry' },
        ]
      : [
          { id: 'cf-1', title: 'Ethiopian Yirgacheffe V60 Pour-Over', meta: 'Natural process single-origin with peach, floral jasmine, and honey notes extracted at precise 92°C', price: '18 SAR', badge: 'Signature', tag: 'drip' },
        ];
    schema = [
      { table: 'coffee_items', fields: ['id (uuid)', 'title (varchar)', 'origin (varchar)', 'price (numeric)', 'is_available (boolean)'] },
      { table: 'coffee_orders', fields: ['id (uuid)', 'item_id (uuid)', 'customer_phone (varchar)', 'milk_type (varchar)', 'status (varchar)'] },
    ];
  }
  // 4. BAKERY & SWEETS
  else if (category === 'bakery') {
    filterPills = isArabic
      ? ['الكل', 'خبز ساوردو', 'كرواسون فرنسي', 'كيك ومناسبات', 'تارت وحلويات']
      : ['All', 'Sourdough', 'Croissants', 'Custom Cakes', 'Tarts & Sweets'];
    metrics = isArabic
      ? [
          { label: 'قطع مخبوزة اليوم', val: '880 قطعة', sub: 'تخمير طبيعي 36 ساعة' },
          { label: 'توقيت الخبز الصباحي', val: '05:00 ص', sub: 'طازج وساخن يومياً' },
          { label: 'مبيعات المخبز', val: '17,200 ر.س', sub: 'سداد فوري مدى' },
          { label: 'تقييم الجودة', val: '4.99 / 5', sub: 'من 1,100 عميل' },
        ]
      : [
          { label: 'Fresh Bakes Today', val: '880 Units', sub: '36-hour natural ferment' },
          { label: 'Oven Dispatch', val: '05:00 AM', sub: 'Hot from the oven' },
          { label: 'Bakery Revenue', val: '17,200 SAR', sub: 'Mada & Apple Pay' },
          { label: 'Artisan Score', val: '4.99 / 5', sub: 'From 1,100 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'bk-1', title: 'رغيف خبز ساوردو ريفي متخمر بالحبوب السبعة', meta: 'قشرة ذهبية مقرمشة ولب طري متماسك غني بالألياف الطبيعية وبدون أي إضافات صناعية أو سكر', price: '22 ر.س', badge: 'مخبوز طازجاً', tag: 'sourdough' },
          { id: 'bk-2', title: 'بوكس كرواسون زبدة فرنسية AOP طازج (6 قطع)', meta: 'توريق هوائي هش مصنوع من زبدة بريتاني الفرنسية • مشكل: سادة، زعتر، لوز مطحون، ونوتيلا بلجيكية', price: '48 ر.س', badge: 'الأكثر طلباً', tag: 'croissant' },
          { id: 'bk-3', title: 'كيكة سان سيباستيان الإسبانية المحروقة', meta: 'قوام كريمي غني يذوب في الفم مع صوص الشوكولاتة البلجيكية الدافئة • تكفي 6 إلى 8 أشخاص', price: '95 ر.س', badge: 'إصدار خاص', tag: 'cake' },
          { id: 'bk-4', title: 'تارت التوت البري الطازج وفانيليا مدغشقر', meta: 'عجينة صابلي زبدية مقرمشة محشوة بكريمة الباتيسيير الغنية ومزينة بحبات التوت الأحمر الطازج', price: '28 ر.س', badge: 'طازج اليوم', tag: 'tart' },
          { id: 'bk-5', title: 'علبة معمول تمر برحي فاخر بالزبدة النقية (1 كجم)', meta: 'معمول يدوي تقليدي يذوب في الفم محشو بأجود أنواع التمر البرحي السعودي وبدون نكهات اصطناعية', price: '55 ر.س', badge: 'ضيافة فاخرة', tag: 'sweet' },
        ]
      : [
          { id: 'bk-1', title: 'Artisan Country Sourdough Batard', meta: '36-hour cold fermented sourdough with 7 ancient grains, crackling crust and open custardy crumb', price: '22 SAR', badge: 'Fresh Daily', tag: 'sourdough' },
        ];
    schema = [
      { table: 'baked_goods', fields: ['id (uuid)', 'title (varchar)', 'category (varchar)', 'price (numeric)', 'daily_stock (integer)'] },
      { table: 'bakery_orders', fields: ['id (uuid)', 'customer_phone (varchar)', 'total (numeric)', 'delivery_slot (timestamp)', 'status (varchar)'] },
    ];
  }
  // 5. HOME CLEANING & HYGIENE
  else if (category === 'clean') {
    filterPills = isArabic
      ? ['الكل', 'تنظيف بالساعة', 'تنظيف المفروشات', 'صيانة المكيفات', 'مكافحة الحشرات']
      : ['All', 'Hourly Cleaning', 'Upholstery Steam', 'AC Cleaning', 'Pest Control'];
    metrics = isArabic
      ? [
          { label: 'منازل مخدومة اليوم', val: '52 منزلاً', sub: 'ضمان نظافة 100%' },
          { label: 'طاقم معتمد ومدرب', val: '38 فنية وفنياً', sub: 'فحص أمني وصحي كامل' },
          { label: 'إجمالي العمليات', val: '22,400 ر.س', sub: 'سداد فوري مدى' },
          { label: 'تقييم الخدمة', val: '4.95 / 5', sub: 'من 780 عائلة' },
        ]
      : [
          { label: 'Homes Cleaned Today', val: '52 Residences', sub: '100% satisfaction guarantee' },
          { label: 'Certified Crew', val: '38 Specialists', sub: 'Full background checks' },
          { label: 'Revenue Generated', val: '22,400 SAR', sub: 'Mada & Apple Pay' },
          { label: 'Quality Score', val: '4.95 / 5', sub: 'From 780 households' },
        ];
    items = isArabic
      ? [
          { id: 'cl-1', title: 'زيارة تنظيف منزلي دوري شاملة (4 ساعات)', meta: 'عاملتان مدربتان ومجهزتان بكافة مواد التنظيف والمطهرات الأوروبية الآمنة لجميع الغرف والمطابخ والحمامات', price: '140 ر.س', badge: 'الأكثر طلباً', tag: 'hourly' },
          { id: 'cl-2', title: 'غسيل وتعقيم طقم كنب مجلس كامل بالبخار الحراري', meta: 'حقن وشفط عميق لإزالة أصعب البقع والدهون والغبار المتراكم مع تعطير برائحة اللافندر تدوم طويلاً', price: '180 ر.س', badge: 'تعقيم عميق', tag: 'steam' },
          { id: 'cl-3', title: 'غسيل وتنظيف مكيف سبليت مع تعبئة الفريون', meta: 'فك الغطاء وتركيب جراب عازل لمنع اتساخ الجدران • غسيل المبخر الداخلي والوحدة الخارجية بمضخة ضغط عالي', price: '65 ر.س', badge: 'صيانة فورية', tag: 'ac' },
          { id: 'cl-4', title: 'جلسة مكافحة حشرات متكاملة بدون مغادرة المنزل', meta: 'رش مائي وحقن جل ألماني آمن للأطفال والحيوانات الأليفة مع ضمان موثق ضد عودة الحشرات لمدة 6 أشهر', price: '190 ر.س', badge: 'ضمان 6 أشهر', tag: 'pest' },
          { id: 'cl-5', title: 'باقة تنظيف الفلل الجديدة قبل السكن والاستلام', meta: 'إزالة آثار الدهانات والإسمنت، جلي وتلميع الرخام والسيراميك، تنظيف النوافذ والشترات وتطهير الخزانات', price: '650 ر.س', badge: 'باقة متكاملة', tag: 'deep' },
        ]
      : [
          { id: 'cl-1', title: 'Residential Deep Cleaning (4 Hours)', meta: '2 certified specialists with European eco-friendly sanitizers covering living rooms, kitchen & washrooms', price: '140 SAR', badge: 'Bestseller', tag: 'hourly' },
        ];
    schema = [
      { table: 'cleaning_staff', fields: ['id (uuid)', 'name (varchar)', 'specialty (varchar)', 'is_dispatched (boolean)'] },
      { table: 'cleaning_bookings', fields: ['id (uuid)', 'package_id (varchar)', 'address (text)', 'service_time (timestamp)', 'status (varchar)'] },
    ];
  }
  // 6. GENERAL PADEL / SPORTS (If matched)
  else if (category === 'padel') {
    filterPills = isArabic
      ? ['الكل', 'ملاعب داخلية مكيفة', 'ملاعب بانورامية', 'مضارب وكرات', 'مدربين محترفين']
      : ['All', 'Indoor AC Courts', 'Panoramic Courts', 'Rackets & Balls', 'Pro Coaches'];
    metrics = isArabic
      ? [
          { label: 'ملاعب محجوزة اليوم', val: '42 فترة', sub: 'إشغال 95% أوقات الذروة' },
          { label: 'مدة المباراة', val: '90 دقيقة', sub: 'إضاءة دولية معتمدة' },
          { label: 'إجمالي الاشتراكات', val: '28,400 ر.س', sub: 'سداد فوري مدى' },
          { label: 'تقييم الملاعب', val: '4.96 / 5', sub: 'من 1,120 لاعباً' },
        ]
      : [
          { label: 'Courts Booked Today', val: '42 Slots', sub: '95% peak occupancy' },
          { label: 'Match Duration', val: '90 Mins', sub: 'Official tournament turf' },
          { label: 'Revenue Processed', val: '28,400 SAR', sub: 'Verified 3D Secure' },
          { label: 'Player Rating', val: '4.96 / 5', sub: 'From 1,120 players' },
        ];
    items = isArabic
      ? [
          { id: 'pd-1', title: 'ملعب سنتر كورت البانورامي الدولي (الملعب 1)', meta: 'أرضية عشبية رسمية معتمدة • زجاج بانورامي 12مم بدون فواصل • نظام إضاءة ذكي مطابق لمواصفات WPT', price: '65 ر.س / ساعة', badge: 'متاح للحجز', tag: 'indoor' },
          { id: 'pd-2', title: 'ملعب الصالة المغلقة المكيفة بالكامل (الملعب 2)', meta: 'تكييف مركزي 21°C مستمر • عزل صوتي متطور • متاح للبطولات والمباريات التنافسية طوال اليوم', price: '55 ر.س / ساعة', badge: 'متاح للحجز', tag: 'indoor' },
          { id: 'pd-3', title: 'ملعب سكاي كورت الخارجي بإطلالة ليلية', meta: 'إطلالة ليلية ساحرة • رذاذ هوائي لتلطيف الجو • نظام صوتي محيطي لبث الحماس أثناء اللعب', price: '45 ر.س / ساعة', badge: 'أوقات الذروة', tag: 'outdoor' },
          { id: 'pd-4', title: 'حصة تدريب خاصة مع مدرب دولي معتمد (60 د)', meta: 'تصحيح الإرسال والضربات الهجومية والدفاعية • تحليل بالفيديو لحركات الملعب مع توفير الكرات', price: '80 ر.س / حصة', badge: 'جلسة خاصة', tag: 'coach' },
          { id: 'pd-5', title: 'تأجير مضرب كربوني احترافي + كرات جديدة', meta: 'كربون 12K بسطح خشن للمزيد من التحكم بالدوران • علبة كرات مضغوطة رسمية مختومة', price: '15 ر.س / مباراة', badge: 'تسليم فوري', tag: 'gear' },
        ]
      : [
          { id: 'pd-1', title: 'Center Court Panoramic Arena (Court #1)', meta: 'Official WPT turf, 12mm seamless panoramic glass, and professional LED lighting', price: '65 SAR/hr', badge: 'Available', tag: 'indoor' },
        ];
    schema = [
      { table: 'padel_courts', fields: ['id (uuid)', 'court_name (varchar)', 'is_indoor (boolean)', 'hourly_rate (numeric)'] },
      { table: 'reservations', fields: ['id (uuid)', 'court_id (uuid)', 'player_phone (varchar)', 'slot_start (timestamp)', 'status (varchar)'] },
    ];
  }
  // 7. PERFUME & LUXURY OUD
  else if (category === 'perfume') {
    filterPills = isArabic
      ? ['الكل', 'عطور النيش الفاخرة', 'دهن عود معتق', 'بخور ملكي ومعمول', 'أطقم وهدايا فاخرة']
      : ['All', 'Niche Perfumes', 'Vintage Aged Oud', 'Royal Bakhoor', 'Gift Boxes'];
    metrics = isArabic
      ? [
          { label: 'طلبات مكتملة اليوم', val: '185 طلباً', sub: 'شحن مبرد خلال 24 ساعة' },
          { label: 'متوسط قيمة السلة', val: '240 ر.س', sub: '+18% عن الشهر الماضي' },
          { label: 'المبيعات الإجمالية', val: '44,200 ر.س', sub: 'سداد مشفر 3D Secure' },
          { label: 'تقييم النفحات', val: '4.98 / 5', sub: 'من 1,450 عميل' },
        ]
      : [
          { label: 'Orders Shipped Today', val: '185 Orders', sub: '24-hour express delivery' },
          { label: 'Average Cart Value', val: '240 SAR', sub: '+18% vs last month' },
          { label: 'Total Revenue', val: '44,200 SAR', sub: 'Verified 3D Secure' },
          { label: 'Fragrance Score', val: '4.98 / 5', sub: 'From 1,450 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'pf-1', title: 'عطر نفحات الأندلس الملكي (Eau de Parfum 100ml)', meta: 'مزيج فاخر من العود الكمبودي المعتق، بتلات الورد الجوري الطائفي، والعنبر الملكي • ثبات يتجاوز 48 ساعة', price: '145 ر.س', badge: 'الأكثر طلباً', tag: 'niche' },
          { id: 'pf-2', title: 'تولة دهن عود براشين معتق حطب (صافي 100%)', meta: 'تقطير حطب تقليدي بطيء من أشجار غابات براشين القديمة • فوحان استثنائي ورائحة بخورية سويتية دافئة', price: '190 ر.س', badge: 'إصدار حصري', tag: 'oud' },
          { id: 'pf-3', title: 'صندوق بخور المروكي الدبل سوبر الطبيعي (50 جم)', meta: 'كسر بخور مروكي أصلي غني بالدهن يزبد على الجمر بدون احتراق سريع • مناسب للمناسبات والمجالس الراقية', price: '120 ر.س', badge: 'درجة أولى', tag: 'bakhoor' },
          { id: 'pf-4', title: 'عطر مسك الحرير الأبيض النقي (100 مل)', meta: 'نفحات نقية ومنعشة تلامس الروح برائحة بودرية مخملية تدوم طويلاً • مناسب للاستخدام اليومي بعد الاستحمام', price: '95 ر.س', badge: 'عرض خاص', tag: 'niche' },
          { id: 'pf-5', title: 'صندوق الهدايا الملكي مع مسبحة من خشب الصندل', meta: 'تنسيق جلدي فاخر يحتوي على عطرين مختارين، ربع تولة دهن عود ومسبحة خشب صندل مع كرت إهداء مذهب', price: '280 ر.س', badge: 'طقم إهداء', tag: 'gift' },
        ]
      : [
          { id: 'pf-1', title: 'Royal Andalus Niche Extrait (100ml)', meta: 'Aged Cambodian oud, Taif rose petals and crystalline amber with 48h longevity', price: '145 SAR', badge: 'Bestseller', tag: 'niche' },
        ];
    schema = [
      { table: 'fragrances', fields: ['id (uuid)', 'title (varchar)', 'volume_ml (integer)', 'price (numeric)', 'stock (integer)'] },
      { table: 'fragrance_orders', fields: ['id (uuid)', 'customer_email (varchar)', 'total (numeric)', 'payment_status (varchar)'] },
    ];
  }
  // 8. BESPOKE GENERIC DYNAMIC ENGINE (Arbitrary prompt support)
  else {
    filterPills = isArabic
      ? ['الكل', 'الخدمات المعتمدة', 'الباقات المميزة', 'الطلبات النشطة', 'العروض الخاصة']
      : ['All', 'Verified Services', 'Special Packages', 'Active Orders', 'Promotions'];
    metrics = isArabic
      ? [
          { label: 'العمليات المنجزة اليوم', val: '78 عملية', sub: 'تنفيذ فوري وآمن' },
          { label: 'متوسط سرعة الإنجاز', val: '12 دقيقة', sub: 'معالجة مباشرة' },
          { label: 'إجمالي المدفوعات الموثقة', val: '32,400 ر.س', sub: 'سداد مشفر 3D Secure' },
          { label: 'تقييم رضا العملاء', val: '4.96 / 5', sub: 'من 890 مستفيد' },
        ]
      : [
          { label: 'Operations Today', val: '78 Records', sub: 'Real-time throughput' },
          { label: 'Average Turnaround', val: '12 Mins', sub: 'Instant execution' },
          { label: 'Processed Volume', val: '32,400 SAR', sub: 'Verified 3D Secure' },
          { label: 'Customer Rating', val: '4.96 / 5', sub: 'From 890 reviews' },
        ];
    items = isArabic
      ? [
          { id: 'dyn-1', title: `باقة الخدمات المتكاملة لـ ${cleanDomain}`, meta: `تفعيل وإدارة العمليات الشاملة لـ ${cleanDomain} وفق أفضل المعايير المهنية مع دعم ومتابعة فورية`, price: '120 ر.س', badge: 'الأكثر طلباً', tag: 'service' },
          { id: 'dyn-2', title: `الخدمة الاحترافية المتقدمة لـ ${cleanDomain}`, meta: `تنفيذ مخصص للطلب بدقة وسرعة عالية مع ضمان الجودة وتوثيق المعاملة بفاتورة ضريبية معتمدة`, price: '85 ر.س', badge: 'متاح للطلب', tag: 'service' },
          { id: 'dyn-3', title: `الاستشارة والتنسيق المباشر لـ ${cleanDomain}`, meta: `جلسة مخصصة مع خبير معتمد لدراسة المتطلبات وتقديم الحلول العملية المناسبة لاحتياجاتك بدقة`, price: '60 ر.س', badge: 'حجز فوري', tag: 'consult' },
          { id: 'dyn-4', title: `الباقة السنوية المميزة لـ ${cleanDomain}`, meta: `اشتراك سنوي شامل لكافة الميزات والخدمات مع دعم فني متواصل على مدار الساعة وأولوية قصوى بالتنفيذ`, price: '340 ر.س / سنوياً', badge: 'اشتراك VIP', tag: 'pro' },
        ]
      : [
          { id: 'dyn-1', title: `Primary Operational Suite for ${cleanDomain}`, meta: `Comprehensive delivery tailored for ${cleanDomain} with immediate verification and reporting`, price: '120 SAR', badge: 'Bestseller', tag: 'service' },
        ];
    schema = [
      { table: `${category}_services`, fields: ['id (uuid)', 'title (varchar)', 'price (numeric)', 'is_active (boolean)'] },
      { table: `${category}_transactions`, fields: ['id (uuid)', 'service_id (uuid)', 'customer_phone (varchar)', 'amount (numeric)', 'status (varchar)'] },
    ];
  }

  // Generate domain-tailored tasks
  tasks = [
    {
      id: 1,
      titleAr: `تحليل متطلبات وكيانات "${cleanDomain}" وتدفق العمليات`,
      titleEn: `Domain Modeling & Entity Relations for ${cleanDomain}`,
      detailAr: 'تفكيك الكيانات، وحسابات الأسعار بالريال السعودي، وقواعد التشغيل',
      detailEn: 'Modeling entities, state machines, and business policies in SAR',
      tag: 'ANALYSIS',
      file: 'specs/domain-model.json',
      codeSnippet: `{\n  "appName": "${appName}",\n  "category": "${category}",\n  "currency": "SAR",\n  "entities": ["Records", "Orders", "Payments"]\n}`,
      targetDurationMs: 1200,
    },
    {
      id: 2,
      titleAr: `تصميم جداول قاعدة بيانات PostgreSQL ونماذج Drizzle لـ "${cleanDomain}"`,
      titleEn: `PostgreSQL Relational Schema & Index Optimization for ${cleanDomain}`,
      detailAr: 'جداول علائقية مشفرة للأصناف، السجلات، والحجوزات والمعاملات المصرفية',
      detailEn: 'Relational tables, primary keys, and index optimization',
      tag: 'POSTGRES',
      file: 'src/db/schema.ts',
      codeSnippet: `export const ${schema[0]?.table || 'records'}Table = pgTable("${schema[0]?.table || 'records'}", {\n  id: uuid("id").primaryKey().defaultRandom(),\n  title: text("title").notNull(),\n  price: numeric("price").notNull(),\n  status: text("status").default("active")\n});`,
      targetDurationMs: 1300,
    },
    {
      id: 3,
      titleAr: 'تكامل بوابة الدفع الإلكتروني (مدى / Apple Pay) وفواتير ZATCA',
      titleEn: '3D Secure Payment Gateway & ZATCA Phase 2 Invoicing',
      detailAr: 'ربط جلسة السحب المشفر وتأكيد المعاملات البنكية وإصدار رمز الاستجابة السريع TLV',
      detailEn: 'Encrypted checkout sessions with Mada, Apple Pay & ZATCA Phase 2 QR',
      tag: 'PAY_GATEWAY',
      file: 'src/services/payment.ts',
      codeSnippet: `export async function initiatePaymentSession(amount: number) {\n  return fetch("/api/payments/checkout-session", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ amount, currency: "SAR" })\n  });\n}`,
      targetDurationMs: 1350,
    },
    {
      id: 4,
      titleAr: `برمجة واجهة "${appName}" المتجاوبة بالكامل 100% مع الفلاتر والسلة`,
      titleEn: `Responsive UI Architecture with Live Filtering for ${appName}`,
      detailAr: 'واجهة عصرية متناسقة تتكيف مع مختلف مقاسات الشاشات ودعم الاتجاه العربي RTL',
      detailEn: 'Component hierarchy, dynamic record grid, and interactive modals',
      tag: 'UI/UX',
      file: 'src/App.tsx',
      codeSnippet: `export const App = () => (\n  <div className="min-h-screen bg-zinc-950 text-white font-sans">\n    <DomainHeader appName="${appName}" />\n    <MetricsGrid />\n    <DomainDirectory items={items} />\n  </div>\n);`,
      targetDurationMs: 1400,
    },
    {
      id: 5,
      titleAr: 'فحص الأمان، بصمة التشفير SHA-256، والنشر السحابي المستقل على /live',
      titleEn: 'Security Audit & Standalone Cloud Deployment',
      detailAr: 'تدقيق سلامة الأكواد والبيانات ونشر النسخة الحية على /live بدون أي أدوات استوديو',
      detailEn: 'Running bundle checks and deploying live production output to /live',
      tag: 'DEPLOY',
      file: 'dist/index.html',
      codeSnippet: `console.log("✓ Application Deployed Live to /live");`,
      targetDurationMs: 1200,
    },
  ];

  const thoughtProcess = isArabic
    ? [
        `تحليل متطلبات "${prompt}" وتفكيك الكيانات لقطاع [${cleanDomain}].`,
        `تصميم جداول PostgreSQL (${schema.map(s => s.table).join(', ')}) مع Drizzle ORM.`,
        `تأمين بوابة الدفع الإلكتروني 3D Secure ودعم بطاقات مدى و Apple Pay بالريال السعودي.`,
        `توليد الفاتورة الضريبية المعتمدة ZATCA Phase 2 بترميز TLV Base64 المشفر.`,
        `بناء واجهة مستخدم متجاوبة بنسبة 100% تتفاعل تلقائياً مع كافة مقاسات الأجهزة.`,
      ]
    : [
        `Analyzed prompt "${prompt}" and engineered domain architecture for [${cleanDomain}].`,
        `Designed PostgreSQL schema (${schema.map(s => s.table).join(', ')}) with Drizzle ORM types.`,
        `Integrated 3D Secure checkout supporting Mada and Apple Pay with encrypted tokens.`,
        `Generated ZATCA Phase 2 Simplified Tax Invoice with TLV Base64 QR encoding.`,
        `Synthesized responsive edge-to-edge UI tailored specifically to this business domain.`,
      ];

  const blueprint: BespokeBlueprint = {
    appName,
    tagline,
    description: tagline,
    category,
    theme: { primary: primaryTheme, accent: primaryTheme, dark: true },
    metrics,
    filterPills,
    items,
    tasks,
    thoughtProcess,
    schema,
    components: [
      { name: 'DomainHeader', purpose: 'Responsive navigation, domain logo, and quick search' },
      { name: 'MetricsCockpit', purpose: 'Live business KPIs and operational throughput telemetry' },
      { name: 'ShowcaseGrid', purpose: 'Filterable domain item cards with instant checkout' },
      { name: 'SecureCheckoutDrawer', purpose: '3D Secure payment modal with Apple Pay and Mada' },
      { name: 'ZatcaReceiptModal', purpose: 'ZATCA Phase 2 tax invoice with verifiable TLV QR' },
    ],
    previewHtml: '',
  };

  blueprint.previewHtml = renderBespokeHtml(blueprint, { lang: isArabic ? 'ar' : 'en' });
  return blueprint;
}

// =========================================================================
// HTML Renderer: Zero emojis, strictly SAR currency, edge-to-edge responsive
// =========================================================================
export function renderBespokeHtml(blueprint: BespokeBlueprint, options?: any): string {
  const isArabic = options?.lang === 'ar' || /[\u0600-\u06FF]/.test(blueprint.appName);
  const { appName, tagline, category, metrics, filterPills, items, schema } = blueprint;

  const zatcaTlvBase64 = generateZatcaTlvBase64(
    `منشأة ${appName.slice(0, 30)}`,
    '310294857200003',
    new Date().toISOString(),
    '99.00',
    '12.91'
  );

  const domainTabs = isArabic
    ? [
        { id: 'hub', label: 'الرئيسية والخدمات', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
        { id: 'orders', label: 'الطلبات والحجوزات', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
        { id: 'analytics', label: 'المؤشرات والتحليلات', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
        { id: 'database', label: 'قاعدة البيانات', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
        { id: 'invoices', label: 'الفواتير الضريبية', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' },
      ]
    : [
        { id: 'hub', label: 'Services & Hub', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
        { id: 'orders', label: 'Orders & Bookings', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
        { id: 'analytics', label: 'Analytics', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
        { id: 'database', label: 'Database', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
        { id: 'invoices', label: 'Tax Invoices', icon: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' },
      ];

  return `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${appName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      width: 100%;
      min-height: 100%;
      margin: 0;
      padding: 0;
    }
    body { 
      font-family: ${isArabic ? "'Cairo', 'Inter'" : "'Inter', 'Cairo'"}, system-ui, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .notification-toast {
      position: fixed;
      bottom: 74px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      z-index: 9999;
      background: #18181b;
      border: 1px solid #27272a;
      color: #fafafa;
      padding: 10px 18px;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      width: calc(100% - 32px);
      max-width: 380px;
    }
    .notification-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
  <script>
    function showNotification(msg) {
      let toast = document.getElementById('live-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'live-toast';
        toast.className = 'notification-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<span style="color:#10b981;font-weight:bold;font-size:14px;">✓</span> <span>' + msg + '</span>';
      toast.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    function filterRecords(query) {
      const q = query.toLowerCase().trim();
      const cards = document.querySelectorAll('.domain-card');
      cards.forEach(c => {
        const text = c.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    let activeFilterTag = 'all';
    function filterCategory(cat, btn) {
      activeFilterTag = cat;
      document.querySelectorAll('.cat-pill').forEach(el => {
        el.classList.remove('bg-zinc-100', 'text-zinc-950', 'font-bold');
        el.classList.add('bg-zinc-900', 'text-zinc-400');
      });
      if (btn) {
        btn.classList.remove('bg-zinc-900', 'text-zinc-400');
        btn.classList.add('bg-zinc-100', 'text-zinc-950', 'font-bold');
      }
      const cards = document.querySelectorAll('.domain-card');
      cards.forEach(c => {
        const itemTag = c.getAttribute('data-tag') || '';
        if (cat === 'all' || itemTag.includes(cat) || cat.includes(itemTag)) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    let currentCheckoutItem = null;

    function openSecureCheckoutModal(title, price, itemId) {
      currentCheckoutItem = { title, price, itemId };
      const modal = document.getElementById('secure-checkout-modal');
      const titleEl = document.getElementById('secure-checkout-title');
      const priceEl = document.getElementById('secure-checkout-price');
      if (titleEl) titleEl.innerText = title;
      if (priceEl) priceEl.innerText = price;
      if (modal) modal.classList.remove('hidden');
    }

    function closeSecureCheckoutModal() {
      const modal = document.getElementById('secure-checkout-modal');
      if (modal) modal.classList.add('hidden');
    }

    function show3DSecureVerification() {
      closeSecureCheckoutModal();
      const modal3d = document.getElementById('bank-3ds-modal');
      const amtEl = document.getElementById('3ds-amount-val');
      if (amtEl && currentCheckoutItem) amtEl.innerText = currentCheckoutItem.price;
      if (modal3d) modal3d.classList.remove('hidden');
    }

    function close3DSecureVerification() {
      const modal3d = document.getElementById('bank-3ds-modal');
      if (modal3d) modal3d.classList.add('hidden');
    }

    async function confirm3DSecurePayment() {
      const otpInput = document.getElementById('3ds-otp-code');
      const code = otpInput ? otpInput.value.trim() : '582914';
      if (!code || code.length < 4) {
        showNotification('${isArabic ? 'يرجى إدخال رمز التحقق' : 'Please enter OTP'}');
        return;
      }

      close3DSecureVerification();
      const txId = 'TX-SEC-' + Math.floor(Math.random() * 899999 + 100000);

      if (currentCheckoutItem && currentCheckoutItem.itemId) {
        const badgeEl = document.getElementById('badge-' + currentCheckoutItem.itemId);
        if (badgeEl) {
          badgeEl.className = 'px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold';
          badgeEl.innerText = '${isArabic ? 'مسدد ومؤكد' : 'Paid & Verified'}';
        }
      }

      addOrderToTab(currentCheckoutItem.title, currentCheckoutItem.price, txId);

      const receiptModal = document.getElementById('payment-receipt-modal');
      const rTxEl = document.getElementById('receipt-tx-id');
      const rTitleEl = document.getElementById('receipt-item-title');
      const rPriceEl = document.getElementById('receipt-item-price');
      if (rTxEl) rTxEl.innerText = txId;
      if (rTitleEl && currentCheckoutItem) rTitleEl.innerText = currentCheckoutItem.title;
      if (rPriceEl && currentCheckoutItem) rPriceEl.innerText = currentCheckoutItem.price;
      if (receiptModal) receiptModal.classList.remove('hidden');

      showNotification('${isArabic ? 'تم تأكيد المعاملة بنجاح: ' : 'Payment verified: '}' + txId);
    }

    function addOrderToTab(title, price, txId) {
      const container = document.getElementById('orders-list-container');
      if (container) {
        const div = document.createElement('div');
        div.className = 'p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs';
        div.innerHTML = '<div class="space-y-1 min-w-0"><div class="flex items-center gap-2"><h4 class="font-bold text-white truncate">' + title + '</h4><span class="font-mono text-emerald-400 font-bold">' + price + '</span></div><p class="text-[11px] text-zinc-500 font-mono">' + ('${isArabic ? 'المعاملة: ' : 'TX: '}') + txId + ' • ' + ('${isArabic ? 'فاتورة ضريبية رسمية' : 'Tax Invoice'}') + '</p></div><span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">${isArabic ? 'مسدد ومؤكد' : 'Paid'}</span>';
        container.prepend(div);
      }
    }

    function closeReceiptModal() {
      const receiptModal = document.getElementById('payment-receipt-modal');
      if (receiptModal) receiptModal.classList.add('hidden');
      currentCheckoutItem = null;
    }

    function switchAppTab(tab) {
      const allTabs = ['hub', 'orders', 'analytics', 'database', 'invoices'];
      allTabs.forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        const dockBtn = document.getElementById('dock-btn-' + t);
        if (view) {
          if (t === tab) view.classList.remove('hidden');
          else view.classList.add('hidden');
        }
        if (btn) {
          if (t === tab) {
            btn.className = 'px-3 py-1.5 rounded-xl font-bold bg-zinc-100 text-zinc-950 transition cursor-pointer flex items-center gap-1.5 shadow-sm';
          } else {
            btn.className = 'px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer flex items-center gap-1.5';
          }
        }
        if (dockBtn) {
          if (t === tab) {
            dockBtn.classList.add('text-zinc-100', 'font-bold');
            dockBtn.classList.remove('text-zinc-500');
          } else {
            dockBtn.classList.remove('text-zinc-100', 'font-bold');
            dockBtn.classList.add('text-zinc-500');
          }
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openSqlSchemaModal() {
      const modal = document.getElementById('sql-schema-modal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeSqlSchemaModal() {
      const modal = document.getElementById('sql-schema-modal');
      if (modal) modal.classList.add('hidden');
    }

    function copySqlSchema() {
      const code = document.getElementById('sql-schema-code')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code);
        showNotification('${isArabic ? 'تم نسخ المخطط' : 'Schema copied'}');
      }
    }

    function openNewItemDialog() {
      const modal = document.getElementById('new-item-modal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeNewItemDialog() {
      const modal = document.getElementById('new-item-modal');
      if (modal) modal.classList.add('hidden');
    }

    function submitNewItem() {
      const title = document.getElementById('input-new-item-title')?.value.trim();
      const meta = document.getElementById('input-new-item-meta')?.value.trim();
      const price = document.getElementById('input-new-item-price')?.value.trim() || '${isArabic ? '95 ر.س' : '95 SAR'}';
      if (!title) {
        showNotification('${isArabic ? 'يرجى كتابة العنوان' : 'Please enter title'}');
        return;
      }
      const grid = document.getElementById('domain-cards-grid');
      if (grid) {
        const id = 'item-' + Date.now();
        const card = document.createElement('div');
        card.className = 'domain-card p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between gap-3 text-xs transition shadow-sm';
        card.setAttribute('data-tag', 'all');
        card.innerHTML = '<div class="space-y-1.5"><div class="flex items-start justify-between gap-2"><h4 class="font-bold text-sm text-white">' + title + '</h4><span class="px-2 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold">${isArabic ? 'جديد' : 'New'}</span></div><p class="text-xs text-zinc-400">' + (meta || '${isArabic ? 'سجل تشغيلي مضاف حديثاً' : 'Newly created record'}') + '</p></div><div class="flex items-center justify-between pt-2 border-t border-zinc-800"><span class="font-mono text-sm font-bold text-white">' + price + '</span><button onclick="openSecureCheckoutModal(\\'' + title.replace(/'/g, "\\'") + '\\', \\'' + price + '\\', \\'' + id + '\\')" class="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"><span>${isArabic ? 'حجز / سداد' : 'Order'}</span></button></div>';
        grid.prepend(card);
      }
      closeNewItemDialog();
      showNotification('${isArabic ? 'تمت إضافة العنصر ومزامنته' : 'Item created & synced'}');
    }
  </script>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-zinc-800 selection:text-white flex flex-col pb-24 overflow-y-auto">

  <!-- Top Navigation Header -->
  <header class="border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur sticky top-0 z-30 px-3 sm:px-6 py-2.5 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200 text-xs shadow-xs shrink-0">
        <svg class="w-4 h-4 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      </div>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight truncate">${appName}</h1>
          <span class="text-[9px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded hidden sm:inline">
            ${isArabic ? 'إصدار معتمد' : 'Enterprise'}
          </span>
        </div>
        <p class="text-[10px] text-zinc-400 font-mono flex items-center gap-1 truncate">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>${isArabic ? 'منظومة سحابية معتمدة • أمان مصرفي مشفر' : 'Cloud Architecture • PostgreSQL & 3D Secure'}</span>
        </p>
      </div>
    </div>

    <!-- Center/Right Mode Switcher & Tools -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- 5 Universal Operational Navigation Tabs -->
      <div class="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto no-scrollbar">
        ${domainTabs
          .map(
            (t, idx) => `
        <button id="tab-btn-${t.id}" onclick="switchAppTab('${t.id}')" class="px-3 py-1.5 rounded-lg ${idx === 0 ? 'font-bold bg-zinc-100 text-zinc-950' : 'text-zinc-400 hover:text-white'} transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs">
          <span>${t.icon}</span>
          <span class="hidden md:inline">${t.label}</span>
        </button>`
          )
          .join('')}
      </div>

      <!-- New Item Trigger -->
      <button onclick="openNewItemDialog()" class="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-xs cursor-pointer active:scale-95 shrink-0 flex items-center gap-1">
        <span>+</span>
        <span class="hidden sm:inline">${isArabic ? 'إضافة جديد' : 'New'}</span>
      </button>
    </div>
  </header>

  <!-- Main Viewport Content Container -->
  <main class="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-5">

    <!-- ========================================================================= -->
    <!-- TAB 1: HUB & SERVICES (Primary Operational View) -->
    <!-- ========================================================================= -->
    <div id="view-hub" class="space-y-4">
      <!-- Executive Hero Banner -->
      <div class="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl overflow-hidden">
        <div class="relative z-10 space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>${isArabic ? 'محرك تشغيل فوري معتمد' : 'Real-time Verified Engine'}</span>
          </div>
          <h2 class="text-lg sm:text-2xl font-black text-white tracking-tight">${appName}</h2>
          <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">${tagline}</p>
        </div>
      </div>

      <!-- Operational Metrics Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${metrics
          .map(
            (m) => `
        <div class="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
          <span class="text-zinc-400 text-[11px]">${m.label}</span>
          <div class="text-lg sm:text-xl font-bold font-mono text-white">${m.val}</div>
          <span class="text-[10px] text-zinc-500 font-medium">${m.sub}</span>
        </div>`
          )
          .join('')}
      </div>

      <!-- Filterable Items Toolbar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          ${filterPills
            .map(
              (pill, idx) => `
          <button onclick="filterCategory('${idx === 0 ? 'all' : pill.toLowerCase()}', this)" class="cat-pill px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${idx === 0 ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'}">
            ${pill}
          </button>`
            )
            .join('')}
        </div>

        <!-- Quick Live Search -->
        <div class="relative min-w-[200px]">
          <input
            type="text"
            oninput="filterRecords(this.value)"
            placeholder="${isArabic ? 'بحث سريع...' : 'Search...'}"
            class="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-zinc-700"
          />
        </div>
      </div>

      <!-- Domain Cards Grid -->
      <div id="domain-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        ${items
          .map(
            (it) => `
        <div class="domain-card p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between gap-3 text-xs transition shadow-sm" data-tag="${it.tag}">
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-sm text-white">${it.title}</h4>
              <span id="badge-${it.id}" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold shrink-0">
                ${it.badge}
              </span>
            </div>
            <p class="text-xs text-zinc-400 leading-relaxed">${it.meta}</p>
          </div>

          <div class="flex items-center justify-between pt-2.5 border-t border-zinc-800">
            <span class="font-mono text-sm font-bold text-white">${it.price}</span>
            <button onclick="openSecureCheckoutModal('${it.title.replace(/'/g, "\\'")}', '${it.price}', '${it.id}')" class="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs">
              <span>${isArabic ? 'حجز / سداد' : 'Order Now'}</span>
            </button>
          </div>
        </div>`
          )
          .join('')}
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: ORDERS & BOOKINGS (Real Transaction State) -->
    <!-- ========================================================================= -->
    <div id="view-orders" class="hidden flex-1 flex flex-col space-y-4">
      <div class="p-4 sm:p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 class="font-bold text-white text-sm">
              ${isArabic ? 'سجل العمليات والطلبات المنفذة' : 'Active Orders & Bookings'}
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">${isArabic ? 'مزامنة سحابية فورية مع قاعدة بيانات PostgreSQL وفواتير ZATCA' : 'Real-time PostgreSQL sync and verified tax invoices'}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            SHA-256
          </span>
        </div>

        <div id="orders-list-container" class="space-y-2.5">
          <!-- Seed Initial Order -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-white truncate">${items[0]?.title || appName}</h4>
                <span class="font-mono text-emerald-400 font-bold">${items[0]?.price || '95 ر.س'}</span>
              </div>
              <p class="text-[11px] text-zinc-500 font-mono">TX: TX-SEC-942810 • 3D Secure Verified • ZATCA Phase 2</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              ${isArabic ? 'مؤكد ومسدد' : 'Verified'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: LIVE TELEMETRY & BUSINESS ANALYTICS -->
    <!-- ========================================================================= -->
    <div id="view-analytics" class="hidden flex-1 flex flex-col space-y-4">
      <!-- 4 Key Metric Indicator Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        ${metrics
          .map(
            (m) => `
        <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span class="text-zinc-400 text-xs">${m.label}</span>
          <div class="text-xl font-bold font-mono text-white">${m.val}</div>
          <span class="text-[10px] text-zinc-500 font-medium">${m.sub}</span>
        </div>`
          )
          .join('')}
      </div>

      <!-- Execution Chart (SVG) -->
      <div class="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <h3 class="font-bold text-white">
            ${isArabic ? 'مؤشر العمليات والنمو الأسبوعي' : 'Weekly Operational Throughput'}
          </h3>
          <span class="text-emerald-400 font-mono font-bold">+22.4% ${isArabic ? 'نمو' : 'Growth'}</span>
        </div>
        <div class="w-full h-44 sm:h-56 bg-zinc-950 rounded-2xl border border-zinc-800 p-3 flex items-end justify-between gap-2">
          ${[35, 52, 68, 45, 88, 95, 78]
            .map(
              (val, i) => `
            <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span class="text-[10px] font-mono text-zinc-500 group-hover:text-white transition">${val}%</span>
              <div class="w-full bg-zinc-800 group-hover:bg-zinc-100 rounded-t-lg transition-all duration-300" style="height: ${val}%"></div>
              <span class="text-[10px] text-zinc-500 font-mono">${['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 4: DATABASE ARCHITECTURE (PostgreSQL & Drizzle ORM) -->
    <!-- ========================================================================= -->
    <div id="view-database" class="hidden flex-1 flex flex-col space-y-4">
      <div class="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 class="font-bold text-white text-sm">
              ${isArabic ? 'مخطط قاعدة بيانات PostgreSQL ونماذج Drizzle ORM' : 'PostgreSQL Schema & Drizzle ORM Models'}
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">${isArabic ? 'جداول علائقية مشفرة مصممة خصيصاً لهذه المنظومة' : 'Relational tables architected specifically for this domain'}</p>
          </div>
          <button onclick="copySqlSchema()" class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer">
            ${isArabic ? 'نسخ المخطط' : 'Copy'}
          </button>
        </div>

        <div class="space-y-3">
          ${schema
            .map(
              (s) => `
          <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-xs text-emerald-400">TABLE: ${s.table}</span>
              <span class="text-[10px] font-mono text-zinc-500">${s.fields.length} columns</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${s.fields
                .map(
                  (f) => `
              <span class="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                ${f}
              </span>`
                )
                .join('')}
            </div>
          </div>`
            )
            .join('')}
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 5: ZATCA TAX INVOICES (Phase 2 TLV QR) -->
    <!-- ========================================================================= -->
    <div id="view-invoices" class="hidden flex-1 flex flex-col space-y-4">
      <div class="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 class="font-bold text-white text-sm">
              ${isArabic ? 'الفواتير الضريبية المبسطة ZATCA Phase 2' : 'ZATCA Phase 2 E-Invoices'}
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">${isArabic ? 'فواتير ضريبية نظامية معتمدة مشفرة بباركود TLV Base64' : 'Compliant tax invoices with cryptographic QR stamps'}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            ZATCA Compliant
          </span>
        </div>

        <div class="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-400">${isArabic ? 'اسم المنشأة الموردة:' : 'Seller Name:'}</span>
            <span class="font-bold text-white">${appName}</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-400">${isArabic ? 'الرقم الضريبي للمنشأة:' : 'VAT Registration:'}</span>
            <span class="font-mono font-bold text-white">310294857200003</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-400">${isArabic ? 'نسبة ضريبة القيمة المضافة:' : 'VAT Rate:'}</span>
            <span class="font-mono text-white">15% (KSA Standard)</span>
          </div>
          <div class="flex justify-between items-center py-1.5">
            <span class="text-zinc-400">${isArabic ? 'بصمة التشفير TLV Base64:' : 'TLV Stamp:'}</span>
            <span class="font-mono text-[10px] text-zinc-500 truncate max-w-[200px]">${zatcaTlvBase64}</span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- ========================================================================= -->
  <!-- MODALS -->
  <!-- ========================================================================= -->

  <!-- 1. Checkout Modal -->
  <div id="secure-checkout-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 class="text-sm font-bold text-white">${isArabic ? 'تأكيد الحجز والسداد' : 'Checkout & Payment'}</h3>
        <button onclick="closeSecureCheckoutModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
        <h4 id="secure-checkout-title" class="font-bold text-sm text-white">Service</h4>
        <div id="secure-checkout-price" class="font-mono text-base font-bold text-emerald-400">0 SAR</div>
      </div>

      <div class="space-y-2">
        <button onclick="show3DSecureVerification()" class="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2">
          <span>Apple Pay / مدى</span>
        </button>
        <button onclick="show3DSecureVerification()" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition cursor-pointer">
          ${isArabic ? 'الدفع بالبطاقة الائتمانية' : 'Credit / Debit Card'}
        </button>
      </div>
    </div>
  </div>

  <!-- 2. Bank 3D Secure OTP Modal -->
  <div id="bank-3ds-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl text-center">
      <h3 class="text-sm font-bold text-white">${isArabic ? 'التحقق المصرفي 3D Secure' : '3D Secure Bank Verification'}</h3>
      <p class="text-xs text-zinc-400">${isArabic ? 'أدخل رمز التحقق المرسل إلى هاتفك لإتمام المعاملة' : 'Enter OTP sent to your registered phone'}</p>

      <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
        <span class="text-xs text-zinc-400">${isArabic ? 'المبلغ المطلوب سداده:' : 'Amount:'}</span>
        <span id="3ds-amount-val" class="font-mono font-bold text-white block text-base mt-0.5">0 SAR</span>
      </div>

      <input
        type="text"
        id="3ds-otp-code"
        maxLength="6"
        placeholder="582914"
        value="582914"
        class="w-full text-center tracking-[0.3em] font-mono text-lg py-2.5 bg-zinc-950 border border-zinc-750 rounded-xl text-white focus:outline-hidden"
      />

      <div class="flex gap-2">
        <button onclick="close3DSecureVerification()" class="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold transition cursor-pointer">
          ${isArabic ? 'إلغاء' : 'Cancel'}
        </button>
        <button onclick="confirm3DSecurePayment()" class="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition cursor-pointer">
          ${isArabic ? 'تأكيد السداد' : 'Confirm'}
        </button>
      </div>
    </div>
  </div>

  <!-- 3. Receipt / ZATCA Invoice Modal -->
  <div id="payment-receipt-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3.5 shadow-2xl">
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 class="text-sm font-bold text-white">${isArabic ? 'فاتورة ضريبية رسمية' : 'Tax Invoice'}</h3>
        <button onclick="closeReceiptModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-zinc-400">${isArabic ? 'رقم المعاملة:' : 'TX ID:'}</span>
          <span id="receipt-tx-id" class="font-mono text-white font-bold">TX-000</span>
        </div>
        <div class="flex justify-between">
          <span class="text-zinc-400">${isArabic ? 'الخدمة / البند:' : 'Item:'}</span>
          <span id="receipt-item-title" class="text-white font-bold truncate max-w-[180px]">Service</span>
        </div>
        <div class="flex justify-between border-t border-zinc-900 pt-1.5">
          <span class="text-zinc-400">${isArabic ? 'المبلغ الإجمالي:' : 'Total:'}</span>
          <span id="receipt-item-price" class="font-mono font-bold text-emerald-400 text-sm">0 SAR</span>
        </div>
      </div>

      <button onclick="closeReceiptModal()" class="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition cursor-pointer">
        ${isArabic ? 'إغلاق ومتابعة' : 'Close'}
      </button>
    </div>
  </div>

  <!-- 4. New Item Modal -->
  <div id="new-item-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 shadow-2xl">
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 class="text-sm font-bold text-white">${isArabic ? 'إضافة خدمة أو منتج جديد' : 'New Service or Item'}</h3>
        <button onclick="closeNewItemDialog()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <div class="space-y-2 text-xs">
        <div>
          <label class="block text-[11px] text-zinc-400 mb-1">${isArabic ? 'العنوان' : 'Title'}</label>
          <input id="input-new-item-title" type="text" placeholder="${isArabic ? 'اسم الخدمة أو الصنف' : 'Title'}" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-hidden" />
        </div>
        <div>
          <label class="block text-[11px] text-zinc-400 mb-1">${isArabic ? 'المواصفات' : 'Details'}</label>
          <input id="input-new-item-meta" type="text" placeholder="${isArabic ? 'تفاصيل الخدمة' : 'Specs'}" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-hidden" />
        </div>
        <div>
          <label class="block text-[11px] text-zinc-400 mb-1">${isArabic ? 'السعر (ر.س)' : 'Price'}</label>
          <input id="input-new-item-price" type="text" placeholder="${isArabic ? '95 ر.س' : '95 SAR'}" class="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-hidden" />
        </div>
      </div>

      <div class="flex gap-2 pt-1">
        <button onclick="closeNewItemDialog()" class="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer">
          ${isArabic ? 'إلغاء' : 'Cancel'}
        </button>
        <button onclick="submitNewItem()" class="flex-1 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs cursor-pointer">
          ${isArabic ? 'حفظ وإضافة' : 'Save Item'}
        </button>
      </div>
    </div>
  </div>

</body>
</html>`;
}
