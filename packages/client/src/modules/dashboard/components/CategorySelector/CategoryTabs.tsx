import React from 'react';
import type { AssistantCategory } from '../../../../types/assistant';
import { CATEGORIES_CONFIG } from '../../../../config/categories';
import { CategoryTabItem } from './CategoryTabItem';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

export const CategoryTabs: React.FC = () => {
  const selected = useAssistantStore((s) => s.category);

  const categories: AssistantCategory[] = [
    'general',
    'code_review',
    'decomposition',
    'release_notes',
    'standup',
  ];

  return (
    <div className="category-tabs-container">
      <div className="category-tabs-list" role="tablist">
        {categories.map((cat) => (
          <CategoryTabItem
            key={cat}
            category={cat}
            isActive={selected === cat}
            onSelect={(c) => assistantStore.setCategory(c)}
          />
        ))}
      </div>
      <div className="category-meta-description">
        <p>{CATEGORIES_CONFIG[selected].description}</p>
      </div>
    </div>
  );
};
