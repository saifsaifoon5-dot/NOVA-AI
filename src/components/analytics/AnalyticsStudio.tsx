import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Globe2,
} from 'lucide-react';

export const AnalyticsStudio: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'التحليلات ومؤشرات الأداء' : 'Analytics & Telemetry'}
          </h2>
        </div>

        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {lang === 'ar' ? 'البث المباشر نشط' : 'STREAM: 200 OK'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-5xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}</span>
              <span className="text-emerald-400 font-mono">+24%</span>
            </div>
            <p className="text-xl font-bold text-white mt-1 font-mono">1,248,390</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">30-day window</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>{lang === 'ar' ? 'متوسط زمن الاستجابة' : 'Avg Latency'}</span>
              <span className="text-zinc-300 font-mono">Fast</span>
            </div>
            <p className="text-xl font-bold text-zinc-100 mt-1 font-mono">138 ms</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Google Cloud Edge</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>{lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}</span>
              <span className="text-emerald-400 font-mono">99.98%</span>
            </div>
            <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">100%</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">0 critical errors</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>{lang === 'ar' ? 'الرموز المعالجة' : 'Tokens Processed'}</span>
              <span className="text-zinc-300 font-mono">14.2M</span>
            </div>
            <p className="text-xl font-bold text-zinc-100 mt-1 font-mono">14,280,000</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Flash + Pro</p>
          </div>
        </div>

        {/* Model Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {lang === 'ar' ? 'توزيع استهلاك النماذج' : 'Model Volume Breakdown'}
            </h3>

            <div className="space-y-2.5">
              {[
                { name: 'Gemini 3.8 Flash', share: 72, count: '898,840 req' },
                { name: 'Gemini 3.1 Pro', share: 18, count: '224,710 req' },
                { name: 'Imagen 3 & Veo', share: 7, count: '87,380 req' },
                { name: 'Audio & Transcribe', share: 3, count: '37,460 req' },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>{m.name}</span>
                    <span className="font-mono text-zinc-400">{m.share}% ({m.count})</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-400 h-full" style={{ width: `${m.share}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {lang === 'ar' ? 'التوزيع الجغرافي' : 'Edge Regions & Latency'}
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { region: 'Middle East (me-central1 / Dammam)', latency: '32 ms', traffic: '54%' },
                { region: 'Europe (europe-west2 / London)', latency: '110 ms', traffic: '28%' },
                { region: 'North America (us-central1)', latency: '164 ms', traffic: '14%' },
                { region: 'Asia Pacific (asia-southeast1)', latency: '210 ms', traffic: '4%' },
              ].map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-200">{r.region}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-zinc-400">
                    <span className="text-emerald-400">{r.latency}</span>
                    <span>{r.traffic}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
