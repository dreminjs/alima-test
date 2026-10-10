export type AssistantCategory =
  | 'general'
  | 'code_review'
  | 'decomposition'
  | 'release_notes'
  | 'standup';

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  category: AssistantCategory;
  timestamp: number;
  durationMs: number;
  model: string;
}

export interface AssistantResponse {
  id: string;
  response: string;
  category: AssistantCategory;
  model: string;
  durationMs: number;
  timestamp: number;
  redisStored: boolean;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    redis: {
      status: 'connected' | 'disconnected_fallback' | string;
      url: string;
    };
    gemini: {
      status: 'configured' | 'missing_api_key' | string;
      model: string;
      proxyConfigured: boolean;
    };
  };
}

export interface CategoryMeta {
  id: AssistantCategory;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  placeholder: string;
  contextPlaceholder: string;
  quickPrompts: { title: string; prompt: string; context?: string }[];
}
