import React from 'react';
import { Bot } from 'lucide-react';

export const HeaderLogo: React.FC = () => {
  return (
    <div className="header-left">
      <div className="logo-badge">
        <Bot size={22} className="logo-icon" />
        <span className="logo-glow"></span>
      </div>
      <div>
        <div className="logo-title-row">
          <h1 className="logo-title">Team AI Assistant</h1>
          <span className="badge-tech">Engineering Hub</span>
        </div>
        <p className="logo-subtitle">Командный ассистент для декомпозиции, ревью и синхронизации</p>
      </div>
    </div>
  );
};
