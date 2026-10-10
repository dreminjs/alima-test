import React from 'react';
import { Sparkles } from 'lucide-react';
import type { AssistantResponse } from '../../../../types/assistant';
import { CATEGORIES_CONFIG } from '../../../../config/categories';
import { ResponseMetadata } from './ResponseMetadata';
import { ResponseActions } from './ResponseActions';

interface ResponseHeaderProps {
  data: AssistantResponse;
}

export const ResponseHeader: React.FC<ResponseHeaderProps> = ({ data }) => {
  const config = CATEGORIES_CONFIG[data.category || 'general'];

  return (
    <div className="response-card-header">
      <div className="response-meta-left">
        <span className="category-badge">
          <Sparkles size={12} />
          <span>{config.label}</span>
        </span>

        <ResponseMetadata
          durationMs={data.durationMs}
          model={data.model}
          redisStored={data.redisStored}
        />
      </div>

      <ResponseActions
        responseContent={data.response}
        category={data.category}
        timestamp={data.timestamp}
      />
    </div>
  );
};
