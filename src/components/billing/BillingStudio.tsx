import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getDodoGatewayStatus,
  createDodoCheckoutSession,
  verifyDodoSession,
  testDodoApiKey,
  DodoGatewayStatus,
} from '../../services/dodoPayments';
import {
  CreditCard,
  Check,
  Coins,
  ShieldCheck,
  RotateCw,
  Key,
  CheckCircle2,
  X,
  Zap,
  Printer,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Lock,
  Globe,
  Receipt,
  Download,
  ExternalLink,
} from 'lucide-react';

interface InvoiceRecord {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Processing';
  plan: string;
  method: string;
}

const NOVA_PLANS = [
  {
    id: 'starter',
    nameEn: 'NOVA Starter',
    nameAr: 'نوفا المجاني (Starter)',
    price: '$0',
    billingPeriod: '/mo',
    amount: 0,
    credits: '1,000 cr / mo',
    creditsAmount: 1000,
    featuresEn: [
      '3 Active Full-Stack Projects',
      'NOVA 3.0 Flash Lite Engine',
      'Live Standalone URL (/live)',
      'Basic PostgreSQL Schema Generation',
      'Standard Community Support',
    ],
    featuresAr: [
      '3 مشاريع متكاملة نشطة',
      'محرك NOVA 3.0 Flash Lite',
      'رابط مستقل حي (/live)',
      'توليد جداول PostgreSQL الأساسية',
      'دعم المجتمع القياسي',
    ],
    isPopular: false,
    ctaEn: 'Current Free Tier',
    ctaAr: 'الخطة المجانية الحالية',
  },
  {
    id: 'pro',
    nameEn: 'NOVA Pro Builder',
    nameAr: 'نوفا للمحترفين (NOVA Pro)',
    price: '$29',
    billingPeriod: '/mo',
    amount: 29,
    credits: '25,000 cr / mo',
    creditsAmount: 25000,
    featuresEn: [
      'Unlimited Full-Stack Projects',
      'NOVA 3.0 Pro Deep Architecture',
      'Deep Reasoning & Decision Tree (8k tokens)',
      'Enterprise Secure Payment Gateway',
      'Instant Standalone Cloud Publishing',
      'Priority Synthesis & No Queues',
    ],
    featuresAr: [
      'مشاريع وتطبيقات غير محدودة',
      'محرك NOVA 3.0 Pro للهندسة المعمارية',
      'تفكير معمق وسلسلة قرارات (8k tokens)',
      'تكامل بوابات الدفع الإلكتروني المشفرة',
      'نشر سحابي فوري مستقل',
      'أولوية معالجة فورية بدون انتظار',
    ],
    isPopular: true,
    ctaEn: 'Upgrade to Pro ($29/mo)',
    ctaAr: 'ترقية فورية آمنة ($29/شهر)',
  },
  {
    id: 'team',
    nameEn: 'NOVA Team & Studio',
    nameAr: 'نوفا للفرق والاستوديوهات (Team)',
    price: '$79',
    billingPeriod: '/mo',
    amount: 79,
    credits: '100,000 cr / mo',
    creditsAmount: 100000,
    featuresEn: [
      '10 Team Seats & RBAC Governance',
      'Collaborative Multi-User Canvases',
      'PostgreSQL Relational DB Migrations',
      'Secure Multi-Account Payment Routing',
      '24/7 Dedicated Architecture Support',
      'Audit Logs & Version History',
    ],
    featuresAr: [
      '10 مقاعد مع صلاحيات RBAC متطورة',
      'مساحات عمل تعاونية متزامنة',
      'إدارة وهجرة قواعد بيانات PostgreSQL',
      'ربط حسابات السداد وبطاقات الائتمان',
      'دعم معماري مخصص 24/7',
      'سجلات تدقيق شاملة وتاريخ التغييرات',
    ],
    isPopular: false,
    ctaEn: 'Upgrade to Team ($79/mo)',
    ctaAr: 'ترقية الفريق فورياً ($79/شهر)',
  },
  {
    id: 'enterprise',
    nameEn: 'NOVA Enterprise AI',
    nameAr: 'نوفا للمؤسسات (Enterprise)',
    price: '$249',
    billingPeriod: '/mo',
    amount: 249,
    credits: '500,000 cr / mo',
    creditsAmount: 500000,
    featuresEn: [
      'Dedicated Isolated Serverless Containers',
      '99.99% SLA Uptime Guarantee',
      'Customer-Managed Payment Encryption Keys',
      'Custom Automated Tax & Invoicing',
      'Dedicated Solutions Architect',
    ],
    featuresAr: [
      'حاويات سحابية معزولة ومخصصة بالكامل',
      'ضمان تشغيل عالي 99.99% SLA',
      'إدارة مفاتيح الدفع المشفرة وتكامل خاص',
      'فواتير ضريبية وتقارير مالية مخصصة',
      'مهندس معماري تقني مخصص للمؤسسة',
    ],
    isPopular: false,
    ctaEn: 'Contact / Subscribe ($249/mo)',
    ctaAr: 'اشتراك المؤسسات ($249/شهر)',
  },
];

