import React, { useEffect, useRef } from 'react';
import { CATEGORIES_CONFIG } from '../../../../config/categories';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

interface PromptTextareaProps {
  onSubmit: () => void;
}

export const PromptTextarea: React.FC<PromptTextareaProps> = ({ onSubmit }) => {
  const prompt = useAssistantStore((s) => s.prompt);
  const category = useAssistantStore((s) => s.category);
  const isLoading = useAssistantStore((s) => s.isLoading);
  const config = CATEGORIES_CONFIG[category];

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 72), 260);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={prompt}
      onChange={(e) => assistantStore.setPrompt(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={config.placeholder}
      className="prompt-textarea"
      disabled={isLoading}
      rows={2}
    />
  );
};
