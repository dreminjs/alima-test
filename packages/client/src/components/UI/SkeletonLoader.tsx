import React from 'react';
import { Bot } from 'lucide-react';
import type { AssistantCategory } from '../../types/assistant';
import { CATEGORIES_CONFIG } from '../../config/categories';

interface SkeletonLoaderProps {
  category: AssistantCategory;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ category }) => {
  const config = CATEGORIES_CONFIG[category];

  return (
    <div className="skeleton-container animate-fade-in">
      <div className="skeleton-header">
        <div className="skeleton-status-pill">
          <Bot size={14} className="animate-spin text-primary" />
          <span>Генерация экспертного ответа ({config.shortLabel})...</span>
        </div>
        <div className="skeleton-shimmer-tag">AI Processing</div>
      </div>

      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-w-90"></div>
        <div className="skeleton-line skeleton-w-75"></div>
        <div className="skeleton-line skeleton-w-85"></div>

        <div className="skeleton-box"></div>

        <div className="skeleton-line skeleton-w-80"></div>
        <div className="skeleton-line skeleton-w-60"></div>
      </div>
    </div>
  );
};
