import React from 'react';
import { Code2, Layers, MessageSquareText, Rocket, Sparkles } from 'lucide-react';
import type { AssistantCategory } from '../../../../types/assistant';
import { CATEGORIES_CONFIG } from '../../../../config/categories';

interface CategoryTabItemProps {
  category: AssistantCategory;
  isActive: boolean;
  onSelect: (category: AssistantCategory) => void;
}

export const CategoryTabItem: React.FC<CategoryTabItemProps> = ({
  category,
  isActive,
  onSelect,
}) => {
  const config = CATEGORIES_CONFIG[category];

  const getIcon = (cat: AssistantCategory) => {
    switch (cat) {
      case 'general':
        return <Sparkles size={16} />;
      case 'code_review':
        return <Code2 size={16} />;
      case 'decomposition':
        return <Layers size={16} />;
      case 'release_notes':
        return <Rocket size={16} />;
      case 'standup':
        return <MessageSquareText size={16} />;
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(category)}
      className={`category-tab-btn ${isActive ? 'active' : ''}`}
    >
      <span className="tab-icon">{getIcon(category)}</span>
      <span className="tab-label">{config.shortLabel}</span>
      {isActive && <span className="active-indicator"></span>}
    </button>
  );
};
