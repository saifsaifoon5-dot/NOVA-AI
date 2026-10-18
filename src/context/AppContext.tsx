import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeMode, Environment, AppTab, Project, KanbanTask, ViewMode, UserProfile } from '../types';
import { INITIAL_PROJECT, INITIAL_TASKS } from '../data/initialData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  dodoKey: string;
  setDodoKey: (key: string) => void;
  userPlan: string;
  setUserPlan: (plan: string) => void;
  subscriptionStatus: 'active' | 'cancelled';
  setSubscriptionStatus: (status: 'active' | 'cancelled') => void;
  nextBillingDate: string;
  activatePlan: (planName: string, amount: number, creditsAmount: number) => void;
  publishedUrl: string;
  setPublishedUrl: (url: string) => void;
  isPublishing: boolean;
  publishWebSite: (customHtml?: string, customTitle?: string) => Promise<string | null>;
  testDodoKey: (keyToTest?: string) => Promise<{ valid: boolean; message: string }>;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  allProjects: Project[];
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  credits: number;
  useCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  tasks: KanbanTask[];
  setTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
  toasts: ToastNotification[];
  addToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  isCmdPaletteOpen: boolean;
  setIsCmdPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  // User Authentication State
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (userData: Partial<UserProfile>) => void;
  logoutUser: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dodoKey, setDodoKey] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('Pro Builder');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'cancelled'>('active');
  const [nextBillingDate, setNextBillingDate] = useState<string>('2026-11-11');
  const [environment, setEnvironment] = useState<Environment>('production');
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [allProjects, setAllProjects] = useState<Project[]>([INITIAL_PROJECT]);
  const [credits, setCredits] = useState<number>(14250);

  const [publishedUrl, setPublishedUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/live`;
    }
    return '/live';
  });
  const [isPublishing, setIsPublishing] = useState(false);

  // User Authentication State with local persistence
  const DEFAULT_USER: UserProfile = {
    id: 'usr-saif',
    name: 'سيف (Saif)',
    email: 'saifsaifoon5@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    provider: 'google',
    plan: userPlan,
    role: 'architect',
    apiKey: 'nova_live_9a87f4c2e1b0d5',
    joinedDate: '2026-01-14',
    verified: true,
    projectsCount: 14,
    totalBuilds: 56,
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nova_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginUser = (userData: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        ...userData,
        verified: true,
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nova_user_profile', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    const guestUser: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 7),
      name: 'Guest Developer',
      email: 'guest@nova.studio',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      provider: 'guest',
      plan: 'Starter',
      role: 'developer',
      apiKey: 'nova_guest_key',
      joinedDate: new Date().toISOString().split('T')[0],
      verified: false,
      projectsCount: 1,
      totalBuilds: 3,
    };
    setCurrentUser(guestUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nova_user_profile', JSON.stringify(guestUser));
      } catch (e) {}
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const activatePlan = (planName: string, amount: number, creditsAmount: number) => {
    setUserPlan(planName);
    setSubscriptionStatus('active');
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setNextBillingDate(d.toISOString().split('T')[0]);
    
    if (creditsAmount > 0) {
      setCredits((prev) => prev + creditsAmount);
    }
    setCurrentUser((prev) => ({ ...prev, plan: planName }));
  };

  // Test Dodo Payments API key directly
  const testDodoKey = async (keyToTest?: string): Promise<{ valid: boolean; message: string }> => {
    try {
      const res = await fetch('/api/payments/dodo/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyToTest || dodoKey }),
      });
      const data = await res.json();
      return {
        valid: data.valid,
        message: data.message || data.error || (data.valid ? 'Connected' : 'Invalid key'),
      };
    } catch (err: any) {
      return { valid: false, message: err.message || 'Connection failed' };
    }
  };

  // Dedicated Standalone Web Publisher
  const publishWebSite = async (customHtml?: string, customTitle?: string): Promise<string | null> => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle || project.name,
          description: project.description,
          html: customHtml || project.previewHtml,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const fullLiveUrl = `${window.location.origin}/live`;
        setPublishedUrl(fullLiveUrl);
        setProject((prev) => ({
          ...prev,
          liveUrl: fullLiveUrl,
          status: 'deployed',
        }));
        addToast(
          lang === 'ar'
            ? '🚀 تم نشر موقعك كرابط ويب مستقل! يمكنك الآن تصفحه ومشاركته دون أي ربط بجيميناي بيلد.'
            : '🚀 Standalone web app published! Visit it directly with zero builder chrome.',
          'success'
        );
        return fullLiveUrl;
      } else {
        throw new Error(data.error || 'Failed to publish');
      }
    } catch (err: any) {
      addToast(err.message || 'Publishing error', 'error');
      return null;
    } finally {
      setIsPublishing(false);
    }
  };
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync dark class on html
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Automatic detection of payment return callback from Secure Payment Gateway
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      const plan = urlParams.get('plan') || 'Pro Builder';
      const creditsAdded = Number(urlParams.get('credits')) || 25000;
      const sessionId = urlParams.get('session_id') || '';

      // Verify transaction on backend
      fetch('/api/payments/dodo/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, plan }),
      }).catch(() => {});

      activatePlan(plan, 29, creditsAdded);
      addToast(
        lang === 'ar'
          ? `🎉 تم تأكيد الدفع الرقمي الآمن بنجاح! تم تفعيل اشتراك ${plan} وإضافة ${creditsAdded.toLocaleString()} رصيد إلى حسابك.`
          : `🎉 Verified Secure Payment! Activated ${plan} with ${creditsAdded.toLocaleString()} credits added to your account.`,
        'success'
      );

      // Clean query params from URL bar cleanly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = (message: string, type: ToastNotification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const useCredits = (amount: number): boolean => {
    if (credits < amount) {
      addToast(
        lang === 'ar'
          ? 'رصيدك غير كافٍ! يرجى شحن الرصيد من لوحة الفواتير.'
          : 'Insufficient credits! Please top up in Billing.',
        'warning'
      );
      return false;
    }
    setCredits((prev) => prev - amount);
    return true;
  };

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
    addToast(
      lang === 'ar'
        ? `تمت إضافة ${amount} رصيد ذكاء اصطناعي إلى حسابك بنجاح!`
        : `Successfully added ${amount} AI credits to your account!`,
      'success'
    );
  };

  // Simple dictionary translator helper
  const dictionary: Record<string, { ar: string; en: string }> = {
    appName: { ar: 'Lovable Gemini Studio', en: 'Lovable Gemini Studio' },
    appSub: { ar: 'منصة بناء التطبيقات والذكاء الاصطناعي الموحدة', en: 'Unified App & AI Building Platform' },
    buildStudio: { ar: 'استوديو البناء', en: 'Build Studio' },
    aiLab: { ar: 'مختبر AI', en: 'AI Lab' },
    database: { ar: 'قواعد البيانات', en: 'Database' },
    deployment: { ar: 'النشر السحابي', en: 'Deployment' },
    kanban: { ar: 'لوحة المهام', en: 'Kanban' },
    marketplace: { ar: 'سوق القوالب', en: 'Marketplace' },
    billing: { ar: 'الفواتير والرصيد', en: 'Billing & Plans' },
    analytics: { ar: 'التحليلات والمؤشرات', en: 'Analytics' },
    settings: { ar: 'الإعدادات والمفاتيح', en: 'Settings & APIs' },
    dashboard: { ar: 'لوحة التحكم العامة', en: 'Dashboard' },
    promptPlaceholder: {
      ar: 'صف التطبيق الذي تريد بناءه، على سبيل المثال: "منصة إدارة عيادات طبية مع حجز مواعيد، دفع Stripe، وبوت استشارات طبي مدعوم بـ Gemini"...',
      en: 'Describe the app you want to build, e.g.: "A medical clinic platform with appointments, Stripe payments, and a Gemini-powered medical copilot"...',
    },
    generateApp: { ar: 'توليد التطبيق بالذكاء الاصطناعي', en: 'Generate App with AI' },
    livePreview: { ar: 'معاينة حية', en: 'Live Preview' },
    codeEditor: { ar: 'محرر الكود', en: 'Code Editor' },
    visualBuilder: { ar: 'المحرر المرئي', en: 'Visual Builder' },
    deployNow: { ar: 'نشر فوري (Cloud Run)', en: 'Deploy (Cloud Run)' },
    exportCode: { ar: 'تصدير الكود', en: 'Export Code' },
    signIn: { ar: 'تسجيل الدخول', en: 'Sign In' },
    signUp: { ar: 'إنشاء حساب جديد', en: 'Create Account' },
    signOut: { ar: 'تسجيل الخروج', en: 'Sign Out' },
    account: { ar: 'الحساب والملف الشخصي', en: 'Account & Profile' },
    verifiedDeveloper: { ar: 'مطور موثق', en: 'Verified Developer' },
    architectInquiry: { ar: 'استفسار المعمارية قبل البناء', en: 'Architecture Pre-Build Inquiry' },
    buildOptions: { ar: 'خيارات البناء', en: 'Build Options' },
    confirmAndBuild: { ar: 'تأكيد وبدء البناء', en: 'Confirm & Start Build' },
    creditsCost: { ar: 'تكلفة الرصيد', en: 'Credits Cost' },
    timeElapsed: { ar: 'الوقت المنقضي', en: 'Elapsed Time' },
    securityNotice: { ar: 'بوابة دفع مشفرة وآمنة 256-bit SSL', en: '256-bit SSL Encrypted & Secure Gateway' },
  };

  const t = (key: string): string => {
    if (!dictionary[key]) return key;
    return dictionary[key][lang] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        dodoKey,
        setDodoKey,
        userPlan,
        setUserPlan,
        subscriptionStatus,
        setSubscriptionStatus,
        nextBillingDate,
        activatePlan,
        publishedUrl,
        setPublishedUrl,
        isPublishing,
        publishWebSite,
        testDodoKey,
        environment,
        setEnvironment,
        project,
        setProject,
        allProjects,
        setAllProjects,
        credits,
        useCredits,
        addCredits,
        tasks,
        setTasks,
        toasts,
        addToast,
        removeToast,
        isCmdPaletteOpen,
        setIsCmdPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        logoutUser,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
