import React from 'react';
import { History, Moon, Sun } from 'lucide-react';

interface HeaderActionsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  theme,
  onToggleTheme,
  onToggleHistory,
  historyCount,
}) => {
  return (
    <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <button
        onClick={onToggleHistory}
        className="btn-header-action"
        title="История запросов команды"
        aria-label="История"
      >
        <History size={17} />
        <span className="btn-label-desktop">История</span>
        {historyCount > 0 && <span className="history-badge">{historyCount}</span>}
      </button>

      <button
        onClick={onToggleTheme}
        className="btn-header-action btn-icon-only"
        title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        aria-label="Тема оформления"
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </div>
  );
};
