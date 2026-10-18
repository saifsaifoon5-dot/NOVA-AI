import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatabaseTable, DatabaseField } from '../../types';
import {
  Database,
  Plus,
  Trash2,
  Shield,
  Copy,
  Check,
} from 'lucide-react';

export const DatabaseStudio: React.FC = () => {
  const { lang, project, setProject, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'auth' | 'sql'>('schema');
  const [selectedTableId, setSelectedTableId] = useState<string>(project.schema[0]?.id || 'tbl-1');
  const [copied, setCopied] = useState(false);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableNameInput, setNewTableNameInput] = useState('');

  // New field state
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<DatabaseField['type']>('text');

  // Auth configurations
  const [authProviders, setAuthProviders] = useState({
    google: true,
    github: true,
    emailPassword: true,
    phoneOtp: false,
    twoFactor: true,
    rlsEnabled: true,
    gdprCompliant: true,
  });

  const selectedTable = project.schema.find((t) => t.id === selectedTableId) || project.schema[0];

  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    const newField: DatabaseField = {
      name: newFieldName.trim().toLowerCase().replace(/\s+/g, '_'),
      type: newFieldType,
      isNullable: true,
    };

    setProject((prev) => ({
      ...prev,
      schema: prev.schema.map((t) =>
        t.id === selectedTableId ? { ...t, fields: [...t.fields, newField] } : t
      ),
    }));

    setNewFieldName('');
    addToast(
      lang === 'ar' ? `تمت إضافة الحقل "${newField.name}"` : `Added field "${newField.name}"`,
      'success'
    );
  };

  const handleConfirmAddTable = () => {
    const cleanName = (newTableNameInput.trim() || 'new_table').toLowerCase().replace(/\s+/g, '_');

    const newTable: DatabaseTable = {
      id: `tbl-${Date.now()}`,
      name: cleanName,
      fields: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'created_at', type: 'timestamp' },
      ],
    };

    setProject((prev) => ({
      ...prev,
      schema: [...prev.schema, newTable],
    }));

    setSelectedTableId(newTable.id);
    setNewTableNameInput('');
    setIsAddTableModalOpen(false);
    addToast(
      lang === 'ar' ? `تم إنشاء جدول "${cleanName}"` : `Table "${cleanName}" created`,
      'success'
    );
  };

  const generateSql = () => {
    return project.schema
      .map((t) => {
        const fieldDefs = t.fields.map((f) => {
          let typeSql = 'TEXT';
          if (f.type === 'uuid') typeSql = 'UUID';
          if (f.type === 'integer') typeSql = 'INTEGER';
          if (f.type === 'timestamp') typeSql = 'TIMESTAMPTZ DEFAULT NOW()';
          if (f.type === 'boolean') typeSql = 'BOOLEAN DEFAULT FALSE';
          if (f.type === 'jsonb') typeSql = 'JSONB';

          if (f.isPrimary) return `  ${f.name} UUID PRIMARY KEY DEFAULT gen_random_uuid()`;
          return `  ${f.name} ${typeSql}`;
        });

        return `-- Table: ${t.name}\nCREATE TABLE public.${t.name} (\n${fieldDefs.join(',\n')}\n);\n\n-- Row Level Security (RLS)\nALTER TABLE public.${t.name} ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Users can manage their records" ON public.${t.name}\n  FOR ALL USING (auth.uid() = user_id);`;
      })
      .join('\n\n');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header bar */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'مخطط البيانات و Backend (PostgreSQL)' : 'PostgreSQL Database & Backend'}
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              activeSubTab === 'schema' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'مخطط الجداول' : 'Schema Builder'}
          </button>
          <button
            onClick={() => setActiveSubTab('auth')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              activeSubTab === 'auth' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'المصادقة والأمان' : 'Auth & Policies'}
          </button>
          <button
            onClick={() => setActiveSubTab('sql')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              activeSubTab === 'sql' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'كود SQL' : 'SQL Export'}
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* 1. SCHEMA BUILDER */}
        {activeSubTab === 'schema' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Table List Column */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  {lang === 'ar' ? 'الجداول' : 'Tables'}
                </span>
                <button
                  onClick={() => setIsAddTableModalOpen(true)}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'جديد' : 'New'}</span>
                </button>
              </div>

              <div className="space-y-1">
                {project.schema.map((tbl) => (
                  <button
                    key={tbl.id}
                    onClick={() => setSelectedTableId(tbl.id)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono transition flex items-center justify-between ${
                      tbl.id === selectedTableId
                        ? 'bg-zinc-800 border-zinc-600 text-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{tbl.name}</span>
                    <span className="text-[10px] text-zinc-400 font-sans">{tbl.fields.length} cols</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Fields & Details */}
            <div className="md:col-span-3 space-y-4">
              {selectedTable && (
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 font-mono">{selectedTable.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {lang === 'ar' ? 'الحقول والأنواع المحددة' : 'Fields and data types for this entity'}
                    </p>
                  </div>

                  {/* Fields Table */}
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 select-none">
                        <tr>
                          <th className="p-2.5 font-medium">{lang === 'ar' ? 'اسم الحقل' : 'Field'}</th>
                          <th className="p-2.5 font-medium">{lang === 'ar' ? 'نوع البيانات' : 'Type'}</th>
                          <th className="p-2.5 font-medium">{lang === 'ar' ? 'القيود والأمان' : 'Constraint'}</th>
                          <th className="p-2.5 text-right">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 font-mono">
                        {selectedTable.fields.map((field, idx) => (
                          <tr key={idx} className="hover:bg-zinc-900/40">
                            <td className="p-2.5 text-zinc-200">{field.name}</td>
                            <td className="p-2.5 text-zinc-400">{field.type}</td>
                            <td className="p-2.5">
                              {field.isPrimary ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-emerald-400 border border-zinc-700">
                                  PRIMARY KEY
                                </span>
                              ) : (
                                <span className="text-zinc-600 text-[10px]">NULLABLE</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right">
                              {!field.isPrimary && (
                                <button
                                  onClick={() => {
                                    setProject((prev) => ({
                                      ...prev,
                                      schema: prev.schema.map((t) =>
                                        t.id === selectedTable.id
                                          ? { ...t, fields: t.fields.filter((_, i) => i !== idx) }
                                          : t
                                      ),
                                    }));
                                  }}
                                  className="text-zinc-500 hover:text-rose-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Field Form */}
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'اسم الحقل (مثل: status, price)...' : 'Field name (e.g., status, price)...'}
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="flex-1 p-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none w-full"
                    />

                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="p-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 outline-none w-full sm:w-auto font-mono"
                    >
                      <option value="text">text</option>
                      <option value="integer">integer</option>
                      <option value="uuid">uuid</option>
                      <option value="timestamp">timestamp</option>
                      <option value="boolean">boolean</option>
                      <option value="jsonb">jsonb</option>
                    </select>

                    <button
                      onClick={handleAddField}
                      className="px-3.5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded text-xs font-semibold shrink-0 transition"
                    >
                      {lang === 'ar' ? '+ إضافة حقل' : '+ Add Field'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. AUTH & SECURITY */}
        {activeSubTab === 'auth' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-400" />
                <span>{lang === 'ar' ? 'إعدادات المصادقة والأمان' : 'Identity Providers & Security Rules'}</span>
              </h3>

              <div className="space-y-2 pt-1">
                {[
                  { key: 'google', labelEn: 'Google OAuth Single Sign-On', labelAr: 'تسجيل الدخول عبر Google OAuth', desc: 'Automatic account linking and verified email' },
                  { key: 'github', labelEn: 'GitHub OAuth Login', labelAr: 'تسجيل الدخول عبر GitHub OAuth', desc: 'Developer identity and repository access' },
                  { key: 'emailPassword', labelEn: 'Email & Password + Magic Link', labelAr: 'البريد الإلكتروني وكلمة المرور', desc: 'Standard credentials authentication' },
                  { key: 'twoFactor', labelEn: 'Two-Factor Authentication (2FA)', labelAr: 'المصادقة الثنائية (2FA)', desc: 'TOTP authenticator app verification' },
                  { key: 'rlsEnabled', labelEn: 'Row Level Security (RLS)', labelAr: 'حماية مستوى الصفوف (RLS)', desc: 'PostgreSQL row-level isolation policies' },
                  { key: 'gdprCompliant', labelEn: 'GDPR Data Compliance', labelAr: 'التوافق مع GDPR', desc: 'Automated user data deletion and export endpoints' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </p>
                      <p className="text-[11px] text-zinc-400">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(authProviders as any)[item.key]}
                      onChange={(e) =>
                        setAuthProviders((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="w-4 h-4 accent-zinc-500 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SQL EXPORT */}
        {activeSubTab === 'sql' && (
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">
                  {lang === 'ar' ? 'استعلامات SQL المنشأة' : 'Generated SQL Schema'}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateSql());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    addToast(lang === 'ar' ? 'تم نسخ كود SQL' : 'SQL copied', 'success');
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ كود SQL' : 'Copy SQL')}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-auto leading-relaxed">
                {generateSql()}
              </pre>
            </div>
          </div>
        )}

        {/* Add Table Modal Dialog */}
        {isAddTableModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? 'إنشاء جدول جديد' : 'Create New Table'}
                </h3>
                <button
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  {lang === 'ar' ? 'اسم الجدول (PostgreSQL)' : 'Table Name (PostgreSQL)'}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newTableNameInput}
                  onChange={(e) => setNewTableNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmAddTable()}
                  placeholder="e.g. orders, subscriptions, customers"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-zinc-500 text-xs text-zinc-100 outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmAddTable}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold"
                >
                  {lang === 'ar' ? 'إنشاء الجدول' : 'Create Table'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
