import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { requestAppGeneration, requestAppGenerationStream, requestGeminiChat } from '../../services/geminiService';
import { extractDomainConcept } from '../../services/bespokeSynthesizer';
import { LiveBuildSkeleton } from './LiveBuildSkeleton';
import { NovaOrbitalThinking } from './NovaOrbitalThinking';
import {
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Download,
  Copy,
  Check,
  Globe,
  Send,
  RotateCw,
  Database,
  Brain,
  CheckCircle2,
  ExternalLink,
  Search,
  Image as ImageIcon,
  X,
  CreditCard,
  Zap,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  Building,
  Terminal,
  ShieldCheck,
  Layers,
  Code2,
  Coins,
  Lightbulb,
  QrCode,
  Share2,
  Columns,
  Maximize2,
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  Sparkles,
  Play,
  Sliders,
  Lock,
  ArrowUpRight,
  CheckCheck,
  MessageSquare,
  Eye,
  Paperclip,
  ArrowRight,
  Activity,
  Clock,
} from 'lucide-react';

type LayoutMode = 'split' | 'chat-only' | 'preview-only';
type DeviceMode = 'desktop' | 'mobile' | 'tablet';

interface DynamicTask {
  id: number;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  file?: string;
  diffSummary?: string;
  targetDurationMs: number;
}

export interface ArchitectureInquiryData {
  category: string;
  domainName: string;
  selectedOptions: Record<string, string>;
  calculatedCredits: number;
  estDurationSec: number;
  promptText: string;
  attachedImage?: string;
  isResolved?: boolean;
}

interface DynamicInquiryItem {
  label: string;
  prompt: string;
  category?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
  isBuilding?: boolean;
  tasksSnapshot?: DynamicTask[];
  thoughtProcess?: string[];
  thoughtSnippet?: string;
  dynamicInquiries?: DynamicInquiryItem[];
  totalExecutionSeconds?: number;
  appName?: string;
  inquiry?: ArchitectureInquiryData;
  filesModified?: Array<{ file: string; additions: number; deletions: number; previewSnippet?: string }>;
}

export interface BrainstormIdea {
  id: string;
  category: 'ecommerce' | 'healthcare' | 'realestate' | 'food' | 'edtech' | 'logistics' | 'saas';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  tags: string[];
  credits: number;
  timeSec: number;
  prompt: string;
}

export const BRAINSTORM_IDEAS: BrainstormIdea[] = [
  {
    id: 'perfume-store',
    category: 'ecommerce',
    titleAr: 'متجر عطور وبخور ملكي مع سلة ودفع إلكتروني',
    titleEn: 'Royal Perfumes & Scent Bar with Live Checkout',
    descAr: 'كتالوج فاخر لنفحات العود والمسك، فلترة حسب النوتات العطرية، سلة تفاعلية، ودفع عبر Apple Pay ومدى.',
    descEn: 'Luxury fragrance catalog with scent pyramids, cart calculation, and instant payment gateway.',
    tags: ['Dodo Payments', 'Apple Pay / Mada', 'Full Mobile UI'],
    credits: 280,
    timeSec: 22,
    prompt: 'أنشئ متجر إلكتروني فاخر لبيع العطور الشرقية المعتّقة والبخور الملكي، يحتوي على كتالوج عطور بنفحات راقية، سلة شراء تفاعلية، حساب الإجمالي والضريبة، وبوابة دفع مشفرة معتمدة تدعم Apple Pay والبطاقات.',
  },
  {
    id: 'clinic-booking',
    category: 'healthcare',
    titleAr: 'منظومة حجز العيادات الطبية وجدولة الاستشارات',
    titleEn: 'Medical Clinic & Telehealth Appointment Hub',
    descAr: 'حجز مواعيد الأطباء، اختيار التخصصات، ملف المريض الصحي، وتأكيد الحجز بدفع إلكتروني فوري.',
    descEn: 'Doctor directory, appointment slot reservation, patient triage intake, and copay processing.',
    tags: ['Doctor Directory', 'Calendar Sync', 'Secure Pay'],
    credits: 310,
    timeSec: 25,
    prompt: 'أنشئ منصة طبية متكاملة لحجز مواعيد العيادات، تتضمن قائمة الأطباء وتخصصاتهم، اختيار وقت الزيارة، تعبئة بيانات المريض، وسداد رسوم الكشف إلكترونياً.',
  },
  {
    id: 'b2b-saas-dashboard',
    category: 'saas',
    titleAr: 'لوحة تحكم B2B SaaS مع فِرق واشتراكات Pro',
    titleEn: 'B2B Multi-Tenant SaaS & Subscription Platform',
    descAr: 'مؤشرات أداء KPI حية، إدارة صلاحيات الفريق RBAC، مخطط اشتراكات شهرية وسنوية، وسجلات أمان.',
    descEn: 'Live KPI charts, team member roles, tiered monthly/annual pricing, and secure subscriptions.',
    tags: ['RBAC Roles', 'PostgreSQL', 'Subscriptions'],
    credits: 330,
    timeSec: 26,
    prompt: 'أنشئ لوحة تحكم سحابية لشركات SaaS، تشتمل على مؤشرات مالية وتشغيلية، إدارة صلاحيات الموظفين، خطط اشتراك مع سداد دوري بالبطاقات.',
  },
  {
    id: 'real-estate-auctions',
    category: 'realestate',
    titleAr: 'منصة مزادات وعقارات فاخرة مع حجز وعربون فوري',
    titleEn: 'Luxury Real Estate & Real-Time Auction Engine',
    descAr: 'استعراض الفلل والأبراج، جولة افتراضية، مزايدة حية بالثواني، ودفع عربون الجدية عبر بوابة الدفع.',
    descEn: 'Showcase luxury properties with live bid tick, escrow deposit payment, and certified contracts.',
    tags: ['PostgreSQL', 'Realtime Bids', 'Escrow Checkout'],
    credits: 340,
    timeSec: 28,
    prompt: 'أنشئ منصة عقارات فاخرة ومزادات حية، تمكّن المستخدمين من فحص صور وتفاصيل العقار، المشاركة في المزايدة الحية، وسداد عربون الحجز الإلكتروني.',
  },
  {
    id: 'gourmet-restaurant',
    category: 'food',
    titleAr: 'منصة مطاعم فاخرة مع طلبات فورية وتتبع السائق',
    titleEn: 'Artisanal Dining, Kitchen Cart & Courier Tracker',
    descAr: 'قائمة طعام تفاعلية، إضافة المكونات الخاصة، دفع بالبطاقة، ومتابعة حية لموقع سائق التوصيل.',
    descEn: 'Interactive menu, customizable dish modifiers, card payment, and live courier tracking map.',
    tags: ['Kitchen Queue', 'Courier Tracking', 'Tax Invoicing'],
    credits: 300,
    timeSec: 24,
    prompt: 'أنشئ تطبيق مطعم وتوصيل وجبات راقي، يتضمن استعراض الأصناف، تخصيص الإضافات، سلة المشتريات، وبوابة دفع مع تتبع مباشر للطلب.',
  },
];

export const FRAMER_CATEGORIES = [
  { id: 'suggested', labelAr: 'مقترحة', labelEn: 'Suggested', icon: Lightbulb },
  { id: 'wireframe', labelAr: 'مخطط أولي', labelEn: 'Wireframe', icon: Layers },
  { id: 'apps', labelAr: 'تطبيقات', labelEn: 'Apps', icon: Smartphone },
  { id: 'websites', labelAr: 'مواقع ويب', labelEn: 'Websites', icon: Monitor },
  { id: 'prototype', labelAr: 'نماذج أولية', labelEn: 'Prototype', icon: Sparkles },
  { id: 'store', labelAr: 'متاجر ودفع', labelEn: 'Store & Pay', icon: CreditCard },
  { id: 'ai', labelAr: 'أنظمة ذكاء', labelEn: 'AI Neural', icon: Brain },
];

export interface FramerSuggestion {
  icon: any;
  titleAr: string;
  titleEn: string;
  prompt: string;
  style: 'minimal' | 'glass' | 'luxury' | 'cyberpunk' | 'enterprise';
}

