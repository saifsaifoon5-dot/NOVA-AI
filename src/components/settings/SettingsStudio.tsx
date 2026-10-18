import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_API_KEYS } from '../../data/initialData';
import { ApiKeyItem } from '../../types';
import {
  Sliders,
  Key,
  Users,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';

export const SettingsStudio: React.FC = () => {
  const { lang, setLang, theme, toggleTheme, addToast } = useApp();

  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [newKeyNameInput, setNewKeyNameInput] = useState('');

  const handleCreateKey = () => {
    const name = newKeyNameInput.trim() || (lang === 'ar' ? `مفتاح إنتاج #${apiKeys.length + 1}` : `Production Key #${apiKeys.length + 1}`);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name,
      keyPrefix: `lgs_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      created: lang === 'ar' ? 'اليوم' : 'Today',
      lastUsed: lang === 'ar' ? 'لم يُستخدم بعد' : 'Never',
      environment: 'production',
      status: 'active',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyNameInput('');
    setIsNewKeyModalOpen(false);
    addToast(lang === 'ar' ? `تم إنشاء المفتاح "${name}"` : `API key "${name}" created`, 'success');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    addToast(lang === 'ar' ? 'تم حذف المفتاح' : 'Key revoked', 'info');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'الإعدادات ومفاتيح API' : 'Settings & API Management'}
          </h2>
        </div>

        <button
          onClick={() => setIsNewKeyModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'إنشاء مفتاح جديد' : 'New API Key'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {/* Language & Appearance Preferences */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {lang === 'ar' ? 'تفضيلات اللغة والمظهر' : 'Language & Interface Preferences'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-200">
                  {lang === 'ar' ? 'لغة الواجهة (Interface Language)' : 'Primary Language'}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {lang === 'ar' ? 'اختر بين الإنجليزية والعربية' : 'Switch between English and Arabic'}
                </p>
              </div>

              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    lang === 'en' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('ar')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    lang === 'ar' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-200">
                  {lang === 'ar' ? 'مظهر النظام (Theme Mode)' : 'Appearance Theme'}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {lang === 'ar' ? 'داكن أو فاتح' : 'Dark matte or high-contrast light'}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition"
              >
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-zinc-400" />
              <span>{lang === 'ar' ? 'مفاتيح API' : 'API Tokens'}</span>
            </h3>
            <span className="text-[11px] text-zinc-500">
              {lang === 'ar' ? 'ربط التطبيقات الخارجية' : 'Programmatic API access'}
            </span>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Token Prefix</th>
                  <th className="p-2.5">Env</th>
                  <th className="p-2.5">Last Used</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-mono">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-zinc-900/30">
                    <td className="p-2.5 text-zinc-200 font-sans">{k.name}</td>
                    <td className="p-2.5 text-zinc-300">{k.keyPrefix}</td>
                    <td className="p-2.5 text-zinc-400">{k.environment}</td>
                    <td className="p-2.5 text-zinc-500 font-sans">{k.lastUsed}</td>
                    <td className="p-2.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(k.keyPrefix);
                            setCopiedKey(k.id);
                            setTimeout(() => setCopiedKey(null), 2000);
                            addToast(lang === 'ar' ? 'تم نسخ المفتاح' : 'Key copied', 'success');
                          }}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-zinc-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Roles (RBAC) */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'ar' ? 'فريق العمل وأدوار الصلاحيات (RBAC)' : 'Team Members & RBAC Roles'}</span>
          </h3>

          <div className="space-y-1.5">
            {[
              { name: 'Saif (You)', email: 'saifsaifoon5@gmail.com', role: 'Owner' },
              { name: 'Mariam Al-Ahmad', email: 'mariam@company.ai', role: 'Editor / Developer' },
              { name: 'Tariq Saeed', email: 'tariq@company.ai', role: 'Viewer' },
            ].map((member, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-zinc-200">{member.name}</p>
                  <p className="text-zinc-500 font-mono text-[11px]">{member.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Key Modal Dialog */}
      {isNewKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {lang === 'ar' ? 'إنشاء مفتاح API جديد' : 'Create New API Key'}
              </h3>
              <button
                onClick={() => setIsNewKeyModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">
                {lang === 'ar' ? 'اسم المفتاح أو الغرض منه' : 'Key Name / Purpose'}
              </label>
              <input
                type="text"
                autoFocus
                value={newKeyNameInput}
                onChange={(e) => setNewKeyNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                placeholder={lang === 'ar' ? 'مثال: Production Backend, Webhook Service' : 'e.g. Production Backend, Webhook Service'}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-zinc-500 text-xs text-zinc-100 outline-none font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewKeyModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateKey}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold"
              >
                {lang === 'ar' ? 'توليد المفتاح' : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
