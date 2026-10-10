import React from 'react';

interface QueryPreviewProps {
  prompt: string;
}

export const QueryPreview: React.FC<QueryPreviewProps> = ({ prompt }) => {
  if (!prompt) return null;

  return (
    <div className="query-preview-box">
      <span className="query-preview-label">Запрос команды:</span>
      <p className="query-preview-text">{prompt}</p>
    </div>
  );
};
