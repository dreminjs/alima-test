import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PromptTemplateCardProps {
  title: string;
  snippet: string;
  onClick: () => void;
}

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({
  title,
  snippet,
  onClick,
}) => {
  return (
    <button className="prompt-template-card" onClick={onClick}>
      <div className="template-card-top">
        <span className="template-card-title">{title}</span>
        <ArrowUpRight size={14} className="template-card-arrow" />
      </div>
      <p className="template-card-snippet">{snippet}</p>
    </button>
  );
};
