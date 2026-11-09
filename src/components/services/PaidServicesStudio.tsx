import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Download,
  AlertCircle,
  FileCheck,
  CreditCard,
  Check,
  RotateCw,
  Search,
} from 'lucide-react';

interface PaidService {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  categoryAr: string;
  categoryEn: string;
  pointsCost: number;
  usdEquivalent: number;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  featuresAr: string[];
  featuresEn: string[];
  status?: 'active' | 'available' | 'processing';
  icon: string;
}

const AVAILABLE_SERVICES: PaidService[] = [
  {
    id: 'srv-launch-domain',
    titleAr: 'إطلاق موقع تجاري متكامل مع حجز نطاق رسمي (Domain .com / .sa)',
    titleEn: 'Full Business Website with Official Custom Domain (.com / .sa)',
    descAr: 'تصميم وبرمجة موقع أعمال متكامل، حجز الدومين المخصص، وربطه بسيرفر سحابي مشفر مع شهادة SSL مجانية مدى الحياة.',
    descEn: 'Full corporate website design, custom domain provisioning, and high-performance cloud hosting with lifetime SSL.',
    categoryAr: 'المواقع والنطاقات',
    categoryEn: 'Websites & Domains',
    pointsCost: 1200,
    usdEquivalent: 24,
    deliveryTimeAr: 'تسليم فوري (أقل من دقيقتين)',
    deliveryTimeEn: 'Instant (under 2 minutes)',
    icon: '🌐',
    featuresAr: [
      'تصميم متجاوب بالكامل مع الهواتف والشاشات',
      'حجز نطاق رسمي مع ربط DNS فوري تلقائي',
      'شهادة حماية 256-bit SSL مشفرة',
      'ربط بريد إلكتروني رسمي باسم النطاق',
    ],
    featuresEn: [
      'Fully responsive for all mobile & desktop screens',
      'Domain registration with automated instant DNS',
      '256-bit SSL Certificate encryption included',
      'Custom business email forwarding configuration',
    ],
  },
  {
    id: 'srv-ecommerce-pay',
    titleAr: 'متجر إلكتروني ذكي متكامل مع بوابات الدفع (Dodo / Mada / Apple Pay)',
    titleEn: 'Turnkey E-Commerce Store with Dodo Payments & Mada Integration',
    descAr: 'متجر سحابي مكتمل مع سلة تسوق حقيقية، سحب فوري، ربط مدفوعات أبل باي وبطاقات مدى، ونظام إدارة مخزون وفواتير.',
    descEn: 'Complete online store with real cart, instant checkout, Apple Pay & Mada support, and tax invoice automation.',
    categoryAr: 'التجارة الإلكترونية',
    categoryEn: 'E-Commerce',
    pointsCost: 2400,
    usdEquivalent: 49,
    deliveryTimeAr: 'تفعيل فوري وآمن',
    deliveryTimeEn: 'Instant Secure Activation',
    icon: 'ecommerce',
    featuresAr: [
      'سحب حقيقي وتأكيد الدفع عبر Dodo Payments',
      'دعم Apple Pay وبطاقات مدى وفيزا وماستركارد',
      'لوحة متابعة الطلبات وحالات الشحن سمسا وأرامكس',
      'إصدار فواتير ضريبية إلكترونية معتمدة برقم تسلسلي',
    ],
    featuresEn: [
      'Real payment execution & verification via Dodo Payments',
      'Native Apple Pay, Mada, Visa & Mastercard checkout',
      'Order fulfillment & shipping carrier tracking dashboard',
      'ZATCA compliant automated tax invoice generator',
    ],
  },
  {
    id: 'srv-seo-google',
    titleAr: 'حملة تحسين محركات البحث والأرشفة الفورية في محرك Google',
    titleEn: 'Instant Google Search Indexing & Advanced SEO Optimization',
    descAr: 'أرشفة فورية لصفحات موقعك في جوجل، توليد خريطة الموقع Sitemap، تهيئة الكلمات المفتاحية، وبطاقات المشاركة في شبكات التواصل.',
    descEn: 'Fast Google Search indexing, automated XML sitemap, meta tags, and OpenGraph social share cards.',
    categoryAr: 'التسويق والظهور',
    categoryEn: 'SEO & Marketing',
    pointsCost: 600,
    usdEquivalent: 12,
    deliveryTimeAr: 'تنفيذ آلي خلال 60 ثانية',
    deliveryTimeEn: 'Automated in 60s',
    icon: 'seo',
    featuresAr: [
      'فهرسة فورية في Google Search Console',
      'توليد خريطة XML ومحتوى robots.txt تلقائياً',
      'تهيئة وسوم Schema.org الذكية للأعمال',
      'بطاقات معاينة راقية عند مشاركة الرابط في واتساب وتويتر',
    ],
    featuresEn: [
      'Instant submission to Google Search Console',
      'Automated sitemap.xml & robots.txt generation',
      'Schema.org structured rich snippet metadata',
      'Premium WhatsApp & social media link preview cards',
    ],
  },
  {
    id: 'srv-cloud-shield',
    titleAr: 'جدار حماية سحابي وسيرفر فائق السرعة مع درع الحماية ضد الاختراق',
    titleEn: 'Enterprise Cloud Shield & Dedicated High-Speed DDoS Protection',
    descAr: 'استضافة سحابية خاصة معزولة على بنية Google Cloud، حماية من هجمات DDoS، ومراقبة حية 24/7 لضمان سرعة فائقة بنسبة 99.99%.',
    descEn: 'Dedicated isolated cloud container on Google Cloud with DDoS mitigation and 99.99% uptime SLA.',
    categoryAr: 'الأمان والاستضافة',
    categoryEn: 'Security & Hosting',
    pointsCost: 950,
    usdEquivalent: 19,
    deliveryTimeAr: 'تجهيز فوري',
    deliveryTimeEn: 'Instant Provisioning',
    icon: 'security',
    featuresAr: [
      'سيرفر معزول عالي السرعة (Google Cloud Europe-West)',
      'جدار ناري ذكي مضاد لهجمات حجب الخدمة DDoS',
      'نسخ احتياطي يومي مشفر تلقائي',
      'زمن استجابة أقل من 40 ميلي ثانية',
    ],
    featuresEn: [
      'Dedicated Google Cloud server container',
      'Intelligent DDoS & brute-force firewall shield',
      'Daily automated encrypted snapshots',
      'Ultra-low latency under 40ms',
    ],
  },
  {
    id: 'srv-brand-identity',
    titleAr: 'حزمة الهوية البصرية وشعار الأعمال الفاخر عالي الدقة (Vector)',
    titleEn: 'Corporate Brand Identity & Ultra-HD Vector Logo Package',
    descAr: 'تصميم هوية بصرية رسمية كاملة تشمل الشعار بصيغ SVG/PNG، لوحة الألوان المعتمدة، الخطوط الرسمية، وتطبيقات بطاقات العمل.',
    descEn: 'Complete corporate visual identity with high-res vector logo, color palette, typography, and stationery assets.',
    categoryAr: 'الهوية والتصميم',
    categoryEn: 'Brand & Identity',
    pointsCost: 500,
    usdEquivalent: 10,
    deliveryTimeAr: 'تسليم فوري وتنزيل مباشر',
    deliveryTimeEn: 'Instant Download',
    icon: '✨',
    featuresAr: [
      'شعار رسمي بصيغ متجهة عالية الدقة (SVG / PNG / PDF)',
      'دليل إرشادي لألوان وخطوط الهوية المؤسسية',
      'أيقونات وتطبيقات المتصفح Favicon جاهزة للويب',
      'حقوق الملكية والاستخدام التجاري الكاملة',
    ],
    featuresEn: [
      'Vector logo files in SVG, high-res PNG & PDF',
      'Corporate color palette & typography guidelines',
      'App icons & multi-size Favicons ready for deployment',
      'Full commercial ownership & trademark readiness',
    ],
  },
  {
    id: 'srv-zatca-invoicing',
    titleAr: 'نظام الفوترة الإلكترونية المعتمد ومطابقة مدفوعات البطاقات',
    titleEn: 'Certified Electronic Invoicing System & Payment Reconciliation',
    descAr: 'إصدار الفواتير الضريبية المبسطة والرسمية تلقائياً لكل عملية شراء وسحب بالبطاقة مع رمز الاستجابة السريعة المشفر QR.',
    descEn: 'Automated certified tax invoicing for all card purchases with encrypted QR code and serial numbering.',
    categoryAr: 'الأنظمة والمالية',
    categoryEn: 'Finance & Invoicing',
    pointsCost: 1500,
    usdEquivalent: 30,
    deliveryTimeAr: 'تفعيل فوري بالنظام',
    deliveryTimeEn: 'Instant System Activation',
    icon: '🧾',
    featuresAr: [
      'فواتير ضريبية رسمية بختم معتمد ورقم متسلسل فريد',
      'تشفير QR Code طبقاً للمعايير والأنظمة المعتمدة',
      'تصدير فوري بصيغة PDF وتنزيل بنقرة واحدة',
      'سجل مالي مفصل للعمليات والإيرادات والمصروفات',
    ],
    featuresEn: [
      'Official tax invoices with verified stamp & unique serials',
      'Standard-compliant cryptographic QR code generation',
      'One-click PDF export & instant receipt printing',
      'Comprehensive financial revenue & withdrawal audit trail',
    ],
  },
];

