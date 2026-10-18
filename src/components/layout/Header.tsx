import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  Sun, 
  Moon, 
  Search, 
  Coins, 
  Rocket, 
  Keyboard, 
  Menu,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    project,
    credits,
    addCredits,
    setActiveTab,
    toggleSidebar,
    userPlan,
    setIsCmdPaletteOpen,
    setIsShortcutsOpen,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Workspace Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Prominent Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition shadow-xs"
          title={lang === 'ar' ? 'فتح قائمة الأدوات والاستوديوهات' : 'Open modules drawer'}
        >
          <Menu className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold">
            {lang === 'ar' ? 'الأدوات' : 'Modules'}
          </span>
        </button>

        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group ml-1"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-white text-xs group-hover:border-zinc-500 transition shadow-xs tracking-wider">
            NOVA
          </div>
          <div>
            <div className="flex items-center gap-1.5" dir="ltr">
              <span className="font-bold text-zinc-100 text-xs tracking-tight">NOVA Studio</span>
              <span className="text-[10px] text-zinc-400 font-mono">v3.0</span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate max-w-[180px] sm:max-w-xs leading-none mt-0.5">
              {project.name}
            </p>
          </div>
        </div>
      </div>

      {/* Center Search / Command Launcher */}
      <button
        onClick={() => setIsCmdPaletteOpen(true)}
        className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs transition-colors w-72 justify-between"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>{lang === 'ar' ? 'البحث أو تنفيذ أمر سريع...' : 'Search or execute command...'}</span>
        </div>
        <kbd className="font-mono text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-400 border border-zinc-700">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Active Plan Badge connected to Secure Payment */}
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition font-mono shrink-0 ${
            userPlan.toLowerCase().includes('enterprise')
              ? 'bg-purple-950/60 border-purple-800/80 text-purple-300 hover:bg-purple-900/60'
              : userPlan.toLowerCase().includes('team')
              ? 'bg-blue-950/60 border-blue-800/80 text-blue-300 hover:bg-blue-900/60'
              : userPlan.toLowerCase().includes('pro')
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title={lang === 'ar' ? 'إدارة الاشتراك وبوابة الدفع الآمنة' : 'Manage subscription & payment gateway'}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-[11px] truncate max-w-[85px]">{userPlan}</span>
        </button>

        {/* Credits Counter with top-up */}
        <button
          onClick={() => setActiveTab('billing')}
          title={lang === 'ar' ? 'انقر لفتح بوابة شحن الرصيد والاشتراكات' : 'Top-up credits & manage plans'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs transition text-zinc-300"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] font-medium">{credits.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-400 hidden sm:inline">{lang === 'ar' ? 'رصيد' : 'cr'}</span>
        </button>

        {/* Standalone Live Website Link */}
        <a
          href={typeof window !== 'undefined' && window.location.host.includes('run.app') ? `https://${window.location.host.replace('ais-dev-', 'ais-pre-')}/live` : 'https://ais-pre-a5uph747sbueeb7fvoyb47-506274718026.europe-west2.run.app/live'}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition shadow-xs active:scale-95"
          title={lang === 'ar' ? 'فتح الموقع المستقل المباشر للمستخدمين دون واجهة بيلد' : 'Open live standalone web app'}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'رابط الموقع للمستخدمين ↗' : 'User Live App ↗'}</span>
        </a>

        {/* Deploy Action */}
        <button
          onClick={() => setActiveTab('deployment')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-xs transition"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'النشر' : 'Deploy'}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5 transition shrink-0"
          title={lang === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
        >
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-[11px] font-mono">{lang === 'en' ? 'عربي' : 'EN'}</span>
        </button>

        {/* User Account / Sign In Trigger */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border transition shrink-0 ${
            currentUser && currentUser.provider !== 'guest'
              ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700 text-zinc-200'
              : 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-700 text-emerald-300'
          }`}
          title={
            currentUser && currentUser.provider !== 'guest'
              ? (lang === 'ar' ? `حساب المطور: ${currentUser.name}` : `Account: ${currentUser.name}`)
              : (lang === 'ar' ? 'تسجيل الدخول بحسابك' : 'Sign In with Account')
          }
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-6 h-6 rounded-full object-cover border border-zinc-700"
          />
          <div className="hidden xl:flex flex-col text-left text-[11px] leading-tight">
            <span className="font-bold truncate max-w-[100px]">
              {currentUser?.name || (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </span>
          </div>
          {currentUser && currentUser.verified && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition shrink-0"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Shortcuts Modal Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden 2xl:block p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition shrink-0"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