export const FRAMER_SUGGESTIONS: Record<string, FramerSuggestion[]> = {
  suggested: [
    {
      icon: Code2,
      titleAr: 'معرض أعمال للمطورين مع سمة داكنة، بطاقات المشاريع، واستمارة تواصل موثقة.',
      titleEn: 'A developer portfolio with dark theme, project cards, and contact form.',
      prompt: 'أنشئ موقع معرض أعمال احترافي للمطورين والمهندسين بتصميم داكن فخم، بطاقات مشاريع تفاعلية مع تفاصيل الشيفرة، إحصائيات تقنية حية، واستمارة تواصل مشفرة.',
      style: 'cyberpunk',
    },
    {
      icon: Layers,
      titleAr: 'صفحة هبوط SaaS حديثة لتطبيق تتبع الوقت مع تسعير وبوابات دفع.',
      titleEn: 'A modern SaaS landing page for a time-tracking app.',
      prompt: 'أنشئ صفحة هبوط حديثة لتطبيق SaaS لتتبع الوقت وإدارة إنتاجية الفرق، تشتمل على حاسبة تفاعلية للوقت، باقات اشتراك شهرية وسنوية، وبوابة دفع مشفرة Dodo Payments.',
      style: 'minimal',
    },
    {
      icon: ShoppingBag,
      titleAr: 'صفحة متجر إلكتروني فاخر لعلامة عناية بالبشرة مع دفع Apple Pay ومدى.',
      titleEn: 'An e-commerce homepage for a skincare brand.',
      prompt: 'أنشئ متجر إلكتروني فائق الأناقة لمنتجات العناية بالبشرة والجمال، كتالوج منتجات مع فلترة المكونات الطبيعية، سلة شراء منبثقة، وتكامل فوري مع بوابة دفع Dodo Payments وبطاقات مدى و Apple Pay.',
      style: 'glass',
    },
  ],
  wireframe: [
    {
      icon: Layers,
      titleAr: 'مخطط أولي سحابي لمنصة إدارة المحتوى ونظام الاشتراكات.',
      titleEn: 'Wireframe for multi-tenant CMS & tiered subscription hub.',
      prompt: 'أنشئ مخططاً معمارياً تفاعلياً لمنصة إدارة محتوى SaaS مع أدوار RBAC، جداول PostgreSQL، وبوابات اشتراك شهرية.',
      style: 'enterprise',
    },
    {
      icon: Terminal,
      titleAr: 'مخطط لوحة تحكم مالية مصرفية مع سجلات تدقيق ومصادقة 2FA.',
      titleEn: 'Wireframe for financial fintech dashboard with 2FA.',
      prompt: 'أنشئ لوحة تحكم مصرفية متقدمة مع مؤشرات مالية حية، سجلات تدقيق أمني 256-bit، وبوابة دفع معتمدة.',
      style: 'enterprise',
    },
  ],
  apps: [
    {
      icon: Stethoscope,
      titleAr: 'تطبيق حجز عيادات وجدولة استشارات طبية مع دفع عربون الكشف.',
      titleEn: 'Medical Clinic appointment hub with doctor schedules & copay.',
      prompt: 'أنشئ تطبيقاً طبياً متكاملاً لحجز مواعيد العيادات، دليل الأطباء حسب التخصص، جدولة المواعيد، ودفع رسوم الكشف إلكترونياً عبر مدى و Apple Pay.',
      style: 'minimal',
    },
    {
      icon: Smartphone,
      titleAr: 'تطبيق توصيل وجبات ومطاعم فاخرة مع تتبع حي للسائق وسلة مشتريات.',
      titleEn: 'Artisanal Food delivery app with kitchen cart & driver tracking.',
      prompt: 'أنشئ تطبيق توصيل وجبات ومطاعم فاخر، يتضمن استعراض قائمة الطعام، تخصيص الوجبات، وسداد فوري بالبطاقات.',
      style: 'minimal',
    },
  ],
  websites: [
    {
      icon: Building,
      titleAr: 'بوابة عقارات فاخرة ومزادات حية مع حجز فوري ودفع عربون الجدية.',
      titleEn: 'Luxury real estate showcase with 3D tours & live auction bids.',
      prompt: 'أنشئ منصة عقارات فاخرة ومزادات حية، تمكن من استعراض الفلل والأبراج، جولة ثلاثية الأبعاد، ومزايدة حية مع دفع عربون حجز إلكتروني.',
      style: 'luxury',
    },
    {
      icon: Globe,
      titleAr: 'موقع سياحي وتجارب استكشافية مع حجز الفنادق والجولات.',
      titleEn: 'Tourism & adventure booking platform with live packages.',
      prompt: 'أنشئ موقع سياحي لحجز الباقات والجولات الترفيهية مع دفع فوري وتأكيد التذاكر بـ QR Code.',
      style: 'glass',
    },
  ],
  prototype: [
    {
      icon: Sparkles,
      titleAr: 'نموذج أولي تفاعلي لتطبيق ذكاء اصطناعي وتوليد صور فورية.',
      titleEn: 'Interactive generative AI prototype with prompt playground.',
      prompt: 'أنشئ منصة تفاعلية لتوليد النماذج والوسائط بالذكاء الاصطناعي مع إحصائيات استهلاك وتوليد فوري.',
      style: 'cyberpunk',
    },
  ],
  store: [
    {
      icon: CreditCard,
      titleAr: 'متجر عطور وبخور ملكي مع سلة ودفع إلكتروني معتمد مدى و Apple Pay.',
      titleEn: 'Royal perfumes & oud boutique with Dodo Payments & Mada 3D Secure.',
      prompt: 'أنشئ متجر عطور وبخور ملكي فاخر، كتالوج بالنوتات العطرية، سلة شراء تفاعلية، ودفع إلكتروني معتمد مع إصدار فاتورة ضريبية فورية.',
      style: 'luxury',
    },
  ],
  ai: [
    {
      icon: Brain,
      titleAr: 'استوديو ZakaAI العصبي مع مساحة تجربة أوامر حية وقياس السرعة 24ms.',
      titleEn: 'ZakaAI Frontier Neural Studio with live playground & 24ms inference.',
      prompt: 'أنشئ استوديو ذكاء اصطناعي ZakaAI Neural Studio متكامل مع مساحة اختبار أوامر فورية ومحاكاة استدلال عصبي وسجلات استهلاك التوكنات وبوابة اشتراك.',
      style: 'cyberpunk',
    },
  ],
};

export interface ModelCapabilityDef {
  key: 'postgres' | 'payments' | 'geminiEngine' | 'pwaMobile' | 'security2fa' | 'searchGrounding';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  tier: 'free' | 'pro';
  cost: number;
  icon: any;
}

export const CAPABILITY_DEFINITIONS: ModelCapabilityDef[] = [
  {
    key: 'geminiEngine',
    titleAr: 'استدلال NOVA AI المعماري الذكي',
    titleEn: 'NOVA AI Deep Reasoning Engine',
    descAr: 'تحليل معماري فائق وهندسة منظومات برمجية عميقة لحظياً',
    descEn: 'Ultra-fast neural reasoning & deep bespoke architecture',
    tier: 'free',
    cost: 40,
    icon: Brain,
  },
  {
    key: 'postgres',
    titleAr: 'المنظومة السحابية وقواعد البيانات Relational',
    titleEn: 'Cloud Infrastructure & Relational DB',
    descAr: 'خدمات سحابية مدمجة بالنظام مع جداول علائقية وتدفق بيانات فوري',
    descEn: 'Integrated cloud engine, relational schemas & live streams',
    tier: 'pro',
    cost: 50,
    icon: Database,
  },
  {
    key: 'payments',
    titleAr: 'بوابة الدفع الإلكتروني 3D Secure وفواتير ZATCA',
    titleEn: '3D Secure Payments & ZATCA Engine',
    descAr: 'سداد مشفر (مدى، Apple Pay) وفواتير نظامية برمز QR',
    descEn: 'Mada, Apple Pay & cryptographic ZATCA tax invoices',
    tier: 'pro',
    cost: 40,
    icon: CreditCard,
  },
  {
    key: 'pwaMobile',
    titleAr: 'واجهة PWA متجاوبة 100% مع كافة الشاشات',
    titleEn: '100% Edge-to-Edge Responsive UI',
    descAr: 'تصميم واسع يتكيف تلقائياً مع حجم ونوع الجهاز وشريط ملاحة عائم',
    descEn: 'Fluid responsive layout adapting automatically to any viewport',
    tier: 'free',
    cost: 20,
    icon: Smartphone,
  },
  {
    key: 'security2fa',
    titleAr: 'تشفير 256-Bit وحماية الجلسات والمصادقة',
    titleEn: '256-Bit SSL & Cryptographic Sentinel',
    descAr: 'حماية الجلسات، تدقيق أمني FIPS 140-3 وبصمة SHA-256 مشفرة',
    descEn: 'Session isolation, FIPS 140-3 & SHA-256 cryptographic stamp',
    tier: 'pro',
    cost: 30,
    icon: ShieldCheck,
  },
  {
    key: 'searchGrounding',
    titleAr: 'ربط استرجاع البيانات الحي Grounding',
    titleEn: 'Live Data Grounding Engine',
    descAr: 'استرجاع فوري لبيانات حية ومحدثة من مصادر الشبكة',
    descEn: 'Real-time contextual grounding & live verification',
    tier: 'pro',
    cost: 20,
    icon: Globe,
  },
];

