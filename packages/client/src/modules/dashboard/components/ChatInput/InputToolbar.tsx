import React from 'react';
import { ChevronDown, ChevronUp, Code2, CornerDownLeft, Eraser, Send } from 'lucide-react';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

interface InputToolbarProps {
  showContext: boolean;
  onToggleContext: () => void;
  onSubmit: () => void;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  showContext,
  onToggleContext,
  onSubmit,
}) => {
  const prompt = useAssistantStore((s) => s.prompt);
  const context = useAssistantStore((s) => s.context);
  const isLoading = useAssistantStore((s) => s.isLoading);

  const hasContent = Boolean(prompt.trim() || context.trim());

  return (
    <div className="input-toolbar">
      <div className="toolbar-left">
        <button
          type="button"
          onClick={onToggleContext}
          className={`btn-toolbar-toggle ${showContext ? 'active' : ''}`}
          title="Добавить контекст, код или схему к запросу"
        >
          <Code2 size={14} />
          <span>{showContext ? 'Скрыть контекст' : '+ Добавить контекст / код'}</span>
          {showContext ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {hasContent && (
          <button
            type="button"
            onClick={() => assistantStore.clearInput()}
            className="btn-toolbar-clear"
            title="Очистить поля"
            disabled={isLoading}
          >
            <Eraser size={14} />
            <span>Очистить</span>
          </button>
        )}
      </div>

      <div className="toolbar-right">
        <span className="shortcut-hint">
          <CornerDownLeft size={12} />
          <span>Ctrl + Enter</span>
        </span>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="btn-submit"
        >
          {isLoading ? (
            <>
              <span className="spinner-dot"></span>
              <span>Генерация...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Отправить</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
