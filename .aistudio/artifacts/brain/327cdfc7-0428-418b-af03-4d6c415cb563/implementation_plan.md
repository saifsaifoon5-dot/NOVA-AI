# Lovable Gemini Studio (LGS) — Interface Separation, 3D Welcome Hero & Dodo Payments Integration

Reorganize LGS into modular, cleanly separated studios with dedicated view separation buttons, an interactive 3D particle hero welcome screen on Mission Control, fully wired working buttons across all views, and Dodo Payments API integration via `DODO_PAYMENT_KEY` for subscriptions and AI credit boosters.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been aligned based on your clarifying answers:
> - **Dodo Payments Integration**: Handled server-side with `process.env.DODO_PAYMENT_KEY` (with a secure fallback key configuration in Settings/Billing for live or sandbox test mode) powering real checkout sessions, webhook status verification, and instant AI credit provisioning.
> - **Interface Partitioning**: Added a top segment bar with explicit view-separation controls (`Full View`, `Split View`, and `Studio Focus` modes) plus sidebar collapse toggles to prevent any overlap or clutter between modules.
> - **Welcome Screen Visuals**: An interactive 3D particle canvas hero with smooth cursor physics, live metrics counters, and instant quick-launch buttons on the Mission Control landing view.
> - **Language Posture**: English is strictly the primary default throughout all views, with the instant Arabic (RTL) switch toggle accessible in both the top bar and settings.
> - **Zero Dead Buttons**: Every single button, action, and trigger across all views is assigned an active, functional handler with feedback, dialogs, or state changes.

---

### 1. Overview & Core Concept

- **What It Delivers**: A unified, professional developer platform combining AI-powered full-stack application creation (Prompt-to-App, visual builder, code editor, live sandbox), an advanced Gemini 3.8 AI Lab (models, multimodal OCR, media synthesis, multi-step agent chains, RAG vector store), and enterprise-grade billing powered by Dodo Payments.
- **Target Audience**: Founders, product engineers, software developers, and creators who need rapid AI app scaffolding without dealing with fragmented tools or clumsy interfaces.
- **Key Value**: Crisp workspace isolation with zero layout collisions, intuitive responsive controls, and end-to-end working features from prompt generation to live deployment and monetization.

---

### 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│  TOP HEADER: Brand · Project Breadcrumbs · View Mode Buttons · Lang    │
├──────────────┬─────────────────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN CONTENT VIEWPORT                                   │
│ [Collapse ◀] │                                                         │
│ · Mission    │  [View Separation Bar: Studio Focus | Split | Sandbox]  │
│ · Builder    │ ┌─────────────────────────────────────────────────────┐ │
│ · AI Lab     │ │ 3D Particle Welcome Hero (Interactive Canvas)       │ │
│ · Database   │ │ Welcome Back, Builder · Quick Launchpad · Stats     │ │
│ · Deployment │ └─────────────────────────────────────────────────────┘ │
│ · Kanban     │                                                         │
│ · Market     │ ┌───────────────────────┐ ┌───────────────────────────┐ │
│ · Billing    │ │ Active App Blueprint  │ │ Dodo Payments Sub Status  │ │
│ · Settings   │ └───────────────────────┘ └───────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

#### Key User Flows:
1. **Mission Control & Welcome**: Users land on a clean, atmospheric dashboard featuring an interactive 3D particle mesh hero that reacts to cursor hover, displaying live engine health, active app stats, and four primary launchpad buttons.
2. **View Separation & Focus Modes**: Users can toggle between **Single Studio Focus** (expanded workspace), **Split Preview** (side-by-side prompt and preview sandbox), and **Zen Fullscreen** using top separation buttons.
3. **Build Studio & Code Generation**: Type or choose prompt starters, generate React 19 + Tailwind blueprints with step-by-step reasoning logs, visually customize components, and inspect/edit code in the tree viewer.
4. **Billing & Dodo Payments Checkout**: Browse subscription tiers (Starter, Pro, Team, Enterprise) or credit booster packs; clicking "Checkout" connects to `/api/payments/dodo/checkout` to create a live or test session with customer redirection and invoice generation.
5. **Interactive Controls & Actions**: All buttons (Export ZIP, GitHub Sync, Run Model, Analyze OCR, Replan Agent, New Task, SQL Copy, Verify Domain, PWA Manifest) execute verified client-side actions and notify via toast alerts.

