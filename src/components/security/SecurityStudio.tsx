import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Key,
  Globe,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sliders,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  CreditCard,
  Check,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  lastActive: string;
}

interface AuditLogItem {
  id: string;
  actionAr: string;
  actionEn: string;
  timestamp: string;
  ip: string;
  status: 'safe' | 'warning' | 'verified';
}

export const SecurityStudio: React.FC = () => {
  const { lang, currentUser, addToast, userPlan } = useApp();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [fraudShieldActive, setFraudShieldActive] = useState(true);
  const [pciDssEnforced, setPciDssEnforced] = useState(true);
  const [threeDSecureRequired, setThreeDSecureRequired] = useState(true);
  const [ipLockEnabled, setIpLockEnabled] = useState(false);

  const [sessions, setSessions] = useState<ActiveSessionItem[]>([
    {
      id: 'sess-1',
      device: 'Apple MacBook Pro (macOS 15.1)',
      browser: 'Chrome 130.0 (Desktop)',
      location: lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      ip: '212.138.***.*** (Encrypted)',
      isCurrent: true,
      lastActive: lang === 'ar' ? 'الآن (نشط)' : 'Now (Active)',
    },
    {
      id: 'sess-2',
      device: 'Apple iPhone 15 Pro (iOS 18.2)',
      browser: 'Safari Mobile',
      location: lang === 'ar' ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia',
      ip: '178.80.***.***',
      isCurrent: false,
      lastActive: lang === 'ar' ? 'منذ 3 ساعات' : '3 hours ago',
    },
    {
      id: 'sess-3',
      device: 'Windows 11 Workstation',
      browser: 'Microsoft Edge',
      location: lang === 'ar' ? 'الدمام، المملكة العربية السعودية' : 'Dammam, Saudi Arabia',
      ip: '5.109.***.***',
      isCurrent: false,
      lastActive: lang === 'ar' ? 'أمس' : 'Yesterday',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      actionAr: 'تسجيل دخول ناجح بالحساب الموثق',
      actionEn: 'Verified account login successful',
      timestamp: '2026-10-21 02:40:11',
      ip: '212.138.12.98',
      status: 'verified',
    },
    {
      id: 'log-2',
      actionAr: 'تحقق حاجز الأمان 3D Secure لعملية سحب البطاقة',
      actionEn: '3D Secure challenge verified for payment deduction',
      timestamp: '2026-10-20 21:15:44',
      ip: '212.138.12.98',
      status: 'safe',
    },
    {
      id: 'log-3',
      actionAr: 'تحديث مفاتيح التشفير السحابية خلف النظام',
      actionEn: 'Cloud encryption keys rotated in secure background vault',
      timestamp: '2026-10-19 14:02:18',
      ip: 'Server Internal',
      status: 'safe',
    },
    {
      id: 'log-4',
      actionAr: 'فحص فوري ضد الاحتيال (نتيجة الفحص: 99.8% آمن)',
      actionEn: 'AI Fraud scan executed (Score: 99.8% Safe)',
      timestamp: '2026-10-18 10:20:05',
      ip: '178.80.44.12',
      status: 'verified',
    },
  ]);

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    addToast(
      lang === 'ar'
        ? 'تم إنهاء جميع الجلسات والأجهزة الأخرى وحماية حسابك فوراً'
        : 'All other sessions terminated successfully. Account secured.',
      'success'
    );
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    addToast(
      lang === 'ar'
        ? next
          ? 'تم تفعيل حاجز التحقق بخطوتين (2FA) بنجاح!'
          : 'تم إيقاف التحقق بخطوتين مؤقتاً.'
        : next
        ? 'Two-Factor Authentication enabled!'
        : 'Two-Factor Authentication disabled.',
      next ? 'success' : 'info'
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-zinc-950 text-zinc-100 select-none">
      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {lang === 'ar' ? 'حواجز الأمان والحماية المصرفية' : 'Bank-Grade Security & Fraud Barriers'}
              </span>
              <span className="text-zinc-400 text-xs">|</span>
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'ar' ? 'تشفير 256-bit TLS 1.3 معتمد' : 'Certified 256-bit TLS 1.3'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ar' ? 'مركز الأمان والتوثيق وحواجز الدفع' : 'Security Center & Payment Safeguards'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'إدارة حواجز الأمان الشاملة، والتحقق بخطوتين، ومراقبة الجلسات النشطة، والتأكد من مطابقة جميع عمليات السحب والدفع للمعايير المصرفية الصارمة.'
                : 'Comprehensive security controls, 2FA enforcement, fraud barriers, active session governance, and payment transaction protection.'}
            </p>
          </div>

          {/* Security Score Badge */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">
                {lang === 'ar' ? 'مؤشر أمان الحساب' : 'Security Health'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-400 font-mono">99.8%</span>
                <span className="text-[10px] font-bold text-zinc-400">
                  {lang === 'ar' ? 'محمي بالكامل' : 'Optimal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Row 1: Payment Barriers & Safeguards (حواجز الأمان المالية) */}
        <div>
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'حواجز أمان الدفع والعمليات المالية' : 'Payment & Transaction Safeguards'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Barrier 1 */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'حاجز 3D Secure 2.2 الإلزامي' : 'Mandatory 3D Secure 2.2'}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'طلب رمز تحقق SMS من البنك المصدر للبطاقة قبل تأكيد أي سحب مالي لحمايتك من الاستخدام غير المصرح به.'
                    : 'Enforces bank SMS OTP challenge on all credit card deductions to prevent unauthorized transactions.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'نشط وإلزامي' : 'Active'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Mada / Visa / Apple Pay</span>
              </div>
            </div>

            {/* Barrier 2 */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'درع فحص الاحتيال التلقائي' : 'AI Fraud Prevention Shield'}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'نظام ذكي يحلل سلوك الدفع ومطابقة IP والموقع الجغرافي لحظر البطاقات المشبوهة فوراً.'
                    : 'Scans device fingerprints, IP location matching, and velocity checks to block fraudulent charges.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'مراقبة حية 24/7' : 'Live 24/7'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Zero Chargeback</span>
              </div>
            </div>

            {/* Barrier 3 */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'خزينة البطاقات المشفرة PCI-DSS' : 'PCI-DSS Tokenized Vault'}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'أرقام البطاقات لا تُخزن أبداً على خوادم التطبيق؛ بل يتم تشفيرها وفق أعلى معايير أمان بطاقات الدفع العالمية.'
                    : 'Card credentials never touch raw servers. Tokenized end-to-end under PCI-DSS Level 1 specifications.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'معتمد ومحمي' : 'Compliant'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">AES-256 GCM</span>
              </div>
            </div>

            {/* Barrier 4 */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">
                  {lang === 'ar' ? 'فواتير ضريبية موثقة برقم تسلسلي' : 'Certified Tax Invoicing Audit'}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'إصدار إيصال مالي وفاتورة رسمية لكل عملية سحب بنقاط أو مبالغ مالية متوافقة مع الأنظمة المحاسبية.'
                    : 'Generates instant certified tax receipts with cryptographic serial numbers for every transaction.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'أرشفة فورية' : 'Archived'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">ZATCA Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Account Security & Two-Factor Authentication */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2FA Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'المصادقة الثنائية (2FA)' : 'Two-Factor Authentication'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {lang === 'ar' ? 'حاجز الحماية الإضافي لتسجيل الدخول' : 'Extra login security barrier'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  twoFactorEnabled ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {lang === 'ar'
                ? 'عند تفعيل هذا الخيار، سيُطلب منك إدخال رمز أمان مؤقت مرسل إلى هاتفك المحمول أو تطبيق Authenticator عند تسجيل الدخول من جهاز جديد أو سحب خدمات مميزة.'
                : 'Protects your account by requiring an SMS or authenticator code when signing in from an unrecognized device.'}
            </p>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{lang === 'ar' ? 'رقم الهاتف الموثق:' : 'Verified Phone:'}</span>
                <span className="font-mono text-white font-bold">+966 50 *** 4567</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{lang === 'ar' ? 'طريقة الاستلام:' : 'Delivery Method:'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'رسالة SMS فورية' : 'Direct SMS'}</span>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'الجلسات والأجهزة النشطة المتصلة' : 'Active Connected Sessions'}</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {lang === 'ar'
                    ? 'قائمة بالأجهزة المصرح لها بالدخول لحسابك حالياً'
                    : 'Manage devices currently authenticated to your account'}
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeAllOtherSessions}
                  className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-xs font-semibold text-red-300 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إنهاء كل الجلسات الأخرى' : 'Terminate Other Sessions'}</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    sess.isCurrent
                      ? 'bg-zinc-950 border-emerald-500/40'
                      : 'bg-zinc-950/60 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        sess.isCurrent ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {lang === 'ar' ? 'الجهاز الحالي' : 'Current Device'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                        {sess.browser} • {sess.location} • {sess.ip}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400">{sess.lastActive}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Security Audit Log (سجل عمليات الأمان) */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>{lang === 'ar' ? 'سجل تدقيق الأمان والمعاملات الموثقة' : 'Security Audit Trail & Verification Logs'}</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              {lang === 'ar' ? 'سجل غير قابل للتعديل (WORM)' : 'Immutable Audit Log'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                  <th className="pb-2 font-medium">{lang === 'ar' ? 'الحدث والعملية' : 'Event / Action'}</th>
                  <th className="pb-2 font-medium">{lang === 'ar' ? 'التوقيت' : 'Timestamp'}</th>
                  <th className="pb-2 font-medium">{lang === 'ar' ? 'عنوان IP' : 'Source IP'}</th>
                  <th className="pb-2 font-medium">{lang === 'ar' ? 'حالة التحقق' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/50 transition">
                    <td className="py-2.5 font-sans font-medium text-white">
                      {lang === 'ar' ? log.actionAr : log.actionEn}
                    </td>
                    <td className="py-2.5 text-zinc-400">{log.timestamp}</td>
                    <td className="py-2.5 text-zinc-400">{log.ip}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {lang === 'ar' ? 'موثق وآمن' : 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
