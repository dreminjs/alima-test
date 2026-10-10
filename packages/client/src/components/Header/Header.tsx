import React from 'react';
import type { HealthStatus } from '../../types/assistant';
import { HeaderLogo } from './HeaderLogo';
import { HeaderHealth } from './HeaderHealth';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
  health: HealthStatus | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  theme,
  onToggleTheme,
  onToggleHistory,
  historyCount,
}) => {
  return (
    <header className="app-header">
      <HeaderLogo />
      <div className="header-right">
        <HeaderHealth health={health} />
        <HeaderActions
          theme={theme}
          onToggleTheme={onToggleTheme}
          onToggleHistory={onToggleHistory}
          historyCount={historyCount}
        />
      </div>
    </header>
  );
};
