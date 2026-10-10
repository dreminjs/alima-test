import React from 'react';
import { Code2 } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../../../../config/categories';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

interface ContextDrawerProps {
  onClose: () => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({ onClose }) => {
  const context = useAssistantStore((s) => s.context);
  const category = useAssistantStore((s) => s.category);
  const isLoading = useAssistantStore((s) => s.isLoading);
  const config = CATEGORIES_CONFIG[category];

  return (
    <div className="context-drawer animate-fade-in">
      <div className="context-drawer-header">
        <div className="context-drawer-title">
          <Code2 size={14} className="text-accent-cyan" />
          <span>Дополнительный контекст / фрагмент кода</span>
        </div>
        <button
          onClick={onClose}
          className="btn-text-subtle"
          type="button"
        >
          Свернуть
        </button>
      </div>
      <textarea
        value={context}
        onChange={(e) => assistantStore.setContext(e.target.value)}
        placeholder={config.contextPlaceholder}
        className="context-textarea"
        rows={4}
        disabled={isLoading}
      />
    </div>
  );
};
