import React from 'react';
import { Sparkles } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../../../../config/categories';
import { PromptTemplateCard } from './PromptTemplateCard';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

export const PromptTemplates: React.FC = () => {
  const category = useAssistantStore((s) => s.category);
  const config = CATEGORIES_CONFIG[category];
  const quickPrompts = config.quickPrompts;

  if (!quickPrompts || quickPrompts.length === 0) return null;

  const handleSelect = (prompt: string, context?: string) => {
    assistantStore.setPrompt(prompt);
    if (context) {
      assistantStore.setContext(context);
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="prompt-templates-section">
      <div className="prompt-templates-header">
        <Sparkles size={14} className="text-primary" />
        <span>Быстрые шаблоны для {config.shortLabel}:</span>
      </div>
      <div className="prompt-templates-grid">
        {quickPrompts.map((item, idx) => (
          <PromptTemplateCard
            key={idx}
            title={item.title}
            snippet={item.prompt}
            onClick={() => handleSelect(item.prompt, item.context)}
          />
        ))}
      </div>
    </div>
  );
};
