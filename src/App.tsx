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
import { AiLabStudio } from './components/ailab/AiLabStudio';
import { DashboardStudio } from './components/dashboard/DashboardStudio';
import { DatabaseStudio } from './components/database/DatabaseStudio';
import { DeploymentStudio } from './components/deployment/DeploymentStudio';
import { KanbanStudio } from './components/kanban/KanbanStudio';
import { MarketplaceStudio } from './components/marketplace/MarketplaceStudio';
import { BillingStudio } from './components/billing/BillingStudio';
import { AnalyticsStudio } from './components/analytics/AnalyticsStudio';
import { SettingsStudio } from './components/settings/SettingsStudio';

const AppContent: React.FC = () => {
  const { activeTab, viewMode } = useApp();

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white overflow-hidden">
      <Header />
      {activeTab !== 'build-studio' && <TopSegmentBar />}

      <div className="flex-1 flex overflow-hidden relative min-h-0">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950 w-full h-full min-h-0">
          {activeTab === 'build-studio' && <BuildStudio />}
          {activeTab === 'ai-lab' && <AiLabStudio />}
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
