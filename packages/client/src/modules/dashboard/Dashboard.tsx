import React, { useEffect } from 'react';
import { Header } from '../../components/Header';
import { ErrorBanner, SkeletonLoader } from '../../components/UI';
import {
  CategoryTabs,
  ChatInput,
  PromptTemplates,
  ResponseView,
  SidebarHistory,
} from './components';
import { assistantStore, useAssistantStore } from './store/useAssistantStore';

export const Dashboard: React.FC = () => {
  const health = useAssistantStore((s) => s.health);
  const theme = useAssistantStore((s) => s.theme);
  const history = useAssistantStore((s) => s.history);
  const category = useAssistantStore((s) => s.category);
  const isLoading = useAssistantStore((s) => s.isLoading);
  const error = useAssistantStore((s) => s.error);

  useEffect(() => {
    assistantStore.loadHistory();
    assistantStore.loadHealth();

    const interval = setInterval(() => {
      assistantStore.loadHealth();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <Header
        health={health}
        theme={theme}
        onToggleTheme={() => assistantStore.toggleTheme()}
        onToggleHistory={() => assistantStore.toggleHistory()}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-content-container">
          <CategoryTabs />
          <PromptTemplates />
          <ChatInput />

          {error && (
            <ErrorBanner
              message={error}
              onRetry={() => assistantStore.retry()}
              onDismiss={() => assistantStore.dismissError()}
            />
          )}

          {isLoading && <SkeletonLoader category={category} />}
          <ResponseView />
        </div>
      </main>

      {/* Request History Drawer */}
      <SidebarHistory />
    </div>
  );
};
