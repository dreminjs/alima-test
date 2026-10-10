import React from 'react';
import { Server, Zap } from 'lucide-react';
import type { HealthStatus } from '../../types/assistant';

interface HeaderHealthProps {
  health: HealthStatus | null;
}

export const HeaderHealth: React.FC<HeaderHealthProps> = ({ health }) => {
  const isRedisConnected = health?.services?.redis?.status === 'connected';
  const isGeminiReady = health?.services?.gemini?.status === 'configured';
  const isProxyActive = health?.services?.gemini?.proxyConfigured;

  return (
    <div className="health-indicators">
      <div
        className={`health-pill ${isRedisConnected ? 'status-ok' : 'status-warning'}`}
        title={isRedisConnected ? 'Redis: Подключен (Кэш и история активны)' : 'Redis: Оффлайн (Fallback режим)'}
      >
        <Server size={13} />
        <span>Redis</span>
        <span className="status-dot"></span>
      </div>

      <div
        className={`health-pill ${isGeminiReady ? 'status-ok' : 'status-danger'}`}
        title={`Gemini API: ${isGeminiReady ? 'Ключ активен' : 'Ключ отсутствует'}`}
      >
        <Zap size={13} />
        <span>{health?.services?.gemini?.model || 'Gemini'}</span>
        {isProxyActive && <span className="proxy-tag" title="Локальный прокси активен">Proxy</span>}
        <span className="status-dot"></span>
      </div>
    </div>
  );
};
