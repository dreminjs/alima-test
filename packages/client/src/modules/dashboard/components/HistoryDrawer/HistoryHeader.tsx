import React from 'react';
import { Database, X } from 'lucide-react';

interface HistoryHeaderProps {
  count: number;
  onClose: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ count, onClose }) => {
  return (
    <div className="sidebar-title-row">
      <div className="sidebar-title">
        <Database size={16} className="text-primary" />
        <span>История команды</span>
        <span className="sidebar-count-pill">{count}</span>
      </div>
      <button
        onClick={onClose}
        className="btn-icon-close"
        aria-label="Закрыть историю"
      >
        <X size={18} />
      </button>
    </div>
  );
};
