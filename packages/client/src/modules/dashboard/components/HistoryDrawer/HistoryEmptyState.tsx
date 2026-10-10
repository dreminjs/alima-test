import React from 'react';

interface HistoryEmptyStateProps {
  isSearch: boolean;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({ isSearch }) => {
  return (
    <div className="sidebar-empty-state">
      <p className="empty-title">История пуста</p>
      <p className="empty-subtitle">
        {isSearch
          ? 'По вашему запросу ничего не найдено'
          : 'Запросы команды будут сохраняться здесь через Redis'}
      </p>
    </div>
  );
};
