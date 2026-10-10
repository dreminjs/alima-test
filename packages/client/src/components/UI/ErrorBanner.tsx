import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="error-banner animate-fade-in" role="alert">
      <div className="error-banner-icon">
        <AlertCircle size={20} className="text-rose" />
      </div>
      <div className="error-banner-content">
        <span className="error-banner-title">Ошибка при выполнении запроса</span>
        <p className="error-banner-message">{message}</p>
      </div>
      <div className="error-banner-actions">
        {onRetry && (
          <button onClick={onRetry} className="btn-error-retry">
            <RotateCcw size={14} />
            <span>Повторить</span>
          </button>
        )}
        <button onClick={onDismiss} className="btn-error-dismiss" aria-label="Закрыть">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
