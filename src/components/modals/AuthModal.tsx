import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Key,
  Globe,
  Sparkles,
  ArrowRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    lang,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginUser,
    logoutUser,
    addToast,
    userPlan,
    credits,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = () => {
    setLoadingProvider('google');
    setTimeout(() => {
      loginUser({
        name: 'Tarek Al-Mansoor',
        email: 'tarek.architect@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        provider: 'google',
        verified: true,
      });
      setLoadingProvider(null);
      addToast(
        lang === 'ar'
          ? 'تم تسجيل الدخول بحساب Google بنجاح! تم ربط مشاريعك السحابية.'
          : 'Signed in with Google successfully! Your cloud builds are synced.',
        'success'
      );
    }, 600);
  };

  const handleGithubSignIn = () => {
    setLoadingProvider('github');
    setTimeout(() => {
      loginUser({
        name: 'Alex Developer',
        email: 'alex.dev@github.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        provider: 'github',
        verified: true,
      });
      setLoadingProvider(null);
      addToast(
        lang === 'ar'
          ? 'تم تسجيل الدخول بحساب GitHub بنجاح!'
          : 'Signed in with GitHub successfully!',
        'success'
      );
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast(
        lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password',
        'warning'
      );
      return;
    }

    setLoadingProvider('email');
    setTimeout(() => {
      loginUser({
        name: name || email.split('@')[0],
        email,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
        provider: 'email',
        verified: true,
      });
      setLoadingProvider(null);
      addToast(
        lang === 'ar'
          ? `مرحباً بك ${name || email.split('@')[0]}! تم تسجيل الدخول.`
          : `Welcome ${name || email.split('@')[0]}! Signed in successfully.`,
        'success'
      );
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-white text-xs">
              NOVA
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {lang === 'ar' ? 'حساب المطور والمعمارية' : 'Developer & Architect Account'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {lang === 'ar' ? 'تأمين المشاريع ومزامنة البناء السحابي' : 'Secure projects & cloud builds sync'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User is already logged in & wants to view/manage account */}
        {currentUser && currentUser.provider !== 'guest' && mode === 'profile' ? (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full border-2 border-emerald-500/80 object-cover shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-zinc-400 truncate font-mono">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {userPlan}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {credits.toLocaleString()} {lang === 'ar' ? 'رصيد' : 'cr'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats & keys */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-400">{lang === 'ar' ? 'المشاريع المنشورة' : 'Deployed Projects'}</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{currentUser.projectsCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-400">{lang === 'ar' ? 'عمليات البناء المنجزة' : 'Total Builds'}</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{currentUser.totalBuilds}</p>
              </div>
            </div>

            {/* API Key */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  {lang === 'ar' ? 'مفتاح API المخصص' : 'Personal API Key'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">{lang === 'ar' ? 'نشط' : 'Active'}</span>
              </div>
              <code className="block text-xs font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800 truncate">
                {currentUser.apiKey}
              </code>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setMode('signin')}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold text-zinc-200 transition"
              >
                {lang === 'ar' ? 'تبديل الحساب' : 'Switch Account'}
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  setMode('signin');
                  addToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out', 'info');
                }}
                className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-xs font-semibold text-red-300 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Mode Switcher */}
            <div className="flex p-0.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  mode === 'signin'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  mode === 'signup'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang === 'ar' ? 'حساب جديد' : 'Sign Up'}
              </button>
            </div>

            {/* 1-Click Social Sign-In */}
            <div className="space-y-2.5">
              <button
                onClick={handleGoogleSignIn}
                disabled={Boolean(loadingProvider)}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition shadow-xs active:scale-[0.99] disabled:opacity-70"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>
                  {loadingProvider === 'google'
                    ? (lang === 'ar' ? 'جارٍ التحقق...' : 'Connecting...')
                    : (lang === 'ar' ? 'المتابعة بحساب Google' : 'Continue with Google')}
                </span>
              </button>

              <button
                onClick={handleGithubSignIn}
                disabled={Boolean(loadingProvider)}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition disabled:opacity-70"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>
                  {loadingProvider === 'github'
                    ? (lang === 'ar' ? 'جارٍ التحقق...' : 'Connecting...')
                    : (lang === 'ar' ? 'المتابعة بحساب GitHub' : 'Continue with GitHub')}
                </span>
              </button>
            </div>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <span className="relative px-3 bg-zinc-900 text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                {lang === 'ar' ? 'أو عبر البريد' : 'Or with Email'}
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: أحمد عبد الله' : 'e.g. John Doe'}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-zinc-700"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-hidden focus:border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0"
                  />
                  <span>{lang === 'ar' ? 'تذكر جلستي' : 'Remember session'}</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast(lang === 'ar' ? 'تم إرسال رابط الاستعادة إلى بريدك' : 'Recovery link sent', 'info'); }} className="hover:text-zinc-200">
                  {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </a>
              </div>

              <button
                type="submit"
                disabled={Boolean(loadingProvider)}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{mode === 'signin' ? (lang === 'ar' ? 'دخول فوري' : 'Sign In Now') : (lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Free Account')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'ar' ? 'اتصال مشفر 256-bit SSL متوافق مع معايير الأمان العالمية' : '256-bit SSL encrypted connection & ISO compliant'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
