import React from 'react';
import type { AssistantCategory } from '../../../../types/assistant';
import { CATEGORIES_CONFIG } from '../../../../config/categories';

interface HistoryFilterPillsProps {
  filterCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const HistoryFilterPills: React.FC<HistoryFilterPillsProps> = ({
  filterCategory,
  onSelectCategory,
}) => {
  const categories: AssistantCategory[] = [
    'code_review',
    'decomposition',
    'release_notes',
    'standup',
    'general',
  ];

  return (
    <div className="sidebar-category-pills">
      <button
        onClick={() => onSelectCategory('all')}
        className={`filter-pill ${filterCategory === 'all' ? 'active' : ''}`}
      >
        Все
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
        >
          {CATEGORIES_CONFIG[cat].shortLabel}
        </button>
      ))}
    </div>
  );
};
