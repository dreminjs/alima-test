import React, { useState } from 'react';
import { Check, Copy, Download, RotateCcw } from 'lucide-react';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

interface ResponseActionsProps {
  responseContent: string;
  category: string;
  timestamp: number;
}

export const ResponseActions: React.FC<ResponseActionsProps> = ({
  responseContent,
  category,
  timestamp,
}) => {
  const [copied, setCopied] = useState(false);
  const isLoading = useAssistantStore((s) => s.isLoading);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `ai-response-${category}-${new Date(timestamp).toISOString().slice(0, 10)}.md`;
    const blob = new Blob([responseContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="response-meta-actions">
      <button
        onClick={() => assistantStore.retry()}
        disabled={isLoading}
        className="btn-response-action"
        title="Перегенерировать ответ"
      >
        <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
        <span>Повторить</span>
      </button>

      <button
        onClick={handleDownload}
        className="btn-response-action"
        title="Скачать ответ в формате Markdown"
      >
        <Download size={14} />
        <span>.MD</span>
      </button>

      <button
        onClick={handleCopy}
        className="btn-response-action btn-copy-primary"
        title="Скопировать весь ответ в буфер обмена"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald" />
            <span>Скопировано!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Копировать</span>
          </>
        )}
      </button>
    </div>
  );
};
