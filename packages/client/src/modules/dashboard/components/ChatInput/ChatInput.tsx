import React, { useEffect, useState } from 'react';
import { ContextDrawer } from './ContextDrawer';
import { InputToolbar } from './InputToolbar';
import { PromptTextarea } from './PromptTextarea';
import { assistantStore, useAssistantStore } from '../../store/useAssistantStore';

export const ChatInput: React.FC = () => {
  const context = useAssistantStore((s) => s.context);
  const [showContext, setShowContext] = useState(Boolean(context && context.trim()));

  useEffect(() => {
    if (context && context.trim()) {
      setShowContext(true);
    }
  }, [context]);

  const handleSubmit = () => {
    assistantStore.submitPrompt();
  };

  return (
    <div className="chat-input-container">
      {showContext && <ContextDrawer onClose={() => setShowContext(false)} />}

      <div className="main-input-box">
        <PromptTextarea onSubmit={handleSubmit} />
        <InputToolbar
          showContext={showContext}
          onToggleContext={() => setShowContext(!showContext)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
