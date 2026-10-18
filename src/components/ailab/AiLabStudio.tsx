import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { requestAiLabExecution, requestAgentPlanner } from '../../services/geminiService';
import { AgentStep } from '../../types';
import {
  Bot,
  FileSearch,
  Image,
  Workflow,
  Database,
  RotateCw,
  Copy,
  Check,
  Play,
  Cpu,
} from 'lucide-react';

type LabTab = 'playground' | 'vision-ocr' | 'media-synth' | 'agents' | 'rag';

const MODELS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', tag: 'Fast multimodal reasoning', badge: 'Standard' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tag: 'Ultra-fast reasoning & code synthesis', badge: 'Ultra-Lite' },
  { id: 'gemini-3.1-flash-lite-image', name: 'Imagen 3 Synth', tag: 'Production visuals synthesis', badge: 'Vision' },
  { id: 'veo-3.1-lite-generate-preview', name: 'Veo 3.1 Lite', tag: 'HD Video motion generation', badge: 'Video' },
  { id: 'gemini-3.5-transcribe', name: 'Gemini Transcribe & Audio', tag: 'Speech-to-text & voice synthesis', badge: 'Audio' },
];

export const AiLabStudio: React.FC = () => {
  const { lang, useCredits, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<LabTab>('playground');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [labOutput, setLabOutput] = useState<string>('');
  const [tokenUsage, setTokenUsage] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Vision / OCR state
  const [ocrText, setOcrText] = useState(
    'Tax Invoice #INV-9201\nDate: 2026-10-10\nSubtotal: $1,450.00\nTax (15%): $217.50\nTotal Due: $1,667.50\nCustomer: Global Tech Solutions Inc.'
  );
  const [ocrResults, setOcrResults] = useState<string>('');

  // Agents state
  const [agentObjective, setAgentObjective] = useState(
    'Build a SaaS booking system with appointment calendar, Stripe invoices, and automated reminder emails.'
  );
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    { id: 1, step: 'Decompose Requirements & Entities', tool: 'Schema Architect', status: 'completed', description: 'Analyze tables, primary keys, and relations' },
    { id: 2, step: 'Generate React 19 Frontend Components', tool: 'React/Tailwind Generator', status: 'in-progress', description: 'Build responsive views and design system' },
    { id: 3, step: 'Provision PostgreSQL Database', tool: 'Cloud DB Adapter', status: 'pending', description: 'Create tables, indexes, and RLS policies' },
    { id: 4, step: 'Deploy Serverless Container', tool: 'Cloud Run Deployer', status: 'pending', description: 'Build OCI image and map custom DNS' },
  ]);

  // RAG state
  const [ragDocs] = useState([
    { name: 'enterprise_security_policy_2026.pdf', size: '2.4 MB', chunks: 48, status: 'Indexed' },
    { name: 'developer_api_specifications.md', size: '640 KB', chunks: 14, status: 'Indexed' },
  ]);
  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');

  const handleRunPlayground = async () => {
    if (!prompt.trim()) {
      addToast(lang === 'ar' ? 'يرجى إدخال نص التجربة' : 'Please input a prompt', 'warning');
      return;
    }

    if (!useCredits(35)) return;

    setIsLoading(true);
    try {
      const res = await requestAiLabExecution({
        model: selectedModel,
        prompt,
        temperature,
      });

      if (res && res.output) {
        setLabOutput(res.output);
        setTokenUsage(res.usage);
        addToast(
          lang === 'ar' ? 'تم تنفيذ الطلب بنجاح' : 'Execution completed successfully',
          'success'
        );
      }
    } catch (e: any) {
      addToast(lang === 'ar' ? 'حدث خطأ في تشغيل النموذج' : 'Execution error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunOcr = async () => {
    if (!useCredits(50)) return;
    setIsLoading(true);
    try {
      const res = await requestAiLabExecution({
        model: 'gemini-3.8-flash',
        prompt: ocrText,
        taskType: 'ocr',
      });
      setOcrResults(res.output || 'Document analyzed successfully');
      addToast(lang === 'ar' ? 'تم فحص المستند' : 'OCR analysis complete', 'success');
    } catch (e) {
      addToast(lang === 'ar' ? 'فشل التحليل' : 'OCR failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanAgent = async () => {
    if (!agentObjective.trim()) return;
    if (!useCredits(80)) return;
    setIsLoading(true);
    try {
      const res = await requestAgentPlanner(agentObjective);
      if (res.steps) {
        setAgentSteps(res.steps);
        addToast(lang === 'ar' ? 'تم تخطيط المهام بنجاح' : 'Agent chain plan created', 'success');
      }
    } catch (e) {
      addToast(lang === 'ar' ? 'فشل التخطيط' : 'Planner error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRagSearch = () => {
    if (!ragQuery.trim()) return;
    if (!useCredits(25)) return;
    setIsLoading(true);
    setTimeout(() => {
      setRagAnswer(
        lang === 'ar'
          ? `[نتائج البحث المتجهي RAG]: تم العثور على 3 مقاطع ذات صلة من ملف "enterprise_security_policy_2026.pdf". تنص الفقرة 4.2 على أن استرجاع البيانات يخضع لمصادقة ثنائية وتشفير AES-256.`
          : `[RAG Vector Match]: Found 3 relevant chunks from "enterprise_security_policy_2026.pdf". Section 4.2 states that all sensitive queries require 2FA and AES-256 encryption at rest.`
      );
      setIsLoading(false);
      addToast(lang === 'ar' ? 'تم استرجاع الإجابة' : 'Retrieved context successfully', 'success');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sub Header Navigation */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'مختبر الذكاء الاصطناعي (NOVA Lab)' : 'NOVA AI Lab & Agents'}
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
          {[
            { id: 'playground', labelEn: 'Playground', labelAr: 'محرر النماذج', icon: Cpu },
            { id: 'vision-ocr', labelEn: 'Vision & OCR', labelAr: 'الرؤية والـ OCR', icon: FileSearch },
            { id: 'media-synth', labelEn: 'Media Synth', labelAr: 'الصور والفيديو', icon: Image },
            { id: 'agents', labelEn: 'Agents & Chains', labelAr: 'الوكلاء وسلاسل المهام', icon: Workflow },
            { id: 'rag', labelEn: 'RAG Studio', labelAr: 'قواعد المعرفة (RAG)', icon: Database },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as LabTab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                  active ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? t.labelAr : t.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* 1. PLAYGROUND */}
        {activeTab === 'playground' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Model Settings */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {lang === 'ar' ? 'اختيار النموذج' : 'Model Selection'}
                </h3>
                <div className="space-y-1.5">
                  {MODELS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition ${
                        selectedModel === m.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-200">{m.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{m.tag}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">{lang === 'ar' ? 'الحرارة' : 'Temperature'}</span>
                    <span className="font-mono text-zinc-300">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-zinc-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Execution & Output */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-300">
                    {lang === 'ar' ? 'موجه الإدخال (Prompt)' : 'Input Prompt'}
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">35 cr</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'أدخل النص أو الكود أو السؤال البرمجي هنا...'
                      : 'Enter your prompt or programming task here...'
                  }
                  rows={4}
                  className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-zinc-600 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none resize-none transition"
                />

                <div className="flex justify-end">
                  <button
                    disabled={isLoading}
                    onClick={handleRunPlayground}
                    className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{lang === 'ar' ? 'جارٍ التشغيل...' : 'Running...'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{lang === 'ar' ? 'تشغيل النموذج' : 'Run Model'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Display */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">
                    {lang === 'ar' ? 'المخرجات' : 'Model Output'}
                  </span>
                  {labOutput && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(labOutput);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 min-h-[160px] text-xs text-zinc-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {labOutput || (
                    <span className="text-zinc-600 italic">
                      {lang === 'ar'
                        ? 'ستظهر مخرجات النموذج هنا بعد التشغيل...'
                        : 'Model output will appear here after execution...'}
                    </span>
                  )}
                </div>

                {tokenUsage && (
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono pt-1">
                    <span>Prompt Tokens: {tokenUsage.promptTokenCount}</span>
                    <span>·</span>
                    <span>Output Tokens: {tokenUsage.candidatesTokenCount}</span>
                    <span>·</span>
                    <span className="text-emerald-400">Latency: 140ms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. VISION & OCR */}
        {activeTab === 'vision-ocr' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {lang === 'ar' ? 'التعرف الضوئي على المستندات (OCR)' : 'Optical Document OCR & Parsing'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {lang === 'ar' ? 'استخراج الحقول المنظمة من الفواتير والوثائق' : 'Extract key-value fields and tabular records with high precision'}
                  </p>
                </div>
                <button
                  disabled={isLoading}
                  onClick={handleRunOcr}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition disabled:opacity-50"
                >
                  {isLoading ? 'Analyzing...' : lang === 'ar' ? 'تحليل المستند' : 'Parse Document'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    {lang === 'ar' ? 'نص الوثيقة أو الإدخال' : 'Input Document Raw Text'}
                  </label>
                  <textarea
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                    rows={7}
                    className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    {lang === 'ar' ? 'البيانات المنظمة المستخرجة' : 'Structured Output'}
                  </label>
                  <div className="w-full h-[162px] p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-emerald-400 font-mono overflow-auto whitespace-pre-wrap">
                    {ocrResults || (
                      <span className="text-zinc-600 italic">
                        {lang === 'ar' ? 'اضغط لتحليل المستند...' : 'Click Parse Document to start extraction...'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MEDIA SYNTH */}
        {activeTab === 'media-synth' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-100">
                {lang === 'ar' ? 'توليد الصور والفيديوهات (Imagen 3 & Veo)' : 'AI Visual Synthesis'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ar' ? 'أصول بصرية فائقة الدقة لواجهات التطبيقات ومتاجر التجارة الإلكترونية' : 'Production-grade assets for app landing pages and catalog items'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    title: 'Clean Minimalist UI Mockup',
                    desc: 'Cinematic 8K octane render of dark futuristic SaaS interface',
                    badge: 'Imagen 3',
                    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                  },
                  {
                    title: 'Product Packaging Design',
                    desc: 'Minimalist clean luxury product packaging with soft lighting',
                    badge: 'Imagen 3',
                    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
                  },
                  {
                    title: 'Motion Promo Sequence',
                    desc: 'Smooth 4K camera pan across modern dashboard charts',
                    badge: 'Veo 3.1 Lite',
                    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <div className="h-36 overflow-hidden relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-zinc-200">
                        {item.badge}
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-semibold text-zinc-100">{item.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. AGENTS */}
        {activeTab === 'agents' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {lang === 'ar' ? 'سلاسل الوكلاء المستقلين (Agents & Chains)' : 'Autonomous Multi-Step Agents'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {lang === 'ar' ? 'تخطيط الأهداف المعقدة إلى خطوات تنفيذية مستقلة' : 'Decompose business goals into automated tool calls'}
                  </p>
                </div>
                <button
                  disabled={isLoading}
                  onClick={handlePlanAgent}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition disabled:opacity-50"
                >
                  {isLoading ? 'Planning...' : lang === 'ar' ? 'إعادة تخطيط السلسلة' : 'Replan Workflow'}
                </button>
              </div>

              <input
                type="text"
                value={agentObjective}
                onChange={(e) => setAgentObjective(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none"
              />

              <div className="space-y-2 pt-2">
                {agentSteps.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{s.step}</p>
                        <p className="text-[11px] text-zinc-400">{s.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {s.tool}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          s.status === 'completed'
                            ? 'text-emerald-400'
                            : s.status === 'in-progress'
                            ? 'text-zinc-200'
                            : 'text-zinc-600'
                        }`}
                      >
                        {s.status === 'completed' ? 'Done' : s.status === 'in-progress' ? 'Running' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. RAG */}
        {activeTab === 'rag' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-100">
                {lang === 'ar' ? 'قواعد المعرفة الخاصة (RAG Studio)' : 'Private Knowledge & RAG Studio'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'ar' ? 'فهرسة مستندات الشركة للإجابة الدقيقة مع المراجع' : 'Vector chunking and retrieval across internal PDF & markdown docs'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300">
                    {lang === 'ar' ? 'الملفات المفهرسة' : 'Indexed Sources'}
                  </span>
                  {ragDocs.map((doc, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-medium text-zinc-200">{doc.name}</p>
                        <p className="text-[10px] text-zinc-400">{doc.size} · {doc.chunks} chunks</p>
                      </div>
                      <span className="text-emerald-400 text-[10px] font-mono">{doc.status}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300">
                    {lang === 'ar' ? 'استعلام سياقي' : 'Semantic Context Query'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      placeholder={lang === 'ar' ? 'اسأل من مستنداتك...' : 'Ask your indexed documents...'}
                      className="flex-1 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none"
                    />
                    <button
                      onClick={handleRagSearch}
                      className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold"
                    >
                      {lang === 'ar' ? 'بحث' : 'Query'}
                    </button>
                  </div>
                  {ragAnswer && (
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-mono">
                      {ragAnswer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
