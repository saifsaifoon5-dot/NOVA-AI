/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { TopSegmentBar } from './components/layout/TopSegmentBar';
import { Sidebar } from './components/layout/Sidebar';
import { Toasts } from './components/layout/Toasts';
import { CommandPalette } from './components/modals/CommandPalette';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';
import { AuthModal } from './components/modals/AuthModal';

// Studios
import { BuildStudio } from './components/studio/BuildStudio';
import { PaidServicesStudio } from './components/services/PaidServicesStudio';
import { DashboardStudio } from './components/dashboard/DashboardStudio';
import { DatabaseStudio } from './components/database/DatabaseStudio';
import { DeploymentStudio } from './components/deployment/DeploymentStudio';
import { KanbanStudio } from './components/kanban/KanbanStudio';
import { MarketplaceStudio } from './components/marketplace/MarketplaceStudio';
import { BillingStudio } from './components/billing/BillingStudio';
import { AnalyticsStudio } from './components/analytics/AnalyticsStudio';
import { SecurityStudio } from './components/security/SecurityStudio';
import { SettingsStudio } from './components/settings/SettingsStudio';
import { GlobalBuildProgress } from './components/layout/GlobalBuildProgress';

const AppContent: React.FC = () => {
  const { activeTab, viewMode, lang } = useApp();

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="h-screen h-[100dvh] max-h-[100dvh] bg-[#07090e] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white overflow-hidden relative"
    >
      {/* Distant High-Contrast Ambient Architectural Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle executive top radial lighting */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-indigo-950/25 via-emerald-950/15 to-transparent blur-[120px] rounded-full" />
        {/* Crisp high-contrast geometric grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      <Header />
      <GlobalBuildProgress />
      {activeTab !== 'build-studio' && <TopSegmentBar />}

      <div className="flex-1 flex overflow-hidden relative min-h-0 z-10">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden bg-transparent w-full h-full min-h-0">
          {activeTab === 'build-studio' && <BuildStudio />}
          {activeTab === 'ai-lab' && <PaidServicesStudio />}
          {activeTab === 'dashboard' && <DashboardStudio />}
          {activeTab === 'database' && <DatabaseStudio />}
          {activeTab === 'deployment' && <DeploymentStudio />}
          {activeTab === 'kanban' && <KanbanStudio />}
          {activeTab === 'marketplace' && <MarketplaceStudio />}
          {activeTab === 'billing' && <BillingStudio />}
          {activeTab === 'analytics' && <AnalyticsStudio />}
          {activeTab === 'settings' && <SettingsStudio />}
        </main>
      </div>

      <Toasts />
      <CommandPalette />
      <KeyboardShortcutsModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
