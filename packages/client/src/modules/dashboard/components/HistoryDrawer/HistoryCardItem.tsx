import React from 'react';
import { Clock, Code2, Layers, MessageSquareText, Rocket, Sparkles } from 'lucide-react';
import type { AssistantCategory, HistoryItem } from '../../../../types/assistant';
import { CATEGORIES_CONFIG } from '../../../../config/categories';

interface HistoryCardItemProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: (item: HistoryItem) => void;
}

export const HistoryCardItem: React.FC<HistoryCardItemProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const config = CATEGORIES_CONFIG[item.category || 'general'];

  const getIcon = (cat: AssistantCategory) => {
    switch (cat) {
      case 'code_review':
        return <Code2 size={13} />;
      case 'decomposition':
        return <Layers size={13} />;
      case 'release_notes':
        return <Rocket size={13} />;
      case 'standup':
        return <MessageSquareText size={13} />;
      default:
        return <Sparkles size={13} />;
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'только что';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} мин назад`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    return new Date(timestamp).toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`history-card-item ${isSelected ? 'selected' : ''}`}
    >
      <div className="history-card-top">
        <span className="history-cat-badge">
          {getIcon(item.category)}
          <span>{config.shortLabel}</span>
        </span>
        <span className="history-time-badge">
          <Clock size={11} />
          <span>{formatRelativeTime(item.timestamp)}</span>
        </span>
      </div>
      <p className="history-card-prompt">{item.prompt}</p>
      <div className="history-card-meta">
        <span>{(item.durationMs / 1000).toFixed(1)}с</span>
        <span>•</span>
        <span>{item.model}</span>
      </div>
    </div>
  );
};
