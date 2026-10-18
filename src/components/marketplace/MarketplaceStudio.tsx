import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEMPLATES_MARKETPLACE } from '../../data/initialData';
import { TemplateItem } from '../../types';
import {
  ShoppingBag,
  Star,
  Sparkles,
} from 'lucide-react';

export const MarketplaceStudio: React.FC = () => {
  const { lang, setProject, setActiveTab, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = TEMPLATES_MARKETPLACE.filter((tpl) => {
    const matchCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchSearch =
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.titleAr.includes(search) ||
      tpl.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCloneTemplate = (tpl: TemplateItem) => {
    setProject((prev) => ({
      ...prev,
      name: lang === 'ar' ? tpl.titleAr : tpl.title,
      description: lang === 'ar' ? tpl.descriptionAr : tpl.description,
      status: 'deployed',
    }));

    addToast(
      lang === 'ar'
        ? `تم استنساخ قالب "${tpl.titleAr}" إلى مشروعك بنجاح!`
        : `Cloned template "${tpl.title}" into project!`,
      'success'
    );

    setActiveTab('build-studio');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'سوق القوالب والمكونات' : 'Templates & Component Marketplace'}
          </h2>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
          {[
            { id: 'all', labelEn: 'All', labelAr: 'الكل' },
            { id: 'saas', labelEn: 'SaaS', labelAr: 'منصات SaaS' },
            { id: 'ai', labelEn: 'AI Apps', labelAr: 'تطبيقات AI' },
            { id: 'ecommerce', labelEn: 'E-Commerce', labelAr: 'متاجر' },
            { id: 'internal-tool', labelEn: 'Internal Tools', labelAr: 'أدوات داخلية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedCategory === cat.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {lang === 'ar' ? tpl.titleAr : tpl.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      {lang === 'ar' ? tpl.descriptionAr : tpl.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-mono shrink-0 ml-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tpl.stars}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {tpl.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500 font-mono">By: {tpl.author}</span>
                <button
                  onClick={() => handleCloneTemplate(tpl)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold shadow-sm flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'استنساخ' : 'Clone & Build'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
