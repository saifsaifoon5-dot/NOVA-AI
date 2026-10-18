export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';
export type Environment = 'development' | 'staging' | 'production';
export type ViewMode = 'standard' | 'split' | 'focus';

export type AppTab = 
  | 'dashboard'
  | 'build-studio'
  | 'ai-lab'
  | 'database'
  | 'deployment'
  | 'kanban'
  | 'marketplace'
  | 'billing'
  | 'analytics'
  | 'settings';

export interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  database: string;
  auth: string;
  status: 'draft' | 'building' | 'deployed' | 'error';
  lastModified: string;
  liveUrl?: string;
  previewHtml: string;
  components: GeneratedComponent[];
  schema: DatabaseTable[];
  environment: Environment;
}

export interface GeneratedComponent {
  name: string;
  purpose: string;
  code: string;
}

export interface DatabaseField {
  name: string;
  type: 'uuid' | 'text' | 'integer' | 'boolean' | 'timestamp' | 'jsonb';
  isPrimary?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
}

export interface DatabaseTable {
  id: string;
  name: string;
  fields: DatabaseField[];
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  timeSpentHours: number;
  commentsCount: number;
}

export interface TemplateItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'saas' | 'ai' | 'ecommerce' | 'internal-tool' | 'mobile';
  stars: number;
  author: string;
  previewUrl?: string;
  framework: string;
  tags: string[];
}

export interface AgentStep {
  id: number;
  step: string;
  tool: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  description: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  lastUsed: string;
  environment: Environment;
  status: 'active' | 'revoked';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'email' | 'github' | 'guest';
  plan: string;
  role: 'owner' | 'developer' | 'architect';
  apiKey: string;
  joinedDate: string;
  verified: boolean;
  projectsCount: number;
  totalBuilds: number;
}
