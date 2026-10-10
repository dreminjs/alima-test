import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface HistoryFooterProps {
  onClear: () => void;
}

export const HistoryFooter: React.FC<HistoryFooterProps> = ({ onClear }) => {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="sidebar-footer">
      {confirmClear ? (
        <div className="confirm-clear-row">
          <span className="confirm-text">Удалить всю историю?</span>
          <button
            onClick={() => {
              onClear();
              setConfirmClear(false);
            }}
            className="btn-confirm-delete"
          >
            Да, очистить
          </button>
          <button
            onClick={() => setConfirmClear(false)}
            className="btn-cancel-delete"
          >
            Отмена
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmClear(true)}
          className="btn-clear-history"
        >
          <Trash2 size={14} />
          <span>Очистить историю из Redis</span>
        </button>
      )}
    </div>
  );
};
