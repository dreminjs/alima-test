import React from 'react';
import { MarkdownRenderer } from '../../../../components/Markdown';
import { ResponseHeader } from './ResponseHeader';
import { QueryPreview } from './QueryPreview';
import { useAssistantStore } from '../../store/useAssistantStore';

export const ResponseView: React.FC = () => {
  const currentResponse = useAssistantStore((s) => s.currentResponse);
  const activePromptLabel = useAssistantStore((s) => s.activePromptLabel);

  if (!currentResponse) return null;

  const formattedTime = new Date(currentResponse.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="response-card animate-fade-in">
      <ResponseHeader data={currentResponse} />
      <QueryPreview prompt={activePromptLabel} />

      <div className="response-card-body">
        <MarkdownRenderer content={currentResponse.response} />
      </div>

      <div className="response-card-footer">
        <span>Сгенерировано в {formattedTime}</span>
        <span>ID: {currentResponse.id}</span>
      </div>
    </div>
  );
};
