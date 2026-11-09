import { Project, KanbanTask, TemplateItem, ApiKeyItem } from '../types';

export const INITIAL_PROJECT: Project = {
  id: 'proj-new',
  name: 'مشروع جديد',
  description: 'مساحة بناء معمارية فارغة بانتظار أمرك للبدء في تشييد المنظومة كوداً وتصميماً من الصفر.',
  framework: 'React 19 + Tailwind CSS',
  database: 'PostgreSQL (Cloud SQL)',
  auth: 'Passkeys FIDO2 + Google Identity',
  status: 'draft',
  lastModified: 'الآن',
  liveUrl: 'https://ais-pre-a5uph747sbueeb7fvoyb47-506274718026.europe-west2.run.app/live',
  environment: 'production',
  previewHtml: '',
  components: [],
  schema: [],
};

export const INITIAL_TASKS: KanbanTask[] = [];

export const TEMPLATES_MARKETPLACE: TemplateItem[] = [
  {
    id: 'tpl-ai-taskmind',
    title: 'NOVA AI TaskMind & Chatbox Studio',
    titleAr: 'منظومة الشات بوكس العصبي وإدارة المهام الذكية',
    description: 'Autonomous AI chatbox that decomposes user goals into live tasks with 11 navbar styles.',
    descriptionAr: 'شات بوكس ذكي يحلل أهداف المستخدم ويحولها إلى مهام متزامنة مع 11 نمطاً لأشرطة التنقل.',
    category: 'ai',
    stars: 489,
    author: 'NOVA Architecture Core',
    framework: 'React 19 + Tailwind',
    tags: ['NOVA Core', 'Chatbox', 'TaskMind', '11 Nav Styles', 'PostgreSQL'],
  },
  {
    id: 'tpl-saas-core',
    title: 'Enterprise AI Copilot Platform',
    titleAr: 'منصة مساعد الذكاء الاصطناعي للمؤسسات',
    description: 'Complete multi-tenant workspace with NOVA Core, Stripe billing, and team RBAC.',
    descriptionAr: 'مساحة عمل مؤسسية متعددة الحسابات تدعم NOVA Core واشتراكات Stripe وإدارة الصلاحيات.',
    category: 'saas',
    stars: 384,
    author: 'LGS Official',
    framework: 'React 19 + Tailwind',
    tags: ['NOVA Core', 'Stripe', 'Supabase', 'NextAuth'],
  },
  {
    id: 'tpl-rag-docs',
    title: 'Intelligent Knowledge Base & RAG',
    titleAr: 'قاعدة معرفة تفاعلية مع استرجاع RAG وتضمينات الفيكتور',
    description: 'Upload PDF and markdown files, vector search chunking, and instant citations with Gemini.',
    descriptionAr: 'رفع المستندات وملفات PDF والبحث المتجهي الفوري والإجابة مع إرفاق المراجع بدقة.',
    category: 'ai',
    stars: 420,
    author: 'LGS Labs',
    framework: 'React 19 + Tailwind',
    tags: ['RAG', 'Vector Search', 'Gemini Pro', 'OCR'],
  },
  {
    id: 'tpl-internal-crm',
    title: 'AI Lead CRM & Pipeline Tracker',
    titleAr: 'نظام إدارة علاقات العملاء الذكي (CRM) وتتبع الصفقات',
    description: 'Kanban board, AI sentiment detection on leads, automated email follow-up generator.',
    descriptionAr: 'لوحة كانبان ومحلل لمشاعر العملاء وتوليد رسائل المتابعة البريدية المخصصة.',
    category: 'internal-tool',
    stars: 218,
    author: 'Community Hub',
    framework: 'React 19 + Tailwind',
    tags: ['CRM', 'Sentiment Analysis', 'PostgreSQL', 'Kanban'],
  },
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Gemini Live Key',
    keyPrefix: 'lgs_live_920f...8a1c',
    created: '2026-10-01',
    lastUsed: 'منذ دقيقة',
    environment: 'production',
    status: 'active',
  },
  {
    id: 'key-2',
    name: 'Staging Integration Hook',
    keyPrefix: 'lgs_test_310b...290f',
    created: '2026-10-08',
    lastUsed: 'منذ ساعتين',
    environment: 'staging',
    status: 'active',
  },
];
