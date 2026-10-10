import React from 'react';
import { Search } from 'lucide-react';

interface HistorySearchProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
}

export const HistorySearch: React.FC<HistorySearchProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="sidebar-search-box">
      <Search size={14} className="search-icon" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по истории..."
        className="sidebar-search-input"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="btn-clear-search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