#### Visual Identity & Theme:
- **Palette**: Deep matte zinc (`#09090b` / `#18181b`) background surfaces, subtle hairline borders (`#27272a`), crisp white display headings, and muted neutral slate tones (`#71717a` / `#a1a1aa`).
- **Accent Signals**: Minimalist emerald (`#10b981`) for live status/success, amber (`#f59e0b`) for credits/tokens, and zinc-100 for primary CTA buttons.
- **Typography**: Display: *Plus Jakarta Sans* / *Tajawal*; Mono: *JetBrains Mono* for tabular data, currency metrics, and code blocks.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dodo Payments Integration Strategy**
  - *Chosen Approach*: Server-side endpoints `/api/payments/dodo/checkout`, `/api/payments/dodo/webhook`, and `/api/payments/dodo/status` using `process.env.DODO_PAYMENT_KEY`. If no key is set yet, an interactive modal allows the user to input their test/live key or simulate the checkout flow with real payment session response structures.
  - *Why*: Securely isolates payment keys from browser code while enabling immediate live testing and real checkout redirection.
- **Decision 2: Interactive 3D Welcome Canvas**
  - *Chosen Approach*: Lightweight WebGL/Canvas2D particle field with physics-based mouse spring dynamics, floating node connections, and hardware-accelerated 60 FPS animation loop with zero third-party bundle bloat.
  - *Why*: Ultra-fast load times, responsive on all devices, completely self-contained without heavy Three.js bundle overhead.
- **Decision 3: Universal Button Action Handlers**
  - *Chosen Approach*: Complete state dispatchers and modals for every action button (e.g., GitHub connection modal, download ZIP bundler, domain DNS validator dialog, new task creator, table column editor, agent replanner).
  - *Why*: Eliminates dead clicks and guarantees production-grade interactivity.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (React 19)                │
├─────────────────────────────────────────────────────────────┤
│  AppContext (Global State: Tab, Theme, Lang, Credits, Tasks)│
│  ├── Header (View Separator Controls, Lang Switch, Deploy)  │
│  ├── Sidebar (Collapsible Nav, Server Status Monitor)       │
│  ├── WelcomeParticleHero (Interactive 3D Canvas Physics)    │
│  ├── BuildStudio (Prompt-to-App, Visual Drag, Code Tree)    │
│  ├── AiLabStudio (Playground, Multimodal OCR, Agents, RAG)  │
│  ├── BillingStudio (Dodo Payments Checkout, Invoices)       │
│  └── Modals (Command Palette, Shortcuts, Payment Modal)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Fetch HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    Server Layer (Express + Vite)            │
├─────────────────────────────────────────────────────────────┤
│  /api/gemini/generate-app  --> Gemini 3.8 Flash Engine      │
│  /api/gemini/ai-lab        --> Model execution & OCR        │
│  /api/gemini/agent-planner --> Multi-step task planner      │
│  /api/payments/dodo/*      --> Dodo Payments API Gateway    │
└─────────────────────────────────────────────────────────────┘
```

#### Planned Changes & File Implementation:
1. **Server Updates (`server.ts`)**:
   - Add Dodo Payments integration routes (`/api/payments/dodo/checkout`, `/api/payments/dodo/verify`, `/api/payments/dodo/webhook`).
   - Use `process.env.DODO_PAYMENT_KEY` with fallback key configuration support.
2. **Interactive 3D Welcome Hero Component (`src/components/dashboard/WelcomeParticleHero.tsx`)**:
   - Canvas-based 3D particle mesh with cursor interactivity and responsive window resizing.
   - Quick launchpad buttons directly connected to Build Studio, AI Lab, Deploy, and Billing.
3. **View Separation & Workspace Modes (`src/components/layout/Header.tsx` & `src/context/AppContext.tsx`)**:
   - Add `viewMode` state: `'standard' | 'split' | 'focus'`, and `isSidebarCollapsed` toggle.
   - Top view-separation buttons to isolate or expand the active studio cleanly.
4. **Billing Studio with Dodo Payments (`src/components/billing/BillingStudio.tsx`)**:
   - Real Dodo Payments checkout trigger for subscription tiers and credit packs.
   - Live transaction status badge, key validator, and simulated/live checkout redirect.
5. **Universal Button Action Completeness**:
   - Ensure every button in Build Studio, Database, Deployment, Kanban, Marketplace, and Settings triggers an active modal, file download, copy event, or live state mutation.
6. **English-Primary Localization**:
   - Maintain English as default across all copy and component titles, with full Arabic RTL translation support on toggle.

---

### Verification & Testing
- Compile verification via `compile_applet`.
- TypeScript linting via `lint_applet` (`tsc --noEmit`).
- Verify dev server connectivity and Dodo Payments endpoints with `curl`.
- Validate that all buttons, modals, 3D particle canvas, and view separation toggles work cleanly without layout overlaps.