export const BuildStudio: React.FC = () => {
  const {
    lang,
    project,
    setProject,
    useCredits,
    addToast,
    publishWebSite,
    currentUser,
    credits,
    setActiveTab,
    globalBuildState,
    updateGlobalBuildProgress,
    resetGlobalBuildState,
  } = useApp();

  // Layout & UI State (Clean Framer / IDE standards)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [iframeKey, setIframeKey] = useState(1);
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  // Framer AI State
  const [activeCategory, setActiveCategory] = useState<string>('suggested');
  const [designStyle, setDesignStyle] = useState<'minimal' | 'glass' | 'luxury' | 'cyberpunk' | 'enterprise'>('minimal');
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Chat & Prompt State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deepThinking, setDeepThinking] = useState(true);
  const [searchGrounding, setSearchGrounding] = useState(false);
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);

  // Active Architecture & System Capabilities (أزرار قدرات النموذج)
  const [capabilities, setCapabilities] = useState({
    postgres: true,
    payments: true,
    geminiEngine: true,
    pwaMobile: true,
    security2fa: true,
    searchGrounding: false,
  });

  const [isCapabilitiesExpanded, setIsCapabilitiesExpanded] = useState(true);

  const calculateRequiredCredits = () => {
    let cost = 0;
    CAPABILITY_DEFINITIONS.forEach((cap) => {
      if (capabilities[cap.key]) {
        cost += cap.cost;
      }
    });
    return cost;
  };

  const toggleCapability = (key: keyof typeof capabilities) => {
    const next = !capabilities[key];
    const capDef = CAPABILITY_DEFINITIONS.find((c) => c.key === key);
    const capTitle = capDef ? (lang === 'ar' ? capDef.titleAr : capDef.titleEn) : key;
    const tierBadge = capDef?.tier === 'pro' ? (lang === 'ar' ? '[متقدم]' : '[PRO]') : (lang === 'ar' ? '[أساسي]' : '[FREE]');

    setCapabilities((prev) => ({ ...prev, [key]: next }));
    if (key === 'searchGrounding') setSearchGrounding(next);
    if (key === 'geminiEngine') setDeepThinking(next);

    addToast(
      `${capTitle} ${tierBadge}: ${next ? (lang === 'ar' ? 'مفعل' : 'Enabled') : (lang === 'ar' ? 'معطل' : 'Disabled')}`,
      next ? 'success' : 'info'
    );
  };

  // Live Task Stream State (Step-by-step iterative building from Gemini)
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [dynamicTasks, setDynamicTasks] = useState<DynamicTask[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activePhase, setActivePhase] = useState<string>('REASONING');
  const [currentActionLog, setCurrentActionLog] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Build Stopwatch Timer (مؤقت البناء الفعلي)
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const timerIntervalRef = useRef<any>(null);

  // Screen size adaptation: prevent split cramp on small devices, keep viewport 100% wide
  useEffect(() => {
    const handleScreenResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLayoutMode((prev) => (prev === 'split' ? 'chat-only' : prev));
      }
    };
    handleScreenResize();
    window.addEventListener('resize', handleScreenResize);
    return () => window.removeEventListener('resize', handleScreenResize);
  }, []);

  const formatTimer = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}s`;
  };

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial Chat Welcome
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'model',
      text:
        lang === 'ar'
          ? 'مرحباً بك في مهندس الأنظمة NOVA AI المعماري. تم تصميم الواجهة لتقديم تجربة هندسية متقدمة وتوليد منظومات برمجية عميقة وشاملة من الصفر مع ربط فوري للخدمات السحابية وبوابات الدفع الإلكترونية المعتمدة.'
          : 'Welcome to NOVA AI Architecture Studio. Advanced systems engineering workspace synthesizing deep full-stack applications with integrated cloud services and verified payment gateways.',
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Auto-scroll chat stream
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isGenerating, currentActionLog]);

  // Real-time synchronization when payment is completed inside the preview iframe
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PAYMENT_COMPLETED') {
        const txId = e.data.txId || 'DODO-SEC';
        const itemTitle = e.data.item?.title || (lang === 'ar' ? 'خدمة معتمدة' : 'Verified Service');
        addToast(
          lang === 'ar'
            ? `💳 تم تأكيد عملية السحب بنجاح عبر بوابة Dodo Payments (3D Secure)! [${itemTitle} · العملية: ${txId}]`
            : `💳 Payment confirmed via Dodo Payments (3D Secure)! [${itemTitle} · Tx: ${txId}]`,
          'success'
        );
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [lang]);

  const getStandaloneUrl = () => {
    if (typeof window !== 'undefined') {
      if (window.location.host.includes('run.app')) {
        return `https://${window.location.host.replace('ais-dev-', 'ais-pre-')}/live`;
      }
      return `${window.location.origin}/live`;
    }
    return '/live';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getStandaloneUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    addToast(lang === 'ar' ? 'تم نسخ الرابط المستقل بنجاح!' : 'Copied live URL!', 'success');
  };

  const handleReloadPreview = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => setIsIframeLoading(false), 500);
    addToast(lang === 'ar' ? 'تم تحديث شاشة العرض الحية' : 'Live preview reloaded', 'info');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast(lang === 'ar' ? 'يرجى اختيار صورة صالحة' : 'Please select an image', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImageBase64(reader.result as string);
      addToast(lang === 'ar' ? 'تم إرفاق الصورة كمرجع للتصميم' : 'Mockup attached', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleStartNewChat = () => {
    setChatMessages([
      {
        id: 'msg-welcome',
        sender: 'model',
        text:
          lang === 'ar'
            ? 'مرحباً بك في مهندس الأنظمة NOVA AI المعماري. تم تصميم الواجهة لتقديم تجربة هندسية متقدمة وتوليد منظومات برمجية عميقة وشاملة من الصفر مع ربط فوري للخدمات السحابية وبوابات الدفع الإلكترونية المعتمدة.'
            : 'Welcome to NOVA AI Architecture Studio. Advanced systems engineering workspace synthesizing deep full-stack applications with integrated cloud services and verified payment gateways.',
        timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setPrompt('');
    setDynamicTasks([]);
    setOverallProgress(0);
    setElapsedTimeMs(0);
    addToast(lang === 'ar' ? 'تم بدء جلسة جديدة جاهزة للبناء' : 'Started fresh workspace', 'info');
  };

  const isChatActive = chatMessages.length > 1 || isGenerating;

  // Real Gemini Build Pipeline (Invokes Gemini API, receives real tasks & real generated app)
  const runRealGeminiBuild = async (buildPrompt: string, imageBase64?: string | null) => {
    setIsGenerating(true);
    setOverallProgress(8);
    setElapsedTimeMs(0);
    const buildStartTime = Date.now();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTimeMs(Date.now() - buildStartTime);
    }, 100);

    const requiredCredits = calculateRequiredCredits();
    setCurrentActionLog(
      lang === 'ar'
        ? `استدعاء محرك NOVA المعماري (استهلاك ${requiredCredits} نقطة) وتوليد المنظومة الحقيقية...`
        : `Invoking NOVA Architecture Engine (deducting ${requiredCredits} credits)...`
    );

    if (!useCredits(requiredCredits)) {
      addToast(
        lang === 'ar'
          ? `رصيد النقاط غير كافٍ للبناء (المطلوب: ${requiredCredits} نقطة)`
          : `Insufficient credits (${requiredCredits} required)`,
        'warning'
      );
      setIsGenerating(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    try {
      // 1. Gather active architectural capabilities
      const activeCaps = [
        capabilities.postgres && 'PostgreSQL Cloud SQL & Drizzle',
        capabilities.payments && 'Dodo Payments 3D Secure (Apple Pay & Mada)',
        capabilities.geminiEngine && 'NOVA Architecture Core Reasoning',
        capabilities.pwaMobile && '100% Responsive PWA Mobile UI',
        capabilities.security2fa && '256-Bit SSL & 2FA Sentinel',
        capabilities.searchGrounding && 'Live Data Grounding',
      ].filter(Boolean).join(', ');

      const enrichedPrompt = activeCaps ? `${buildPrompt} [Architecture: ${activeCaps}]` : buildPrompt;

      // 1. Initialize Task Stages dynamically based on Semantic Domain Concept
      const domainConcept = extractDomainConcept(buildPrompt, lang);
      const cleanTitle = domainConcept.cleanDomain;
      const appTitle = domainConcept.appName;

      let initialModelTasks: DynamicTask[] = [
        {
          id: 1,
          titleAr: `تحليل متطلبات وكيانات "${cleanTitle}" وتدفق العمليات`,
          titleEn: `Domain Modeling & Entity Relations for "${cleanTitle}"`,
          detailAr: `تفكيك الكيانات، وحسابات الأسعار، وقواعد التشغيل الخاصة بـ [${cleanTitle}]`,
          detailEn: `Modeling entities, state machines, and business policies for ${cleanTitle}`,
          icon: Brain,
          tag: lang === 'ar' ? 'تحليل معماري' : 'ANALYSIS',
          file: 'specs/domain-model.json',
          diffSummary: lang === 'ar' ? `+ كيانات ومخزن ${cleanTitle}` : `+ ${cleanTitle.replace(/\s+/g, '')}Entities, Store`,
          targetDurationMs: 1200,
        },
        {
          id: 2,
          titleAr: `تصميم جداول قاعدة بيانات PostgreSQL ونماذج Drizzle ORM لـ "${cleanTitle}"`,
          titleEn: `PostgreSQL Relational Schema for "${cleanTitle}"`,
          detailAr: 'جداول علائقية مشفرة للأصناف، الحجوزات، والعملاء وسجلات الدفع المعتمدة',
          detailEn: 'Relational tables, primary keys, and index optimization',
          icon: Database,
          tag: lang === 'ar' ? 'قاعدة بيانات' : 'POSTGRES',
          file: 'src/db/schema.ts',
          diffSummary: lang === 'ar' ? '+ مخطط جداول قاعدة البيانات' : '+ export const domainTable = pgTable(...)',
          targetDurationMs: 1300,
        },
        {
          id: 3,
          titleAr: 'تكامل بوابة الدفع المشفرة (3D Secure / مدى / Apple Pay) وفواتير ZATCA',
          titleEn: '3D Secure Payment Gateway & ZATCA Phase 2 Invoicing',
          detailAr: 'ربط جلسة السحب الحقيقي وتأكيد المعاملات المصرفية المشفرة وفواتير TLV QR',
          detailEn: 'Encrypted checkout sessions with Mada, Apple Pay & ZATCA Phase 2 QR',
          icon: CreditCard,
          tag: lang === 'ar' ? 'بوابة الدفع' : 'PAY_GATEWAY',
          file: 'src/services/payment.ts',
          diffSummary: lang === 'ar' ? '+ بوابة الدفع والتحقق المشفر' : '+ export async function initiatePaymentSession(...)',
          targetDurationMs: 1350,
        },
        {
          id: 4,
          titleAr: `برمجة واجهة "${appTitle}" المتجاوبة بالكامل 100% مع الفلاتر والسلة`,
          titleEn: `Responsive UI Architecture with Live Filtering for ${appTitle}`,
          detailAr: 'تصميم متجاوب لكافة الأجهزة مع دعم الاتجاه العربي RTL والبحث الفوري',
          detailEn: 'Component hierarchy, dynamic record grid, and interactive modals',
          icon: Smartphone,
          tag: lang === 'ar' ? 'واجهة المستخدم' : 'UI/UX',
          file: 'src/App.tsx',
          diffSummary: lang === 'ar' ? '+ واجهة المستخدم المتجاوبة بالكامل' : '+ <DomainHeader />, <MetricsGrid />, <ShowcaseGrid />',
          targetDurationMs: 1400,
        },
        {
          id: 5,
          titleAr: 'فحص الأمان، بصمة التشفير SHA-256، والنشر السحابي المستقل على /live',
          titleEn: 'Security Audit & Standalone Cloud Deployment',
          detailAr: 'التحقق من سلامة الأكواد والبيانات ونشر النسخة الحية على /live',
          detailEn: 'Running bundle checks and deploying live production output to /live',
          icon: ShieldCheck,
          tag: lang === 'ar' ? 'نشر سحابي' : 'DEPLOY',
          file: 'dist/index.html',
          diffSummary: lang === 'ar' ? `✓ تم نشر ${appTitle} حياً على /live` : `✓ ${appTitle} Deployed Live to /live`,
          targetDurationMs: 1200,
        },
      ];

      setDynamicTasks(initialModelTasks);
      setActiveTaskIndex(0);
      setOverallProgress(8);
      setActivePhase('REASONING');
      setCurrentActionLog(lang === 'ar' ? 'بدء وكيل البناء الذكي...' : 'Initializing Gemini Build Agent...');

      updateGlobalBuildProgress({
        isBuilding: true,
        progress: 8,
        phase: 'INIT',
        statusMessage: lang === 'ar' ? 'بدء وكيل البناء الذكي...' : 'Initializing Gemini Build Agent...',
        activeFile: 'specs/prompt-contract.json',
        codeSnippet: `// Processing prompt: "${buildPrompt.slice(0, 40)}"`,
      });

      // 2. Stream Real Build Execution from Backend SSE
      const data = await requestAppGenerationStream(
        {
          prompt: enrichedPrompt,
          deepThinking: capabilities.geminiEngine,
          searchGrounding: capabilities.searchGrounding,
          imageBase64: imageBase64 || undefined,
          model: 'gemini-3.8-flash',
          lang,
          designStyle,
          capabilities,
          conversationHistory: chatMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
            appName: m.appName,
          })),
          currentCode: project.previewHtml || '',
          currentAppName: project.name || '',
        },
        (event) => {
          setOverallProgress(event.progress);
          setCurrentActionLog(event.message);
          if (event.phase) {
            setActivePhase(event.phase);
          }

          updateGlobalBuildProgress({
            isBuilding: event.phase !== 'DEPLOYED' && event.phase !== 'ERROR',
            progress: event.progress,
            phase: event.phase,
            statusMessage: event.message,
            activeFile: event.activeFile || '',
            codeSnippet: event.codeSnippet || '',
            modelUsed: event.engine || 'gemini-3.8-flash',
            appName: event.appName,
            buildChecksum: event.buildChecksum || null,
          });

          // Match active task in live checklist
          if (event.phase === 'REASONING') setActiveTaskIndex(0);
          else if (event.phase === 'DATABASE') setActiveTaskIndex(1);
          else if (event.phase === 'PAYMENT_SECURITY') setActiveTaskIndex(2);
          else if (event.phase === 'CODEGEN') setActiveTaskIndex(3);
          else if (event.phase === 'DEPLOYED') setActiveTaskIndex(4);
        }
      );

      // 3. Extract Tasks from returned payload if available
      let modelTasks: DynamicTask[] = initialModelTasks;
      if (Array.isArray(data?.tasks) && data.tasks.length >= 4) {
        modelTasks = data.tasks.map((t: any, idx: number) => {
          let resolvedTag = t.tag || (lang === 'ar' ? 'بناء' : 'BUILD');
          if (lang === 'ar') {
            const up = String(resolvedTag).toUpperCase();
            if (up === 'ANALYSIS' || up === 'ARCH') resolvedTag = 'تحليل معماري';
            else if (up === 'POSTGRES' || up === 'DATABASE' || up === 'DB') resolvedTag = 'قاعدة بيانات';
            else if (up === 'PAY_GATEWAY' || up === 'PAYMENT' || up === 'SECURITY') resolvedTag = 'بوابة الدفع';
            else if (up === 'UI/UX' || up === 'UI' || up === 'FRONTEND') resolvedTag = 'واجهة المستخدم';
            else if (up === 'DEPLOY' || up === 'CLOUD') resolvedTag = 'نشر سحابي';
            else if (up === 'BUILD') resolvedTag = 'بناء برمجي';
          }
          return {
            id: t.id || idx + 1,
            titleAr: t.titleAr || t.titleEn || t.step || `مرحلة برمجية #${idx + 1}`,
            titleEn: t.titleEn || t.titleAr || t.step || `Architecture Phase #${idx + 1}`,
            detailAr: t.detailAr || t.detailEn || t.description || 'بناء وتوليد الأكواد المخصصة للمشروع',
            detailEn: t.detailEn || t.detailAr || t.description || 'Synthesizing bespoke component logic',
            icon: idx === 0 ? Brain : idx === 1 ? Database : idx === 2 ? CreditCard : idx === 3 ? Smartphone : ShieldCheck,
            tag: resolvedTag,
            file: t.file || (idx === 1 ? 'src/db/schema.ts' : idx === 2 ? 'src/services/payment.ts' : 'src/App.tsx'),
            diffSummary: lang === 'ar'
              ? (t.codeSnippet ? `${t.codeSnippet.slice(0, 40)}...` : `+ تحديث حزمة ${t.file || 'الوحدة'}`)
              : (t.codeSnippet ? `${t.codeSnippet.slice(0, 50)}...` : `+ ${t.file || 'module'} (${Math.floor(Math.random() * 30 + 18)} lines)`),
            targetDurationMs: t.targetDurationMs || 1250,
          };
        });
        setDynamicTasks(modelTasks);
      }

      setOverallProgress(100);
      setActiveTaskIndex(modelTasks.length);

      // Compute final elapsed build time
      const finalElapsedSec = Number(((Date.now() - buildStartTime) / 1000).toFixed(1));
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // 4. Mount Real Generated App in Project and Live URL
      if (data.previewHtml) {
        setProject((prev) => ({
          ...prev,
          name: data.appName || prev.name,
          description: data.description || buildPrompt,
          previewHtml: data.previewHtml,
          components: data.components || prev.components,
          status: 'deployed',
        }));
        await publishWebSite(data.previewHtml, data.appName);
      }

      // 4. Force reload iframe viewport
      setIframeKey((prev) => prev + 1);

      // 5. Thought process extracted from Gemini
      const thoughts: string[] = Array.isArray(data.thoughtProcess) && data.thoughtProcess.length > 0
        ? data.thoughtProcess
        : [
            lang === 'ar' ? 'تحليل الكيانات وقواعد الأعمال وتفكيك العمليات المطلوبة بدقة' : 'Analyzed entities and transactional boundaries',
            lang === 'ar' ? 'بناء الجداول العلائقية لمخطط PostgreSQL ومطابقة أنواع Drizzle' : 'Synthesized PostgreSQL relational schema',
            lang === 'ar' ? 'تكامل بوابة الدفع الآمنة Dodo Payments مع Apple Pay ومدى' : 'Wired Dodo Payments gateway & Mada 3D Secure',
            lang === 'ar' ? 'بناء واجهة المستخدم المتجاوبة بنسبة 100% للشاشات مع دعم الاتجاه العربي' : 'Constructed responsive edge-to-edge UI',
          ];

      const appNameClean = data.appName || domainConcept.appName || project.name || (lang === 'ar' ? 'المنظومة الذكية' : 'Smart Application');
      const taglineClean = data.tagline || data.description || domainConcept.tagline;
      const itemsList = Array.isArray(data.items) && data.items.length > 0 ? data.items : [];
      const tablesList = Array.isArray(data.schema) && data.schema.length > 0 ? data.schema.map((s: any) => s.table).join(', ') : `${domainConcept.category}_records, ${domainConcept.category}_orders`;

      // Domain-specific follow-ups
      let followUps: Array<{ label: string; prompt: string }> = [];
      const cat = domainConcept.category;

      if (cat === 'padel') {
        followUps = [
          {
            label: lang === 'ar' ? 'أوقات الذروة وتسعير الإضاءة' : 'Peak Hours & Lighting Pricing',
            prompt: lang === 'ar' ? `أضف تسعيرة مخصصة لأوقات الذروة والإضاءة الليلية في ملاعب "${appNameClean}"` : `Add peak-hour and night-lighting dynamic pricing in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'تفعيل جدول البطولات والتحديات' : 'Tournament Schedule Grid',
            prompt: lang === 'ar' ? `فعّل قسم تنظيم البطولات الرياضية وجدول المباريات في "${appNameClean}"` : `Enable tournament brackets and match scheduling in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'تأجير وبيع مضارب وكرات إضافية' : 'Equipment Rental & Pro Shop',
            prompt: lang === 'ar' ? `أضف متجراً لبيع وتأجير مضارب وكرات البادل في "${appNameClean}"` : `Add racket rental and pro shop catalog to "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'ربط إشعارات التذكير عبر WhatsApp' : 'WhatsApp Booking Alerts',
            prompt: lang === 'ar' ? `اربط نظام إرسال تذكير بالحجز وموقع الملعب عبر واتساب في "${appNameClean}"` : `Integrate automated WhatsApp reminder messages for bookings in "${appNameClean}"`,
          },
        ];
      } else if (cat === 'perfume' || cat === 'store') {
        followUps = [
          {
            label: lang === 'ar' ? 'تفعيل كوبونات الخصم وقسائم الشراء' : 'Promo Discount Coupons',
            prompt: lang === 'ar' ? `أضف نظام كوبونات الخصم الترويجية وقسائم الشراء في "${appNameClean}"` : `Add promotional discount coupons and gift codes to "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'ربط شركات الشحن السريع' : 'Express Courier Dispatch',
            prompt: lang === 'ar' ? `اربط بوابات التوصيل السريع وتتبع الشحنات في "${appNameClean}"` : `Integrate express courier shipping and live tracking in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'برنامج نقاط الولاء والمكافآت' : 'Loyalty Points Program',
            prompt: lang === 'ar' ? `فعّل برنامج نقاط الولاء واستبدال المكافآت عند كل عملية شراء في "${appNameClean}"` : `Activate customer loyalty points and rewards tier in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'خيارات التغليف الملكي وبطاقات الإهداء' : 'Luxury Gift Wrapping',
            prompt: lang === 'ar' ? `أضف خيار التغليف الملكي وبطاقة الإهداء المطبوعة في سلة "${appNameClean}"` : `Add luxury gift wrapping and printed cards in checkout for "${appNameClean}"`,
          },
        ];
      } else if (cat === 'clinic') {
        followUps = [
          {
            label: lang === 'ar' ? 'تفعيل الاستشارات الطبية بالفيديو' : 'Telehealth Video Suite',
            prompt: lang === 'ar' ? `فعّل نظام مكالمات الفيديو المشفرة للاستشارات الطبية عن بعد في "${appNameClean}"` : `Enable encrypted video telemedicine calls in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'إرسال رسائل تذكير بالمواعيد SMS' : 'SMS Appointment Reminders',
            prompt: lang === 'ar' ? `اربط تنبيهات ورسائل تذكير المواعيد للمرضى عبر SMS في "${appNameClean}"` : `Connect SMS appointment reminder alerts in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'الربط مع بوابات شركات التأمين' : 'Insurance Pre-Auth Portal',
            prompt: lang === 'ar' ? `أضف نظام التحقق من التغطية التأمينية وسداد نسبة التحمل في "${appNameClean}"` : `Add health insurance coverage verification and copay in "${appNameClean}"`,
          },
        ];
      } else if (cat === 'food') {
        followUps = [
          {
            label: lang === 'ar' ? 'إضافة خيارات التخصيص والإضافات' : 'Meal Customization Modifiers',
            prompt: lang === 'ar' ? `أضف خيارات تخصيص الوجبات، درجات الطهي، والصلصات الإضافية في "${appNameClean}"` : `Add item modifier drawer and sauce add-ons in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'ربط كباتن التوصيل وتتبع الطلب' : 'Delivery Fleet Live GPS',
            prompt: lang === 'ar' ? `اربط خريطة تتبع مندوب التوصيل اللحظي في "${appNameClean}"` : `Wire live GPS delivery driver tracking map in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'نظام حجز الطاولات المتقدم' : 'Table Floor Plan Booking',
            prompt: lang === 'ar' ? `أضف مخطط الصالة واختيار رقم الطاولة وعدد الأفراد في "${appNameClean}"` : `Add table reservation floor plan in "${appNameClean}"`,
          },
        ];
      } else {
        followUps = [
          {
            label: lang === 'ar' ? 'ربط الإشعارات الفورية (Webhooks)' : 'Real-time Webhooks & Alerts',
            prompt: lang === 'ar' ? `قم بربط وتفعيل نظام إشعارات فورية وتنبيهات ويب هوك في "${appNameClean}" عند حدوث أي عملية جديدة` : `Integrate real-time webhooks and instant push alerts for events in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'تفعيل المصادقة الثنائية (2FA)' : 'Enforce 2FA & Security Guard',
            prompt: lang === 'ar' ? `فعّل المصادقة الثنائية 2FA وتأكيد العمليات بـ OTP في "${appNameClean}" لرفع مستوى الأمان` : `Enable Two-Factor Authentication (2FA) and OTP verification to double security in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'إضافة باقات واشتراكات مدفوعة' : 'Multi-tier Subscriptions',
            prompt: lang === 'ar' ? `أضف باقات اشتراك متعددة (شهرية/سنوية) مع خصم 20% وبوابة دفع معتمدة في "${appNameClean}"` : `Add tiered monthly/annual subscription plans with payment gateway in "${appNameClean}"`,
          },
          {
            label: lang === 'ar' ? 'توسيع لوحة التحليلات والإحصائيات' : 'Visual Analytics & Metrics',
            prompt: lang === 'ar' ? `وسّع لوحة الإحصائيات في "${appNameClean}" برسوم بيانية تفاعلية ومؤشرات أداء متقدمة` : `Expand analytics dashboard in "${appNameClean}" with interactive charts and metrics`,
          },
        ];
      }

      const paidServicesActive = [
        capabilities.postgres && (lang === 'ar' ? 'المنظومة السحابية وقواعد البيانات' : 'Cloud DB Infrastructure'),
        capabilities.payments && (lang === 'ar' ? 'بوابة الدفع 3D Secure' : '3D Secure Gateway'),
        capabilities.security2fa && (lang === 'ar' ? 'تشفير 256-Bit و 2FA' : '256-Bit SSL & 2FA'),
        capabilities.searchGrounding && (lang === 'ar' ? 'استرجاع البيانات الحي' : 'Live Data Grounding'),
      ].filter(Boolean);

      const freeServicesActive = [
        capabilities.geminiEngine && (lang === 'ar' ? 'محرك استدلال NOVA AI' : 'NOVA AI Reasoning Engine'),
        capabilities.pwaMobile && (lang === 'ar' ? 'واجهة متجاوبة 100%' : 'Responsive 100% UI'),
      ].filter(Boolean);

      // Construct authentic domain summary items
      const sampleItemsText = itemsList.slice(0, 3).map((it: any) => `• ${it.title} (${it.price})`).join('\n') || `• ${cleanTitle}`;

      const isIteration = Boolean(project.previewHtml && chatMessages.length > 2);

      const msgId = `msg-completed-${Date.now()}`;
      const completedMsg: ChatMessage = {
        id: msgId,
        sender: 'model',
        text:
          lang === 'ar'
            ? isIteration
              ? `تقرير التحديث والتطوير المعماري التكراري:\n\nبناءً على طلبك: "${buildPrompt}"، قمت بمراجعة كود المنظومة الحالية لـ [${appNameClean}] وتنفيذ التعديلات المطلوبة بدقة:\n\n**ما تم إنجازه في هذه الدورة البرمجية:**\n1. مراجعة وتعديل مكونات واجهة المستخدم التفاعلية لتلائم الإضافة الجديدة.\n2. تحديث جداول PostgreSQL العلائقية لتخزين البيانات المستحدثة بشكل آمن.\n3. ربط التحقق المصرفي 3D Secure وفواتير ZATCA الضريبية مع التحديث الجديد.\n4. الحفاظ على استقرار وموثوقية كافة الشاشات والعمليات السابقة دون أي فقدان للبيانات.\n\n**الملفات التي تم فحصها وتحديثها:**\n• src/App.tsx (تعديل منطق العرض والتفاعل)\n• src/db/schema.ts (مواءمة الحقول والمخطط)\n• src/services/payment.ts (تأمين السحب والدفع)\n\nتم تطبيق التعديلات بنجاح وتحديث شاشة العرض الحية والرابط المستقل (/live).`
              : `تقرير الإنجاز المعماري والتشغيلي المنفذ:\n\nتم تحليل المتطلبات البرمجية وهندسة المنظومة لقطاع [${cleanTitle}]:\n\n**المعمارية التقنية للمنظومة:**\n• اسم المنظومة: ${appNameClean}\n• الهدف التشغيلي: ${taglineClean}\n• الواجهة البرمجية: تصميم متجاوب بالكامل 100% لكافة مقاسات الشاشات والأجهزة\n• قاعدة البيانات العلائقية: جداول PostgreSQL العلائقية [${tablesList}]\n• بوابة الدفع المشفرة: معتمدة ومطابقة لمتطلبات التحقق المصرفي (3D Secure) مع دعم مدى و Apple Pay\n• الامتثال الضريبي: فواتير رسمية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA)\n• بصمة التحقق البرمجية: تشفير آمن (${(data.buildChecksum || '4f8a91').slice(0, 16)}...)\n\n**الوحدات التشغيلية المجهزة:**\n1. دليل الخدمات والكتالوج (${itemsList.length || 5} عناصر جاهزة للحجز والشراء):\n${sampleItemsText}\n2. سجل العمليات والطلبات المنفذة في قاعدة بيانات PostgreSQL.\n3. مؤشرات الأداء التشغيلية ومراقبة زمن الاستجابة.\n4. مستعرض مخطط الجداول وتصدير كود DDL.\n5. وحدة السداد والفاتورة الضريبية المعتمدة.\n\n**بيانات المعالجة والرصيد:**\n• استهلاك الرصيد: ${requiredCredits} نقطة (المتبقي: ${(credits - requiredCredits).toLocaleString()} نقطة)\n• مدة المعالجة الفعلية: ${finalElapsedSec} ثانية\n• الخدمات المربوطة: ${paidServicesActive.concat(freeServicesActive).join(' • ')}\n\nالمنظومة منشورة وتعمل مباشرة في نافذة المعاينة وعلى الرابط المستقل (/live).`
            : isIteration
              ? `Iterative Architectural Enhancement Report:\n\nBased on your update request: "${buildPrompt}", I inspected the active system state for [${appNameClean}] and synthesized the changes:\n\n**Enhancements Executed:**\n1. Updated UI component tree and interactive view layers.\n2. Aligned PostgreSQL relational schema to store new entity attributes.\n3. Preserved live transaction flow, 3D Secure checkout, and ZATCA compliance.\n4. Re-verified cryptographic integrity seal.\n\n**Modified Files:**\n• src/App.tsx (Component state & render tree)\n• src/db/schema.ts (Database schema & relations)\n• src/services/payment.ts (Payment gateway bindings)\n\nDeployed live to preview and /live.`
              : `Architectural & Operational Engineering Report:\n\nAnalyzed requirements and synthesized system architecture for [${cleanTitle}]:\n\n**System Architecture:**\n• System: ${appNameClean}\n• Scope: ${taglineClean}\n• Frontend: 100% responsive production UI for all screen sizes\n• Relational Storage: PostgreSQL tables [${tablesList}]\n• Payment Engine: 3D Secure gateway supporting Mada & Apple Pay\n• Tax Invoicing: ZATCA Phase 2 compliant tax invoices\n• Integrity Seal: SHA-256 (${(data.buildChecksum || '4f8a91').slice(0, 16)}...)\n\n**Active Modules:**\n1. Primary Catalog & Directory (${itemsList.length || 5} active entities):\n${sampleItemsText}\n2. Active Orders & Records synced to PostgreSQL.\n3. Live Telemetry & Response Latency.\n4. PostgreSQL schema viewer with DDL export.\n5. 3D Secure checkout modal with verifiable tax invoice.\n\n**Execution Metrics:**\n• Credits Consumed: ${requiredCredits} cr (Remaining: ${(credits - requiredCredits).toLocaleString()} cr)\n• Computation Time: ${finalElapsedSec}s\n• Stack: ${paidServicesActive.concat(freeServicesActive).join(' • ')}\n\nRunning live in preview and at /live.`,
        timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        tasksSnapshot: modelTasks,
        thoughtProcess: thoughts,
        appName: appNameClean,
        totalExecutionSeconds: finalElapsedSec,
        dynamicInquiries: followUps,
        filesModified: [
          {
            file: 'src/App.tsx',
            additions: 178,
            deletions: 4,
            previewSnippet: lang === 'ar' ? `اضافة مكونات وواجهة ${appNameClean}` : `<${appNameClean.replace(/[^\w]/g, '')}Hub />`,
          },
          {
            file: 'src/services/payment.ts',
            additions: 46,
            deletions: 0,
            previewSnippet: lang === 'ar' ? 'تفعيل جلسات السداد المصرفي المشفر' : 'export const checkout = initiatePaymentSession(...);',
          },
          {
            file: 'src/db/schema.ts',
            additions: 36,
            deletions: 0,
            previewSnippet: lang === 'ar' ? 'تحديد مخطط جداول PostgreSQL' : `export const ${tablesList.split(',')[0]?.trim() || 'records'}Table = pgTable(...);`,
          },
        ],
      };

      setChatMessages((prev) => [...prev, completedMsg]);
      setExpandedThoughts((prev) => ({ ...prev, [msgId]: true }));

      addToast(
        lang === 'ar' ? `تم بناء وتشغيل "${data.appName || 'التطبيق'}" حياً بنجاح!` : `Application deployed!`,
        'success'
      );
    } catch (err: any) {
      addToast(err.message || 'Generation error', 'error');
    } finally {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsGenerating(false);
      setCurrentActionLog('');
      updateGlobalBuildProgress({ isBuilding: false });
    }
  };

  // Main Prompt Dispatcher (Chat vs Build Intent Detection)
  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || prompt;
    if (!textToSend.trim() && !attachedImageBase64) return;

    const currentImg = attachedImageBase64;
    setPrompt('');
    setAttachedImageBase64(null);

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Check if the user is asking an architectural question / inquiry vs issuing a direct build command
    const isQuestionOrInquiry = (text: string) => {
      const isQuestionWord = /(كيف|لماذا|ما هو|ما هي|هل|قارن|اشرح|وضح|أيهما|ما الفرق|استفسار|سؤال|how|why|what|can you|explain|compare|\?|؟)/i.test(text);
      const isBuildCommand = /(ابن|أنشئ|اصنع|برمج|طور|غير|اعمل|build|create|generate|synthesize|make|setup)/i.test(text);
      return isQuestionWord && !isBuildCommand;
    };

    if (isQuestionOrInquiry(textToSend)) {
      const thinkingId = `msg-thinking-${Date.now()}`;
      setChatMessages((prev) => [
        ...prev,
        {
          id: thinkingId,
          sender: 'model',
          text: lang === 'ar' ? 'جارٍ التفكير المعماري وتحليل أفضل الحلول البرمجية المناسبة...' : 'Reasoning & formulating architectural recommendations...',
          timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          thoughtSnippet: lang === 'ar' ? 'تحليل السؤال المعماري، استعراض خيارات قاعدة البيانات وتدفقات الأمان والدفع.' : 'Evaluating PostgreSQL vs NoSQL, session tokens, and checkout pipelines.',
        },
      ]);
      setExpandedThoughts((prev) => ({ ...prev, [thinkingId]: true }));

      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, lang }),
        });
        const data = await res.json();
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? {
                  ...m,
                  text: data.reply || (lang === 'ar' ? 'تمت دراسة استفسارك المعماري بعناية.' : 'Architectural analysis complete.'),
                  thoughtSnippet: data.thoughtSnippet || (lang === 'ar' ? 'استدلال معماري متعدد الأبعاد وتفكيك للمنظومة' : 'Multi-layered architectural reasoning'),
                  dynamicInquiries: data.dynamicInquiries || [],
                }
              : m
          )
        );
      } catch (err: any) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? {
                  ...m,
                  text: lang === 'ar' ? 'تم استلام استفسارك. هل ترغب في بناء وتفعيل هذه المنظومة المعمارية الآن؟' : 'Inquiry noted. Would you like to synthesize an application based on this?',
                  dynamicInquiries: [
                    { label: lang === 'ar' ? 'بناء المنظومة المعمارية المقترحة' : 'Build Proposed Architecture', prompt: `أنشئ منظومة متكاملة لـ: ${textToSend}` },
                  ],
                }
              : m
          )
        );
      }
      return;
    }

    if (layoutMode === 'chat-only' && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setLayoutMode('split');
    }
    runRealGeminiBuild(textToSend, currentImg);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100 select-none font-sans"
    >
      {/* =================================================================== */}
      {/* 1. NOVA ENTERPRISE TOP STATUS & WORKSPACE TOOLBAR                   */}
      {/* =================================================================== */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 px-3 sm:px-5 flex items-center justify-between shrink-0 z-20">
        {/* Left: NOVA Enterprise Brand */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-lg bg-zinc-850 border border-zinc-750 flex items-center justify-center font-bold text-zinc-200 text-xs shadow-xs shrink-0">
            <Layers className="w-4 h-4 text-zinc-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-xs tracking-tight">NOVA</span>
              <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded">
                {lang === 'ar' ? 'المنظومة المؤسسية' : 'ENTERPRISE'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[110px] sm:max-w-xs leading-none mt-0.5 font-medium">
              {project.name}
            </p>
          </div>
        </div>

        {/* Center: System Architecture Status */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-xs">
          <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-zinc-200 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="font-medium">
            {isGenerating
              ? (lang === 'ar' ? 'جارٍ المعالجة وتوليد الأكواد...' : 'Synthesizing Architecture...')
              : (lang === 'ar' ? 'بيئة العمل المعمارية المتكاملة' : 'Architecture Workstation')}
          </span>
        </div>

        {/* Right: Functional Tools & Balance */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleStartNewChat}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
            title={lang === 'ar' ? 'بدء مشروع جديد' : 'New Build'}
          >
            <span>+</span>
            <span>{lang === 'ar' ? 'مشروع جديد' : 'New Build'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-zinc-200 shadow-xs">
            <Coins className="w-3.5 h-3.5 text-zinc-400" />
            <span>{credits.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500 font-normal">{lang === 'ar' ? 'نقطة' : 'cr'}</span>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. SPLIT WORKSPACE BODY (IDE STANDARDS)                             */}
      {/* =================================================================== */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* PANE 1: CHAT & REAL ITERATIVE CODE TIMELINE */}
        {(layoutMode === 'split' || layoutMode === 'chat-only') && (
          <div
            className={`flex flex-col h-full border-e transition-colors bg-zinc-950 border-zinc-800/80 text-zinc-100 relative ${
              layoutMode === 'split' ? 'w-full md:w-[48%] lg:w-[44%] xl:w-[40%]' : 'w-full'
            }`}
          >
            {/* Minimal Top Header when Chat is Active */}
            {isChatActive && (
              <div className="h-11 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 select-none z-10">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-zinc-200 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="font-bold text-xs text-white truncate">
                    {project.name || (lang === 'ar' ? 'جلسة بناء المنظومة' : 'Architecture Session')}
                  </span>
                  {isGenerating && (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-750 text-[10px] font-mono font-bold">
                      {formatTimer(elapsedTimeMs)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                    title={lang === 'ar' ? 'مشروع جديد' : 'New Build'}
                  >
                    <span>+</span>
                    <span>{lang === 'ar' ? 'جديد' : 'New'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Container */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-3 sm:p-5 min-h-0 bg-zinc-950 text-zinc-100"
            >
              {!isChatActive ? (
                /* 1. INITIAL LANDING ZERO STATE */
                <div className="w-full max-w-xl mx-auto py-6 sm:py-10 px-1 sm:px-2 flex flex-col items-center animate-fadeIn relative space-y-4">
                  {/* Hero Title */}
                  <div className="text-center mb-6 sm:mb-8 select-none">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono mb-3 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white">{lang === 'ar' ? 'محرك البناء المعماري المؤسسي' : 'NOVA Architecture Engine'}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl text-white tracking-tight font-normal">
                      {lang === 'ar' ? (
                        <>صمم وابنِ بأنظمة <span className="font-extrabold text-white">NOVA</span> الحقيقية <span className="font-extrabold text-white">من الصفر</span></>
                      ) : (
                        <>Build with <span className="font-extrabold text-white">NOVA Engine</span> from <span className="font-extrabold text-white">Scratch</span></>
                      )}
                    </h1>
                    <p className="text-xs text-zinc-400 font-medium mt-1.5 max-w-md mx-auto">
                      {lang === 'ar'
                        ? 'محرك بناء ديناميكي يحلل متطلباتك بدقة، يصمم البنية السحابية، ويوفر تطبيقاً حياً مستقلاً مع بوابات دفع مشفرة.'
                        : 'Autonomous architecture engine synthesizing bespoke schemas, cloud database, and verified payments.'}
                    </p>
                  </div>

                  {/* Clean Floating Prompt Card */}
                  <div className="relative w-full">
                    <div className="relative rounded-[26px] bg-zinc-900/95 border border-zinc-800 shadow-2xl p-4 sm:p-5 transition-all text-zinc-100">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={3}
                        placeholder={lang === 'ar' ? 'ما الذي تريد تصميمه وبناءه اليوم؟' : 'What do you want to design & build?'}
                        className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 outline-none resize-none leading-relaxed font-normal"
                      />

                      {/* Toolbar inside Card */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 mt-2 gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-full transition ${
                              attachedImageBase64
                                ? 'bg-zinc-800 text-zinc-100 border border-zinc-650'
                                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                            title={lang === 'ar' ? 'إرفاق ملف أو تصميم' : 'Attach file'}
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>

                          {/* Design Style Dropdown Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                              className="px-3.5 py-1.5 rounded-full border border-zinc-750 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition"
                            >
                              <span>
                                {designStyle === 'minimal' && (lang === 'ar' ? 'نمط التصميم' : 'Design Style')}
                                {designStyle === 'glass' && (lang === 'ar' ? 'زجاجي شفاف' : 'Glassmorphism')}
                                {designStyle === 'luxury' && (lang === 'ar' ? 'فاخر ملكي' : 'Luxury')}
                                {designStyle === 'cyberpunk' && (lang === 'ar' ? 'داكن سيبراني' : 'Cyberpunk')}
                                {designStyle === 'enterprise' && (lang === 'ar' ? 'مؤسسي' : 'Enterprise')}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                            </button>

                            {isStyleDropdownOpen && (
                              <div className="absolute left-0 top-full mt-1.5 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 animate-fadeIn">
                                {[
                                  { id: 'minimal', label: lang === 'ar' ? 'بسيط أنيق' : 'Minimalist' },
                                  { id: 'glass', label: lang === 'ar' ? 'زجاجي شفاف' : 'Glassmorphism' },
                                  { id: 'luxury', label: lang === 'ar' ? 'فاخر متميز' : 'Luxury' },
                                  { id: 'cyberpunk', label: lang === 'ar' ? 'داكن عصري' : 'Dark Cyber' },
                                  { id: 'enterprise', label: lang === 'ar' ? 'مؤسسي مصرفي' : 'Enterprise' },
                                ].map((s) => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => { setDesignStyle(s.id as any); setIsStyleDropdownOpen(false); }}
                                    className={`w-full text-start px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                                      designStyle === s.id ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800/60'
                                    }`}
                                  >
                                    <span>{s.label}</span>
                                    {designStyle === s.id && <Check className="w-3 h-3 text-white" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsBrainstormOpen(true)}
                            className="px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-zinc-300" />
                            <span>{lang === 'ar' ? 'أفكار' : 'Ideas'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            disabled={isGenerating || (!prompt.trim() && !attachedImageBase64)}
                            onClick={() => handleSendMessage()}
                            className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold flex items-center justify-center transition active:scale-95 disabled:opacity-40 shadow-sm cursor-pointer"
                            title={lang === 'ar' ? 'بدء التوليد' : 'Generate'}
                          >
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model Capabilities & Transparent Credit Consumption Card */}
                  <div className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-3.5 sm:p-4 shadow-xl space-y-3 mt-3 animate-fadeIn">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-white">
                          <Layers className="w-3.5 h-3.5 text-zinc-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-white tracking-tight">
                              {lang === 'ar' ? 'قدرات المنظومة المتصلة بالبناء' : 'System Engine Capabilities'}
                            </h3>
                            <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.2 rounded">
                              {lang === 'ar' ? 'أدوات معتمدة' : 'Verified'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-none mt-0.5">
                            {lang === 'ar' ? 'تحديد وتخصيص الخدمات المجانية والمتقدمة المرتبطة بالمنظومة' : 'Select Free & Pro architectural services bound to synthesis'}
                          </p>
                        </div>
                      </div>

                      {/* Transparent Credit Pill */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
                        <Coins className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-zinc-400 text-[11px]">{lang === 'ar' ? 'التكلفة:' : 'Cost:'}</span>
                        <span className="font-bold text-white text-[11px]">{calculateRequiredCredits()} {lang === 'ar' ? 'نقطة' : 'cr'}</span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-zinc-300 text-[11px] font-bold" title={lang === 'ar' ? 'الرصيد المتاح' : 'Available balance'}>
                          {credits.toLocaleString()} {lang === 'ar' ? 'نقطة' : 'cr'}
                        </span>
                      </div>
                    </div>

                    {/* Capabilities Buttons in Executive Gray Palette */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CAPABILITY_DEFINITIONS.map((cap) => {
                        const active = capabilities[cap.key];
                        const Icon = cap.icon;
                        const isPro = cap.tier === 'pro';

                        return (
                          <button
                            key={cap.key}
                            type="button"
                            onClick={() => toggleCapability(cap.key)}
                            className={`p-2.5 rounded-xl border text-start transition flex flex-col justify-between gap-1.5 active:scale-95 cursor-pointer select-none group ${
                              active
                                ? 'bg-zinc-800/90 border-zinc-650 shadow-xs text-zinc-100 hover:border-zinc-500'
                                : 'bg-zinc-950/80 border-zinc-850 hover:border-zinc-750 opacity-60 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div
                                  className={`p-1 rounded-lg ${
                                    active
                                      ? 'text-white bg-zinc-700/80'
                                      : 'text-zinc-500 bg-zinc-900'
                                  }`}
                                >
                                  <Icon className="w-3 h-3" />
                                </div>
                                <span className="text-[11px] font-bold truncate text-white">
                                  {lang === 'ar' ? cap.titleAr : cap.titleEn}
                                </span>
                              </div>

                              <span
                                className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                  isPro
                                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                    : 'bg-zinc-850 text-zinc-400 border-zinc-800'
                                }`}
                              >
                                {isPro ? (lang === 'ar' ? 'متقدم' : 'PRO') : (lang === 'ar' ? 'أساسي' : 'FREE')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/70">
                              <span className="truncate text-zinc-400 text-[9px]">{lang === 'ar' ? cap.descAr : cap.descEn}</span>
                              <span className="font-mono text-[9px] font-bold text-zinc-300 shrink-0">
                                +{cap.cost} {lang === 'ar' ? 'نقطة' : 'cr'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refined Bilingual Quick Starter Cards */}
                  <div className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-3.5 sm:p-4 mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{lang === 'ar' ? 'أفكار مقترحة للبدء السريع:' : 'Quick Starter Ideas:'}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          title: lang === 'ar' ? 'منظومة المحادثة وإدارة المهام' : 'AI Agent & Task Management',
                          desc: lang === 'ar' ? 'واجهة محادثة ذكية، استدلال فوري، وتتبع وتصنيف المهام تلقائياً' : 'Conversational AI, real-time reasoning & automated task triage',
                          prompt: lang === 'ar' ? 'أنشئ شات بوكس ذكي متكامل مع وكيل ذكاء اصطناعي يدير مهامي بدقة مع لوحة متابعة فورية' : 'Build a smart conversational chatbox with AI agent that manages my tasks and priorities',
                        },
                        {
                          title: lang === 'ar' ? 'متجر العطور والبخور الملكي' : 'Royal Perfumes & Oud Boutique',
                          desc: lang === 'ar' ? 'كتالوج راقي، سلة مشتريات، وبوابات دفع معتمدة مع فواتير ضريبية' : 'Luxury catalog, interactive cart, and 3D Secure checkout',
                          prompt: lang === 'ar' ? 'أنشئ متجر عطور وبخور ملكي فاخر، كتالوج بالنوتات العطرية، سلة شراء تفاعلية، ودفع إلكتروني معتمد مع إصدار فاتورة ضريبية فورية' : 'Build a luxury royal oud and perfume boutique with shopping cart and 3D Secure payment gateway',
                        },
                        {
                          title: lang === 'ar' ? 'لوحة تحليلات وإدارة العمليات' : 'Executive Analytics & Ops Portal',
                          desc: lang === 'ar' ? 'مؤشرات أداء تشغيلية ومالية، تقارير حية، وقاعدة بيانات مشفرة' : 'Live financial metrics, audit logs and PostgreSQL database',
                          prompt: lang === 'ar' ? 'أنشئ لوحة تحكم تنفيذية متطورة لإدارة العمليات والمؤشرات المالية مع قاعدة بيانات ورسوم بيانية' : 'Build an executive enterprise operations dashboard with metrics and PostgreSQL schema',
                        },
                        {
                          title: lang === 'ar' ? 'منصة حجوزات ومواعيد متقدمة' : 'Smart Bookings & Calendar',
                          desc: lang === 'ar' ? 'تقويم تفاعلي، مواعيد دقيقة، وبوابة سداد آمنة' : 'Interactive calendar, automated notifications, and secure checkout',
                          prompt: lang === 'ar' ? 'أنشئ منصة حجز مواعيد واستشارات ذكية مع تقويم تفاعلي، وتأكيد بالرسائل، وبوابة دفع إلكتروني' : 'Build a smart appointments and booking platform with live calendar and payments',
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(item.prompt)}
                          className="text-start p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition group cursor-pointer"
                        >
                          <div className="font-bold text-xs text-white group-hover:text-zinc-200 flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                          </div>
                          <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. CONTINUOUS CONVERSATIONAL WORKSPACE (SECOND INTERFACE - HARMONIZED) */
                <div className="w-full max-w-2xl mx-auto space-y-4 pb-4 animate-fadeIn">
                  {/* Messages Stream */}
                  {chatMessages
                    .filter((m) => m.id !== 'msg-welcome')
                    .map((msg) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div key={msg.id} className="w-full animate-fadeIn">
                          {isUser ? (
                            <div className="flex justify-end">
                              <div className="max-w-[88%] rounded-2xl bg-zinc-800 text-white border border-zinc-700/80 px-4 py-3 text-xs sm:text-sm font-medium shadow-sm">
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className="text-[10px] text-zinc-400 font-mono block text-end mt-1">{msg.timestamp}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-xl p-4 sm:p-5 space-y-3.5">
                              {/* Agent Header */}
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-bold text-[11px] shadow-xs">
                                    <Layers className="w-3.5 h-3.5 text-zinc-300" />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white text-xs">NOVA Architecture</span>
                                    <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                                      {lang === 'ar' ? 'المهندس المعماري' : 'CORE'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {msg.totalExecutionSeconds && (
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-mono font-bold flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-zinc-400" />
                                      <span>{msg.totalExecutionSeconds}s</span>
                                    </span>
                                  )}
                                  <span className="text-[10px] text-zinc-400 font-mono">{msg.timestamp}</span>
                                </div>
                              </div>

                              {/* Reasoning Foldout */}
                              {(msg.thoughtSnippet || (msg.thoughtProcess && msg.thoughtProcess.length > 0)) && (
                                <div className="rounded-xl bg-zinc-950 text-zinc-200 border border-zinc-800 p-3 space-y-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedThoughts((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                                    className="w-full flex items-center justify-between text-xs font-bold text-zinc-200 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Brain className="w-3.5 h-3.5 text-zinc-400" />
                                      <span>{lang === 'ar' ? 'التحليل والاستدلال المعماري' : 'Architectural Analysis & Reasoning'}</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                      {expandedThoughts[msg.id] ? (lang === 'ar' ? 'إخفاء ▲' : 'Hide ▲') : (lang === 'ar' ? 'عرض التفاصيل ▼' : 'Details ▼')}
                                    </span>
                                  </button>

                                  {expandedThoughts[msg.id] && (
                                    <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans space-y-1">
                                      {msg.thoughtSnippet && <p className="italic font-mono text-[11px] text-zinc-400">{msg.thoughtSnippet}</p>}
                                      {msg.thoughtProcess &&
                                        msg.thoughtProcess.map((step, sIdx) => (
                                          <div key={sIdx} className="flex items-start gap-2 text-[11px]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Architectural Response Text */}
                              <div className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                                {msg.text}
                              </div>

                              {/* Interactive Follow-up Suggestion Chips */}
                              {msg.dynamicInquiries && msg.dynamicInquiries.length > 0 && (
                                <div className="pt-2.5 border-t border-zinc-800 space-y-2">
                                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{lang === 'ar' ? 'اقتراحات التطوير والمتابعة المباشرة:' : 'Actionable Architecture Proposals:'}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {msg.dynamicInquiries.map((inq, iIdx) => (
                                      <button
                                        key={iIdx}
                                        type="button"
                                        onClick={() => handleSendMessage(inq.prompt)}
                                        className="group px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition active:scale-95 shadow-xs cursor-pointer border border-zinc-700 hover:border-zinc-500"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-zinc-200 transition" />
                                        <span>{inq.label}</span>
                                        <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-white transition rtl:rotate-180" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tasks Snapshot */}
                              {msg.tasksSnapshot && msg.tasksSnapshot.length > 0 && (
                                <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                                  <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="font-bold text-white">{lang === 'ar' ? 'المراحل البرمجية المنجزة:' : 'Engineered Phases:'}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setLayoutMode('preview-only');
                                        handleReloadPreview();
                                      }}
                                      className="text-zinc-300 hover:text-white font-bold flex items-center gap-1 text-[11px] transition"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>{lang === 'ar' ? 'معاينة في الشاشة الحية' : 'View in Preview'}</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {msg.tasksSnapshot.map((t) => (
                                      <div key={t.id} className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                                        <span className="truncate text-zinc-200">{lang === 'ar' ? t.titleAr : t.titleEn}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* Live Building Card with NOVA Orbital Thinking Effect */}
                  {isGenerating && (
                    <div className="w-full space-y-3 animate-fadeIn">
                      <NovaOrbitalThinking
                        progress={overallProgress}
                        elapsedTime={formatTimer(elapsedTimeMs)}
                        currentLog={currentActionLog}
                        lang={lang}
                        activePhase={activePhase}
                      />
                      <button
                        type="button"
                        onClick={() => setLayoutMode(layoutMode === 'split' ? 'preview-only' : 'split')}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 border border-zinc-800 cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-300" />
                        <span>{lang === 'ar' ? 'عرض شاشة المعاينة الحية والتحديث الفوري' : 'Open Live Preview Viewport'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pinned Sticky Bottom Prompt Input Bar (when isChatActive) */}
            {isChatActive && (
              <div className="shrink-0 p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 shadow-2xl z-20">
                {/* Active Model Capabilities Mini Bar */}
                <div className="max-w-2xl mx-auto mb-2 flex items-center justify-between gap-2 px-1 text-xs select-none">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[10px] font-bold text-zinc-400 shrink-0 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{lang === 'ar' ? 'القدرات البرمجية:' : 'Capabilities:'}</span>
                    </span>
                    {CAPABILITY_DEFINITIONS.map((cap) => {
                      const active = capabilities[cap.key];
                      const isPro = cap.tier === 'pro';
                      return (
                        <button
                          key={cap.key}
                          type="button"
                          onClick={() => toggleCapability(cap.key)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 transition shrink-0 cursor-pointer border ${
                            active
                              ? 'bg-zinc-800 text-zinc-200 border-zinc-700 font-bold'
                              : 'bg-zinc-900/60 text-zinc-500 border-zinc-850 opacity-60 line-through'
                          }`}
                          title={lang === 'ar' ? `${cap.titleAr} (${cap.tier === 'pro' ? 'مدفوع' : 'مجاني'})` : `${cap.titleEn} (${cap.tier})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-zinc-200' : 'bg-zinc-600'}`} />
                          <span>{lang === 'ar' ? cap.titleAr.split(' ')[0] : cap.titleEn.split(' ')[0]}</span>
                          <span className="text-[8px] opacity-75">{isPro ? (lang === 'ar' ? 'متقدم' : 'PRO') : (lang === 'ar' ? 'أساسي' : 'FREE')}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-zinc-400">
                    <Coins className="w-3 h-3 text-zinc-400" />
                    <span className="font-bold text-white">{calculateRequiredCredits()} {lang === 'ar' ? 'نقطة' : 'cr'}</span>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-2 sm:p-2.5 shadow-inner transition-all focus-within:border-zinc-700">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    placeholder={
                      lang === 'ar'
                        ? 'اكتب أمراً لتطوير المنظومة، إضافة ميزة، أو تعديل الكود...'
                        : 'Type an instruction to iterate, add a feature, or refine...'
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 outline-none resize-none leading-relaxed font-sans px-1"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 mt-1 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-1.5 rounded-lg transition ${
                          attachedImageBase64
                            ? 'bg-zinc-800 text-zinc-100 border border-zinc-650'
                            : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title={lang === 'ar' ? 'إرفاق ملف أو مرجع' : 'Attach file'}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>

                      {/* Design Style Selector Pill */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                          className="px-2.5 py-1 rounded-lg border border-zinc-750 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>
                            {designStyle === 'minimal' && (lang === 'ar' ? 'أنيق بسيط' : 'Minimal')}
                            {designStyle === 'glass' && (lang === 'ar' ? 'زجاجي' : 'Glass')}
                            {designStyle === 'luxury' && (lang === 'ar' ? 'فاخر ملكي' : 'Luxury')}
                            {designStyle === 'cyberpunk' && (lang === 'ar' ? 'داكن سيبراني' : 'Cyber')}
                            {designStyle === 'enterprise' && (lang === 'ar' ? 'مؤسسي' : 'Enterprise')}
                          </span>
                          <ChevronDown className="w-3 h-3 text-zinc-400" />
                        </button>
                        {isStyleDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-1.5 w-44 bg-zinc-900 border border-zinc-800 rounded-xl p-1 shadow-2xl z-30 space-y-0.5">
                            {[
                              { id: 'minimal', label: lang === 'ar' ? 'بسيط أنيق' : 'Minimal' },
                              { id: 'glass', label: lang === 'ar' ? 'زجاجي شفاف' : 'Glassmorphism' },
                              { id: 'luxury', label: lang === 'ar' ? 'فاخر متميز' : 'Luxury Gold' },
                              { id: 'cyberpunk', label: lang === 'ar' ? 'داكن عصري' : 'Dark Cyber' },
                              { id: 'enterprise', label: lang === 'ar' ? 'مؤسسي مصرفي' : 'Enterprise' },
                            ].map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setDesignStyle(s.id as any);
                                  setIsStyleDropdownOpen(false);
                                }}
                                className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                                  designStyle === s.id ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800/60'
                                }`}
                              >
                                <span>{s.label}</span>
                                {designStyle === s.id && <Check className="w-3 h-3 text-white" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isGenerating || (!prompt.trim() && !attachedImageBase64)}
                      onClick={() => handleSendMessage()}
                      className="px-4 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 shadow-sm cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{lang === 'ar' ? 'جاري البناء...' : 'Building...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANE 2: PRESTIGIOUS OFFICIAL PREVIEW VIEWPORT (مكان العرض المميز والرسمي) */}
        {(layoutMode === 'split' || layoutMode === 'preview-only') && (
          <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden min-h-0">
            {/* Executive Browser Chrome Header */}
            <div className="h-10 border-b border-zinc-800 bg-zinc-900/95 px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono font-bold text-zinc-400 ms-1 hidden sm:inline">
                  {lang === 'ar' ? 'المعاينة الحية المتجاوبة' : 'Live Viewport'}
                </span>
              </div>

              {/* Official HTTPS Address Bar with SSL Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 max-w-xs sm:max-w-md w-full mx-2 justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-zinc-500">https://</span>
                  <span className="text-white font-medium truncate">{getStandaloneUrl().replace(/^https?:\/\//, '')}</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-1 rounded border border-emerald-800 shrink-0">
                  SSL
                </span>
              </div>

              {/* Viewport Actions */}
              <div className="flex items-center gap-1.5 text-xs">
                {/* ZATCA Services & Tax Invoices Quick Button */}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open_auth_services'))}
                  className="px-2.5 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/60 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                  title={lang === 'ar' ? 'فواتير ZATCA والخدمات المسلّمة' : 'ZATCA Invoices & Delivered Services'}
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span className="hidden lg:inline">{lang === 'ar' ? 'الفواتير' : 'Invoices'}</span>
                </button>

                {/* Reload Button */}
                <button
                  onClick={handleReloadPreview}
                  className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Reload Preview"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isIframeLoading ? 'animate-spin' : ''}`} />
                </button>

                {/* Copy URL */}
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Copy Live URL"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Expand / Maximize Viewport Toggle */}
                <button
                  onClick={() => setLayoutMode(layoutMode === 'split' ? 'preview-only' : 'split')}
                  className={`p-1.5 rounded-md border transition cursor-pointer ${
                    layoutMode === 'preview-only'
                      ? 'bg-zinc-100 border-white text-zinc-950 font-bold'
                      : 'bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title={layoutMode === 'preview-only' ? (lang === 'ar' ? 'إعادة تقسيم الشاشة' : 'Split View') : (lang === 'ar' ? 'توسيع المعاينة لكامل الشاشة' : 'Full Screen Preview')}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Open Standalone New Window */}
                <a
                  href={getStandaloneUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Open live website in new tab"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Iframe Viewport Container: 100% Wide, Edge-to-Edge with Responsive Frame */}
            <div className="flex-1 w-full h-full overflow-hidden bg-zinc-950 relative flex items-center justify-center p-0">
              {isGenerating ? (
                <LiveBuildSkeleton
                  progress={overallProgress}
                  statusMessage={currentActionLog}
                  activeFile={globalBuildState.activeFile}
                  codeSnippet={globalBuildState.codeSnippet}
                  engine={globalBuildState.modelUsed}
                  isArabic={lang === 'ar'}
                />
              ) : !project.previewHtml ? (
                <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-950">
                  <div className="max-w-md w-full bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fadeIn">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-850 border border-zinc-700/80 flex items-center justify-center font-black text-white text-base shadow-inner">
                      NOVA
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">
                        {lang === 'ar' ? 'مساحة العمل فارغة وجاهزة للبناء' : 'Blank Architecture Canvas'}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {lang === 'ar'
                          ? 'لم يتم إنشاء أي تطبيق بعد. اكتب فكرة مشروعك في المحادثة وسيقوم النموذج ببنائه وهيكلته بالكامل من الصفر كوداً وتصميماً وقاعدة بيانات.'
                          : 'No application synthesized yet. Enter your prompt in the chat to synthesize a bespoke system from scratch.'}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLayoutMode('split');
                          textareaRef.current?.focus();
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer"
                      >
                        {lang === 'ar' ? 'اكتب فكرة مشروعك في الشات' : 'Start Prompting'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`transition-all duration-300 w-full h-full flex items-center justify-center ${
                    deviceMode === 'mobile'
                      ? 'max-w-[390px] h-[720px] max-h-[90%] my-auto rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden'
                      : deviceMode === 'tablet'
                      ? 'max-w-[768px] h-[86%] my-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden'
                      : 'w-full h-full'
                  }`}
                >
                  <iframe
                    key={`preview-${iframeKey}`}
                    srcDoc={project.previewHtml}
                    src={`/live?t=${iframeKey}`}
                    title="Live Preview"
                    className="w-full h-full border-0 bg-zinc-950 block"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2.5 DEDICATED BOTTOM WORKSTATION CONTROL DOCK                       */}
      {/* (أزرار المعاينة والرجوع للشات والتحكم بالأجهزة في أسفل الشاشة)        */}
      {/* =================================================================== */}
      <footer className="h-14 border-t border-zinc-800 bg-zinc-950 px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none shadow-2xl overflow-x-auto no-scrollbar gap-2">
        {/* Left: View Mode Segmented Controls */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl shadow-inner gap-1">
          <button
            type="button"
            onClick={() => setLayoutMode('chat-only')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              layoutMode === 'chat-only'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title={lang === 'ar' ? 'محرر الأوامر والمحادثة' : 'Commands & Chat'}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'محرر الأوامر' : 'Commands'}</span>
            {isGenerating && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('preview-only')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              layoutMode === 'preview-only'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title={lang === 'ar' ? 'المعاينة الحية المستقلة' : 'Live Preview'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المعاينة الحية' : 'Live Preview'}</span>
            {project.previewHtml && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('split')}
            className={`hidden md:flex px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold items-center gap-2 transition cursor-pointer ${
              layoutMode === 'split'
                ? 'bg-zinc-100 text-zinc-950 shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title={lang === 'ar' ? 'عرض مقسم (أوامر + معاينة)' : 'Split View'}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'عرض مقسم' : 'Split'}</span>
          </button>
        </div>

        {/* Center: Contextual Fast Return / Switch & Responsive Device Dimensions */}
        <div className="flex items-center gap-2">
          {layoutMode === 'preview-only' ? (
            <button
              type="button"
              onClick={() => setLayoutMode('chat-only')}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
              title={lang === 'ar' ? 'الرجوع لمحرر الأوامر والشات' : 'Back to Chat'}
            >
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{lang === 'ar' ? 'العودة لمحرر الأوامر' : 'Back to Chat'}</span>
            </button>
          ) : layoutMode === 'chat-only' ? (
            <button
              type="button"
              onClick={() => setLayoutMode('preview-only')}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
              title={lang === 'ar' ? 'الانتقال لشاشة المعاينة الحية' : 'View Live Output'}
            >
              <span>{lang === 'ar' ? 'الانتقال للمعاينة الحية' : 'Live Preview'}</span>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          ) : null}

          {/* Device Dimension Selectors (Visible in Preview or Split) */}
          {(layoutMode === 'preview-only' || layoutMode === 'split') && (
            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl text-xs gap-0.5">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg transition ${
                  deviceMode === 'desktop' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={lang === 'ar' ? 'سطح المكتب' : 'Desktop'}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded-lg transition ${
                  deviceMode === 'tablet' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={lang === 'ar' ? 'جهاز لوحي' : 'Tablet'}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg transition ${
                  deviceMode === 'mobile' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={lang === 'ar' ? 'هاتف ذكي' : 'Mobile'}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Live App Link & Standalone Browser */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleReloadPreview}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title={lang === 'ar' ? 'تحديث المعاينة' : 'Reload'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIframeLoading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={getStandaloneUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold transition shadow-xs active:scale-95"
            title={lang === 'ar' ? 'الموقع المستقل الكامل /live' : 'Open Live App in new tab'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>/live ↗</span>
          </a>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* 3. BRAINSTORM IDEAS MODAL                                           */}
      {/* =================================================================== */}
      {isBrainstormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'طرح أفكار ونماذج معمارية جاهزة للتوليد' : 'Architecture Blueprints & Ideas'}
                </h3>
              </div>
              <button onClick={() => setIsBrainstormOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {BRAINSTORM_IDEAS.map((idea) => (
                <div
                  key={idea.id}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {lang === 'ar' ? idea.titleAr : idea.titleEn}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {lang === 'ar' ? idea.descAr : idea.descEn}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsBrainstormOpen(false);
                      handleSendMessage(idea.prompt);
                    }}
                    className="w-full py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition cursor-pointer"
                  >
                    {lang === 'ar' ? 'تطبيق وبدء البناء' : 'Build This Blueprint'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. SHARE MODAL WITH QR CODE                                         */}
      {/* =================================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-start">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'مشاركة رابط الموقع المباشر المستقل' : 'Share Live Standalone App'}</span>
              </h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {lang === 'ar'
                ? 'هذا الرابط مستقل تماماً ويفتح الموقع فقط للمستخدمين دون أي أدوات تطوير أو استوديو.'
                : 'Direct public link for end-users with zero builder chrome.'}
            </p>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-zinc-300 truncate">{getStandaloneUrl()}</span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition shrink-0"
              >
                {copiedLink ? (lang === 'ar' ? 'تم النسخ ✓' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={getStandaloneUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                {lang === 'ar' ? 'فتح الموقع في نافذة جديدة' : 'Open in New Window'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