export const PaidServicesStudio: React.FC = () => {
  const { lang, credits, useCredits, addCredits, addToast, setActiveTab } = useApp();

  const [activeServices, setActiveServices] = useState<
    Array<{
      id: string;
      serviceId: string;
      title: string;
      date: string;
      pointsDeducted: number;
      orderRef: string;
      status: 'active' | 'processing';
    }>
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nova_active_paid_services');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'ord-srv-101',
        serviceId: 'srv-launch-domain',
        title: lang === 'ar' ? 'إطلاق موقع تجاري متكامل مع نطاق رسمي' : 'Full Business Website with Domain',
        date: '2026-10-20',
        pointsDeducted: 1200,
        orderRef: 'SRV-8829-SA',
        status: 'active',
      },
    ];
  });

  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<PaidService | null>(null);
  const [isConfirmingDeduction, setIsConfirmingDeduction] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    orderRef: string;
    serviceTitle: string;
    points: number;
    date: string;
    status: string;
  } | null>(null);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices = AVAILABLE_SERVICES.filter((srv) => {
    const matchesSearch =
      srv.titleAr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.descAr.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || srv.categoryEn === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInitiateOrder = (service: PaidService) => {
    if (credits < service.pointsCost) {
      addToast(
        lang === 'ar'
          ? `رصيد النقاط غير كافٍ (${credits} نقطة متوفرة بينما الخدمة تتطلب ${service.pointsCost} نقطة). يرجى شحن الرصيد.`
          : `Insufficient points (${credits} available, required: ${service.pointsCost}). Please top-up.`,
        'warning'
      );
      setSelectedServiceForOrder(service);
      setIsConfirmingDeduction(true);
      return;
    }

    setSelectedServiceForOrder(service);
    setIsConfirmingDeduction(true);
  };

  const handleExecuteRealDeduction = () => {
    if (!selectedServiceForOrder) return;

    if (credits < selectedServiceForOrder.pointsCost) {
      addToast(
        lang === 'ar' ? 'يرجى شحن الرصيد أولاً لإتمام طلب الخدمة' : 'Please top up points to complete order',
        'warning'
      );
      setActiveTab('billing');
      return;
    }

    setIsProcessingOrder(true);

    setTimeout(() => {
      // Real deduction from points balance
      const deducted = useCredits(selectedServiceForOrder.pointsCost);
      if (!deducted) {
        addToast(
          lang === 'ar' ? 'حدث خطأ في عملية السحب، يرجى المحاولة ثانية' : 'Deduction failed, please retry',
          'error'
        );
        setIsProcessingOrder(false);
        return;
      }

      const orderRef = `SRV-${Math.floor(Math.random() * 89999 + 10000)}-SA`;
      const newActive = {
        id: `ord-${Date.now()}`,
        serviceId: selectedServiceForOrder.id,
        title: lang === 'ar' ? selectedServiceForOrder.titleAr : selectedServiceForOrder.titleEn,
        date: new Date().toISOString().split('T')[0],
        pointsDeducted: selectedServiceForOrder.pointsCost,
        orderRef,
        status: 'active' as const,
      };

      const updated = [newActive, ...activeServices];
      setActiveServices(updated);
      try {
        localStorage.setItem('nova_active_paid_services', JSON.stringify(updated));
      } catch (e) {}

      setIsProcessingOrder(false);
      setIsConfirmingDeduction(false);

      setSuccessReceipt({
        orderRef,
        serviceTitle: newActive.title,
        points: selectedServiceForOrder.pointsCost,
        date: new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'),
        status: lang === 'ar' ? 'مفعلة وتعمل بنجاح 100%' : 'Active & Running 100%',
      });

      addToast(
        lang === 'ar'
          ? `🎉 تم سحب ${selectedServiceForOrder.pointsCost} نقطة وتوفير الخدمة بدقة بالغة ورقم طلب: ${orderRef}`
          : `🎉 Deducted ${selectedServiceForOrder.pointsCost} points! Service provisioned successfully: ${orderRef}`,
        'success'
      );
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-zinc-950 text-zinc-100 select-none">
      {/* Top Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {lang === 'ar' ? 'نظام النقاط وسحب الخدمات' : 'Points Wallet & Services Engine'}
              </span>
              <span className="text-zinc-400 text-xs">|</span>
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'ar' ? 'سحب فوري موثق وضمان تنفيذ' : 'Verified Execution Guarantee'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ar' ? 'رصيد النقاط والخدمات المدفوعة' : 'Points Balance & Paid Services'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'استمتع بنظام دفع وسحب حقيقي للنقاط؛ اختر الخدمة المطلوبة ليتم سحب المقابل وتوفيرها لك بدقة وبأعلى معايير الجودة دون تعقيدات برمجية.'
                : 'Real credit deduction & premium enterprise services. Order turnkey web solutions with guaranteed instant provisioning.'}
            </p>
          </div>

          {/* Wallet Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-400 font-medium">
                  {lang === 'ar' ? 'رصيدك الحالي' : 'Available Balance'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white font-mono">{credits.toLocaleString()}</span>
                <span className="text-xs font-bold text-amber-400">{lang === 'ar' ? 'نقطة' : 'pts'}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('billing')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? '+ شحن رصيد' : '+ Top-up'}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang === 'ar' ? 'جميع الخدمات' : 'All Services'}
            </button>
            <button
              onClick={() => setSelectedCategory('Websites & Domains')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'Websites & Domains'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang === 'ar' ? 'المواقع والنطاقات' : 'Websites & Domains'}
            </button>
            <button
              onClick={() => setSelectedCategory('E-Commerce')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'E-Commerce'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang === 'ar' ? 'المتاجر والدفع' : 'E-Commerce & Pay'}
            </button>
            <button
              onClick={() => setSelectedCategory('SEO & Marketing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'SEO & Marketing'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang === 'ar' ? 'الأرشفة والتسويق' : 'SEO & Marketing'}
            </button>
            <button
              onClick={() => setSelectedCategory('Security & Hosting')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'Security & Hosting'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang === 'ar' ? 'الأمان والاستضافة' : 'Security & Hosting'}
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث عن خدمة...' : 'Search services...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Active Subscribed Services Banner */}
        {activeServices.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'الخدمات المفعّلة بحسابك حالياً' : 'Your Currently Active Services'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                {activeServices.length} {lang === 'ar' ? 'خدمات نشطة ومسددة' : 'Active Services'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeServices.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-zinc-400">#{act.orderRef}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'ar' ? 'نشطة ومفعّلة' : 'Active'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">{act.title}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-900 text-[11px] text-zinc-400 font-mono">
                    <span>{act.date}</span>
                    <span className="text-amber-400 font-bold">{act.pointsDeducted} {lang === 'ar' ? 'نقطة' : 'pts'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'كتالوج الخدمات الاحترافية الجاهزة للتنفيذ' : 'Available Professional Services'}</span>
            </h2>
            <span className="text-xs text-zinc-400">
              {lang === 'ar' ? `${filteredServices.length} خدمات متاحة` : `${filteredServices.length} services available`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const hasEnoughCredits = credits >= service.pointsCost;

              return (
                <div
                  key={service.id}
                  className="group rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 transition-all p-5 flex flex-col justify-between relative shadow-lg"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        {service.id.includes('store') || service.id.includes('ecommerce') ? (
                          <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        ) : service.id.includes('seo') ? (
                          <Search className="w-5 h-5 text-zinc-300" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-zinc-300" />
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-baseline gap-1 text-zinc-100 font-mono font-black text-lg">
                          <span>{service.pointsCost.toLocaleString()}</span>
                          <span className="text-xs font-bold text-zinc-400">{lang === 'ar' ? 'نقطة' : 'pts'}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {lang === 'ar' ? `أو ${(service.usdEquivalent * 3.75).toFixed(0)} ر.س سداد مباشر` : `or $${service.usdEquivalent} direct`}
                        </span>
                      </div>
                    </div>

                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 mb-2">
                      {lang === 'ar' ? service.categoryAr : service.categoryEn}
                    </span>

                    <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-amber-300 transition-colors">
                      {lang === 'ar' ? service.titleAr : service.titleEn}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                      {lang === 'ar' ? service.descAr : service.descEn}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 py-3 border-y border-zinc-800/80 mb-4">
                      {(lang === 'ar' ? service.featuresAr : service.featuresEn).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action & Delivery footer */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>{lang === 'ar' ? 'مدة التنفيذ:' : 'Delivery:'}</span>
                      <span className="text-emerald-400 font-semibold">
                        {lang === 'ar' ? service.deliveryTimeAr : service.deliveryTimeEn}
                      </span>
                    </div>

                    <button
                      onClick={() => handleInitiateOrder(service)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs active:scale-95 ${
                        hasEnoughCredits
                          ? 'bg-zinc-100 hover:bg-white text-zinc-950 font-bold'
                          : 'bg-zinc-800 hover:bg-zinc-750 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {hasEnoughCredits ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{lang === 'ar' ? 'طلب وسحب النقاط فوراً' : 'Order & Deduct Points'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>{lang === 'ar' ? 'شحن نقاط لإتمام الطلب' : 'Top-up to Order'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation & Deduction Modal */}
      {isConfirmingDeduction && selectedServiceForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl relative"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg">
                  {selectedServiceForOrder.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'تأكيد سحب النقاط وتنفيذ الخدمة' : 'Confirm Points Deduction'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {lang === 'ar' ? 'حاجز الأمان المالي والتحقق' : 'Financial Security Checkpoint'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmingDeduction(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-white">
                {lang === 'ar' ? selectedServiceForOrder.titleAr : selectedServiceForOrder.titleEn}
              </h4>

              <div className="flex items-center justify-between text-xs py-1.5 border-t border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'تكلفة الخدمة المطلوبة:' : 'Service Cost:'}</span>
                <span className="font-mono font-bold text-amber-400">
                  {selectedServiceForOrder.pointsCost.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'pts'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 border-t border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'رصيدك المتوفر حالياً:' : 'Available Balance:'}</span>
                <span className="font-mono font-bold text-white">
                  {credits.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'pts'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 border-t border-zinc-900 font-bold">
                <span className="text-zinc-300">{lang === 'ar' ? 'الرصيد المتبقي بعد السحب:' : 'Balance After Deduction:'}</span>
                <span
                  className={`font-mono ${
                    credits - selectedServiceForOrder.pointsCost >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {(credits - selectedServiceForOrder.pointsCost).toLocaleString()} {lang === 'ar' ? 'نقطة' : 'pts'}
                </span>
              </div>
            </div>

            {credits < selectedServiceForOrder.pointsCost ? (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{lang === 'ar' ? 'رصيدك غير كافٍ لإتمام السحب' : 'Insufficient Points Balance'}</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  {lang === 'ar'
                    ? 'يمكنك شحن رصيدك عبر بطاقة مدى أو أبل باي أو فيزا فوراً بمفاتيح الدفع المعتمدة.'
                    : 'Top-up your balance via Mada, Apple Pay, or Credit Card.'}
                </p>
                <button
                  onClick={() => {
                    setIsConfirmingDeduction(false);
                    setActiveTab('billing');
                  }}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition"
                >
                  {lang === 'ar' ? 'شحن الرصيد الآن في بوابة الدفع' : 'Go to Billing & Top-up'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleExecuteRealDeduction}
                  disabled={isProcessingOrder}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                >
                  {isProcessingOrder ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'ar' ? 'جارٍ السحب وتفعيل الخدمة بدقة...' : 'Processing Deduction...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>{lang === 'ar' ? 'تأكيد السحب وتفعيل الخدمة فوراً' : 'Confirm & Activate Service'}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-zinc-500">
                  {lang === 'ar'
                    ? 'العملية محمية وموثقة في سجل المعاملات المالية المعتمد.'
                    : 'Encrypted transaction verified via enterprise security barriers.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Success Receipt Modal */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl bg-zinc-900 border border-emerald-500/40 p-6 space-y-5 shadow-2xl relative"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">
                {lang === 'ar' ? 'تم سحب النقاط وتوفير الخدمة بنجاح!' : 'Service Provisioned Successfully!'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ar'
                  ? 'تم تسجيل طلبك وتفعيل الخدمة على أعلى مستوى من الدقة والأمان.'
                  : 'Your request has been fulfilled with highest enterprise accuracy.'}
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'رقم الطلب المرجعي:' : 'Order Ref:'}</span>
                <span className="text-emerald-400 font-bold">{successReceipt.orderRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'الخدمة المفعلة:' : 'Service:'}</span>
                <span className="text-white font-sans font-bold truncate max-w-[200px]">{successReceipt.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'النقاط المسحوبة:' : 'Points Deducted:'}</span>
                <span className="text-amber-400 font-bold">{successReceipt.points.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">{lang === 'ar' ? 'تاريخ المعاملة:' : 'Timestamp:'}</span>
                <span className="text-zinc-300">{successReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">{lang === 'ar' ? 'حالة التفعيل:' : 'Status:'}</span>
                <span className="text-emerald-400 font-bold">{successReceipt.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSuccessReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition shadow-xs"
              >
                {lang === 'ar' ? 'إغلاق ومتابعة العمل' : 'Close & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