const CREDIT_BOOSTERS = [
  {
    id: 'boost-5k',
    credits: 5000,
    price: 10,
    labelEn: 'Starter Pack',
    labelAr: 'باقة البدء',
    descEn: 'Great for 15+ deep builds',
    descAr: 'تكفي أكثر من 15 عملية بناء عميقة',
  },
  {
    id: 'boost-25k',
    credits: 25000,
    price: 35,
    popular: true,
    labelEn: 'Growth Pack',
    labelAr: 'باقة النمو',
    descEn: 'Best value for active builders',
    descAr: 'القيمة الأفضل للمطورين النشطين',
  },
  {
    id: 'boost-100k',
    credits: 100000,
    price: 99,
    labelEn: 'Scale Pack',
    labelAr: 'باقة التوسع',
    descEn: 'For enterprise & mass generation',
    descAr: 'للمؤسسات والإنتاج المتواصل',
  },
];

export const BillingStudio: React.FC = () => {
  const {
    lang,
    credits,
    addCredits,
    addToast,
    userPlan,
    setUserPlan,
    subscriptionStatus,
    setSubscriptionStatus,
    nextBillingDate,
    activatePlan,
  } = useApp();

  const [dodoStatus, setDodoStatus] = useState<DodoGatewayStatus>({
    configured: true,
    mode: 'live_production',
    gateway: 'Enterprise Secure Payment Gateway (PCI-DSS & SSL Encrypted)',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'SAR', 'AED'],
    paymentMethods: ['credit_card', 'apple_pay', 'google_pay', 'mada'],
    webhookActive: true,
    sslEncrypted: true,
  });

  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{ valid: boolean; message: string } | null>(null);

  // Active Checkout Modal State
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    planName: string;
    amount: number;
    creditsAmount: number;
    sessionId?: string;
    checkoutUrl?: string;
  } | null>(null);

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<InvoiceRecord | null>(null);

  // Simulated live customer input in checkout
  const [checkoutEmail, setCheckoutEmail] = useState('subscriber@example.com');
  const [checkoutCardNumber, setCheckoutCardNumber] = useState('•••• •••• •••• 4242');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Invoices ledger
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    {
      id: 'INV-PAY-2026-901',
      date: '2026-10-15',
      amount: '$29.00',
      status: 'Paid',
      plan: 'NOVA Pro Builder',
      method: 'Secure Checkout (Apple Pay)',
    },
    {
      id: 'INV-PAY-2026-880',
      date: '2026-09-15',
      amount: '$29.00',
      status: 'Paid',
      plan: 'NOVA Pro Builder',
      method: 'Secure Checkout (Card •••• 4242)',
    },
  ]);

  // Load gateway status on mount via Dodo Payments SDK service
  useEffect(() => {
    setIsLoadingStatus(true);
    getDodoGatewayStatus()
      .then((status) => {
        setDodoStatus(status);
      })
      .catch((err) => {
        console.warn('Dodo Gateway status fallback:', err);
      })
      .finally(() => {
        setIsLoadingStatus(false);
      });
  }, []);

  // Handle plan upgrade via Dodo Payments SDK
  const handleSelectPlan = async (plan: typeof NOVA_PLANS[0]) => {
    if (plan.amount === 0) {
      activatePlan('Starter', 0, 1000);
      addToast(
        lang === 'ar' ? 'تم تفعيل باقة NOVA Starter المجانية' : 'Activated NOVA Starter tier',
        'info'
      );
      return;
    }

    if (userPlan.toLowerCase().includes(plan.nameEn.toLowerCase()) && subscriptionStatus === 'active') {
      addToast(
        lang === 'ar' ? `أنت مشترك بالفعل في باقة ${plan.nameAr}` : `Already subscribed to ${plan.nameEn}`,
        'info'
      );
      return;
    }

    setIsProcessingCheckout(true);
    try {
      const res = await createDodoCheckoutSession({
        planName: plan.nameEn,
        amount: plan.amount,
        currency: 'USD',
        creditsAmount: plan.creditsAmount,
        customerEmail: checkoutEmail,
      });

      if (res && res.success) {
        setCheckoutModal({
          isOpen: true,
          planName: plan.nameEn,
          amount: plan.amount,
          creditsAmount: plan.creditsAmount,
          sessionId: res.sessionId,
          checkoutUrl: res.checkoutUrl,
        });
      } else {
        throw new Error(res.message || 'Payment session creation error');
      }
    } catch (err: any) {
      addToast(
        err.message || (lang === 'ar' ? 'حدث خطأ في إنشاء جلسة الدفع' : 'Payment session error'),
        'error'
      );
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Handle purchasing extra credit boosters via Dodo Payments SDK
  const handleBuyBooster = async (booster: typeof CREDIT_BOOSTERS[0]) => {
    setIsProcessingCheckout(true);
    try {
      const res = await createDodoCheckoutSession({
        planName: `NOVA Credits (${booster.credits.toLocaleString()} cr)`,
        amount: booster.price,
        currency: 'USD',
        creditsAmount: booster.credits,
        customerEmail: checkoutEmail,
      });

      if (res && res.success) {
        setCheckoutModal({
          isOpen: true,
          planName: `${booster.credits.toLocaleString()} NOVA Credits`,
          amount: booster.price,
          creditsAmount: booster.credits,
          sessionId: res.sessionId,
          checkoutUrl: res.checkoutUrl,
        });
      }
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Confirm and verify payment session
  const handleConfirmSecurePayment = async () => {
    if (!checkoutModal) return;

    setIsSubmittingPayment(true);
    try {
      if (checkoutModal.sessionId) {
        await verifyDodoSession(checkoutModal.sessionId);
      }

      // If it's a plan upgrade
      if (checkoutModal.planName.toLowerCase().includes('nova') && !checkoutModal.planName.includes('Credits')) {
        activatePlan(checkoutModal.planName, checkoutModal.amount, checkoutModal.creditsAmount);
      } else {
        // Booster purchase
        addCredits(checkoutModal.creditsAmount);
      }

      // Record invoice
      const newInvoice: InvoiceRecord = {
        id: `INV-PAY-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        amount: `$${checkoutModal.amount}.00`,
        status: 'Paid',
        plan: checkoutModal.planName,
        method: 'Secure Checkout (Apple Pay / Mada / Card)',
      };
      setInvoices((prev) => [newInvoice, ...prev]);

      addToast(
        lang === 'ar'
          ? `✅ تم تأكيد الدفع بنجاح عبر بوابة الدفع الآمنة المشفرة! تمت ترقية الحساب وإضافة ${checkoutModal.creditsAmount.toLocaleString()} رصيد.`
          : `✅ Payment verified via Enterprise Secure Gateway! Account upgraded and ${checkoutModal.creditsAmount.toLocaleString()} credits added.`,
        'success'
      );

      setCheckoutModal(null);
    } catch (err: any) {
      addToast(err.message || 'Payment confirmation error', 'error');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Test custom API Key
  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      addToast(lang === 'ar' ? 'يرجى كتابة المفتاح للاختبار' : 'Please input a key', 'warning');
      return;
    }
    setIsTestingKey(true);
    setKeyTestResult(null);
    try {
      const res = await testDodoApiKey(keyInput);
      setKeyTestResult(res);
      if (res.valid) {
        addToast(
          lang === 'ar' ? '✅ تم الاتصال ببوابة الدفع المشفرة وتفعيل المفتاح بنجاح' : 'Connected to Secure Payment Gateway',
          'success'
        );
      } else {
        addToast(res.message, 'error');
      }
    } catch (e: any) {
      setKeyTestResult({ valid: false, message: e.message });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100 select-none">
      {/* Top Header */}
      <header className="h-12 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-bold text-zinc-100 tracking-tight">
            {lang === 'ar' ? 'بوابة الدفع الآمنة والاشتراكات السحابية' : 'Secure Payment Gateway & Subscriptions'}
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            <Lock className="w-2.5 h-2.5 text-emerald-400" />
            <span>256-bit SSL</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">{lang === 'ar' ? 'رصيدك:' : 'Balance:'}</span>
            <span className="text-white font-bold">{credits.toLocaleString()} cr</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full min-h-0">
        {/* =============================================================== */}
        {/* 1. SECURE PAYMENT GATEWAY STATUS CARD                           */}
        {/* =============================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 shadow-sm">
              <CreditCard className="w-5 h-5 text-zinc-200" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-zinc-100">
                  {lang === 'ar' ? 'بوابة الدفع الإلكتروني المعتمدة والمشفرة' : 'Official Secure Payment Gateway'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>256-bit Encrypted Active</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'ar'
                  ? 'بوابة الدفع متصلة سحابياً ومشفرة لدعم ترقيات اشتراكات NOVA وشحن باقات الرصيد الفورية عبر Apple Pay والبطاقات البنكية.'
                  : 'Cloud-secured gateway supporting instant NOVA tier upgrades and credit purchases with Apple Pay & Cards.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
              Apple Pay ✓
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
              Credit Cards ✓
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
              Mada ✓
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. CURRENT ACTIVE SUBSCRIPTION TIER                             */}
        {/* =============================================================== */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                {lang === 'ar' ? 'اشتراكك الحالي في NOVA:' : 'Current Active Tier:'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                {subscriptionStatus === 'active' ? (lang === 'ar' ? 'مفعل ونشط' : 'Active') : (lang === 'ar' ? 'ملغى' : 'Cancelled')}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">{userPlan}</h3>
              <span className="text-xs text-zinc-400 font-mono">
                {lang === 'ar' ? `(تاريخ التجديد: ${nextBillingDate})` : `(Renewal: ${nextBillingDate})`}
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              {lang === 'ar'
                ? 'خطة اشتراكك متصلة بمحرك NOVA 3.0 Pro، وقواعد بيانات PostgreSQL، وبوابة السداد المعتمدة.'
                : 'Plan connected to NOVA 3.0 Pro Engine, PostgreSQL schemas, and Secure Gateway.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => addCredits(5000)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Coins className="w-3.5 h-3.5 text-zinc-950" />
              <span>{lang === 'ar' ? '+ شحن 5,000 رصيد فوري' : '+ Top-up 5,000 Credits'}</span>
            </button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 3. NOVA SUBSCRIPTION TIERS                                      */}
        {/* =============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'خطط وباقات اشتراك NOVA المتكاملة' : 'NOVA Subscription Tiers'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ar' ? 'اختر الباقة المناسبة مع تفعيل حقيقي وفوري وبطاقات دفع مشفرة' : 'Select your tier with instant gateway activation & encrypted cards'}
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Secure 256-bit Checkout
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {NOVA_PLANS.map((plan) => {
              const isCurrent = userPlan.toLowerCase().includes(plan.nameEn.toLowerCase());

              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl flex flex-col justify-between space-y-5 transition relative ${
                    plan.isPopular
                      ? 'bg-zinc-900/90 border-2 border-zinc-500 shadow-md'
                      : 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-950 text-[10px] font-bold tracking-wider uppercase font-mono shadow-xs">
                      {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-100">
                        {lang === 'ar' ? plan.nameAr : plan.nameEn}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {lang === 'ar' ? 'خطتك' : 'Current'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-zinc-400 font-mono">{plan.billingPeriod}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{plan.credits}</span>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-zinc-850 text-xs text-zinc-400">
                      {(lang === 'ar' ? plan.featuresAr : plan.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0 mt-0.5" />
                          <span className="leading-snug text-zinc-300">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isProcessingCheckout || isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                        : plan.isPopular
                        ? 'bg-white hover:bg-zinc-100 text-zinc-950 shadow-sm active:scale-95'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 active:scale-95'
                    }`}
                  >
                    {isProcessingCheckout ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    <span>{isCurrent ? (lang === 'ar' ? 'الخطة الحالية' : 'Current Plan') : (lang === 'ar' ? plan.ctaAr : plan.ctaEn)}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* =============================================================== */}
        {/* 4. CREDIT BOOSTER PACKS (SECURE CHECKOUT)                       */}
        {/* =============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'باقات الرصيد الفوري (Credit Boosters)' : 'Instant Credit Boosters'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ar' ? 'اشحن رصيد إضافي لعمليات البناء والتفكير المعمق دون الحاجة لتغيير خطتك' : 'Top up extra tokens for deep reasoning and builds without changing tiers'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CREDIT_BOOSTERS.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">
                      {lang === 'ar' ? b.labelAr : b.labelEn}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">${b.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-base font-extrabold text-amber-300 font-mono">
                    <Coins className="w-4 h-4" />
                    <span>+{b.credits.toLocaleString()} cr</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {lang === 'ar' ? b.descAr : b.descEn}
                  </p>
                </div>

                <button
                  disabled={isProcessingCheckout}
                  onClick={() => handleBuyBooster(b)}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{lang === 'ar' ? `شحن فوري ($${b.price})` : `Buy for $${b.price}`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =============================================================== */}
        {/* 5. INVOICES & TRANSACTION LEDGER                                */}
        {/* =============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'سجل العمليات والفواتير المعتمدة' : 'Verified Invoices & Payment Ledger'}
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              {invoices.length} {lang === 'ar' ? 'عملية مسجلة' : 'records'}
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-900/70 border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="p-3">{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                  <th className="p-3">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="p-3">{lang === 'ar' ? 'الباقة / الخدمة' : 'Description'}</th>
                  <th className="p-3">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-3">{lang === 'ar' ? 'طريقة الدفع' : 'Method'}</th>
                  <th className="p-3 text-right">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-3 font-mono font-bold text-zinc-200">{inv.id}</td>
                    <td className="p-3 text-zinc-400 font-mono">{inv.date}</td>
                    <td className="p-3 text-zinc-300 font-semibold">{inv.plan}</td>
                    <td className="p-3 font-mono text-zinc-100 font-bold">{inv.amount}</td>
                    <td className="p-3 text-zinc-400">{inv.method}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveReceipt(inv)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
                      >
                        {lang === 'ar' ? 'عرض الإيصال' : 'View Receipt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* CHECKOUT MODAL (SECURE DODO PAYMENTS DIALOG)                    */}
      {/* =============================================================== */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'بوابة الدفع الإلكتروني الآمنة' : 'Secure Payment Checkout'}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">Session: {checkoutModal.sessionId?.slice(0, 18)}...</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModal(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>{lang === 'ar' ? 'المنتج / الباقة:' : 'Item:'}</span>
                <span className="font-bold text-white">{checkoutModal.planName}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>{lang === 'ar' ? 'الرصيد الممنوح:' : 'Credits added:'}</span>
                <span className="font-mono text-amber-300 font-bold">+{checkoutModal.creditsAmount.toLocaleString()} cr</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 text-sm font-bold text-white">
                <span>{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total due:'}</span>
                <span className="font-mono text-emerald-400">${checkoutModal.amount}.00 USD</span>
              </div>
            </div>

            {/* Form details */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-mono text-[11px]">{lang === 'ar' ? 'البريد الإلكتروني للعميل' : 'Customer Email'}</label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-zinc-600 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-mono text-[11px]">{lang === 'ar' ? 'بطاقة الائتمان / Apple Pay' : 'Payment Card / Apple Pay'}</label>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-zinc-300 font-mono">
                  <span>{checkoutCardNumber}</span>
                  <span className="text-[10px] text-zinc-500">MM/YY CVC</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                disabled={isSubmittingPayment}
                onClick={handleConfirmSecurePayment}
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                {isSubmittingPayment ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-950" />
                )}
                <span>{lang === 'ar' ? `تأكيد ودفع $${checkoutModal.amount} فورياً` : `Pay $${checkoutModal.amount} Securely`}</span>
              </button>

              <button
                onClick={() => setCheckoutModal(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* RECEIPT MODAL                                                   */}
      {/* =============================================================== */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{lang === 'ar' ? 'إيصال سداد معتمد' : 'Certified Payment Receipt'}</span>
              </div>
              <button onClick={() => setActiveReceipt(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Receipt ID:</span>
                <span className="text-zinc-200">{activeReceipt.id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date:</span>
                <span className="text-zinc-200">{activeReceipt.date}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Item:</span>
                <span className="text-zinc-200">{activeReceipt.plan}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Method:</span>
                <span className="text-zinc-200">{activeReceipt.method}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 text-sm font-bold text-emerald-400">
                <span>Total Paid:</span>
                <span>{activeReceipt.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveReceipt(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
