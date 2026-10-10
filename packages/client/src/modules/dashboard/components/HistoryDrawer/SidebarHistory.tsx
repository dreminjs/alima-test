import React, { useState } from 'react';
import type { HistoryItem } from '../../../../types/assistant';
import { HistoryHeader } from './HistoryHeader';
import { HistorySearch } from './HistorySearch';
import { HistoryFilterPills } from './HistoryFilterPills';
import { HistoryCardItem } from './HistoryCardItem';
import { HistoryEmptyState } from './HistoryEmptyState';
import { HistoryFooter } from './HistoryFooter';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

export const SidebarHistory: React.FC = () => {
  const isOpen = useAssistantStore((s) => s.isHistoryOpen);
  const history = useAssistantStore((s) => s.history);
  const selectedId = useAssistantStore((s) => s.selectedHistoryId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelect = (item: HistoryItem) => {
    assistantStore.selectHistoryItem(item);
  };

  const handleClose = () => {
    assistantStore.toggleHistory(false);
  };

  const handleClear = () => {
    assistantStore.clearHistory();
  };

  return (
    <>
      <div className="sidebar-backdrop" onClick={handleClose}></div>
      <aside className="sidebar-drawer animate-fade-in">
        <div className="sidebar-header">
          <HistoryHeader count={history.length} onClose={handleClose} />
          <HistorySearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={() => setSearchTerm('')}
          />
          <HistoryFilterPills
            filterCategory={filterCategory}
            onSelectCategory={setFilterCategory}
          />
        </div>

        <div className="sidebar-items-list">
          {filteredHistory.length === 0 ? (
            <HistoryEmptyState isSearch={Boolean(searchTerm)} />
          ) : (
            filteredHistory.map((item) => (
              <HistoryCardItem
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>

        {history.length > 0 && <HistoryFooter onClear={handleClear} />}
      </aside>
    </>
  );
};
