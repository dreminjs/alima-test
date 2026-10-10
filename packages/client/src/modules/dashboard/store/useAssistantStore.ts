import { create } from 'zustand';
import type {
  AssistantCategory,
  AssistantResponse,
  HealthStatus,
  HistoryItem,
} from '../../../types/assistant';
import {
  askAssistant,
  clearHistoryApi,
  fetchHealth,
  fetchHistory,
} from '../../../services/api';

export interface AssistantState {
  prompt: string;
  context: string;
  category: AssistantCategory;
  currentResponse: AssistantResponse | null;
  activePromptLabel: string;
  isLoading: boolean;
  error: string | null;
  lastPayload: {
    prompt: string;
    category: AssistantCategory;
    context: string;
  } | null;
  history: HistoryItem[];
  isHistoryOpen: boolean;
  selectedHistoryId: string | null;
  health: HealthStatus | null;
  theme: 'dark' | 'light';
}

export interface AssistantActions {
  setPrompt: (prompt: string) => void;
  setContext: (context: string) => void;
  setCategory: (category: AssistantCategory) => void;
  clearInput: () => void;
  toggleHistory: (open?: boolean) => void;
  toggleTheme: () => void;
  dismissError: () => void;
  loadHistory: () => Promise<void>;
  loadHealth: () => Promise<void>;
  selectHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => Promise<void>;
  submitPrompt: (customPrompt?: string, customContext?: string) => Promise<void>;
  retry: () => void;
}

export type AssistantStore = AssistantState & AssistantActions;

const getInitialTheme = (): 'dark' | 'light' => {
  const savedTheme = (typeof window !== 'undefined'
    ? (localStorage.getItem('team_ai_theme') as 'dark' | 'light' | null)
    : null) || 'dark';
    
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  return savedTheme;
};

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  prompt: '',
  context: '',
  category: 'general',
  currentResponse: null,
  activePromptLabel: '',
  isLoading: false,
  error: null,
  lastPayload: null,
  history: [],
  isHistoryOpen: false,
  selectedHistoryId: null,
  health: null,
  theme: getInitialTheme(),

  setPrompt: (prompt) => set({ prompt }),
  
  setContext: (context) => set({ context }),
  
  setCategory: (category) => set({ category }),
  
  clearInput: () => set({ prompt: '', context: '', error: null }),
  
  toggleHistory: (open) => set((state) => ({
    isHistoryOpen: open !== undefined ? open : !state.isHistoryOpen,
  })),
  
  toggleTheme: () => {
    const state = get();
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('team_ai_theme', nextTheme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
    set({ theme: nextTheme });
  },
  
  dismissError: () => set({ error: null }),
  
  loadHistory: async () => {
    const history = await fetchHistory();
    set({ history });
  },
  
  loadHealth: async () => {
    const health = await fetchHealth();
    set({ health });
  },
  
  selectHistoryItem: (item) => set({
    selectedHistoryId: item.id,
    category: item.category,
    activePromptLabel: item.prompt,
    currentResponse: {
      id: item.id,
      response: item.response,
      category: item.category,
      model: item.model,
      durationMs: item.durationMs,
      timestamp: item.timestamp,
      redisStored: true,
    },
    error: null,
    isHistoryOpen: false,
  }),
  
  clearHistory: async () => {
    const success = await clearHistoryApi();
    if (success) {
      set({
        history: [],
        selectedHistoryId: null,
      });
    }
  },
  
  submitPrompt: async (customPrompt?: string, customContext?: string) => {
    const state = get();
    const promptToSend = (customPrompt ?? state.prompt).trim();
    const contextToSend = (customContext ?? state.context).trim();

    if (!promptToSend) return;

    const payload = {
      prompt: promptToSend,
      category: state.category,
      context: contextToSend,
    };

    set({
      error: null,
      isLoading: true,
      selectedHistoryId: null,
      activePromptLabel: promptToSend,
      lastPayload: payload,
    });

    try {
      const result = await askAssistant(payload.prompt, payload.category, payload.context);
      set({
        currentResponse: result,
        isLoading: false,
      });
      get().loadHistory();
    } catch (err) {
      set({
        error: (err as Error).message || 'Не удалось получить ответ от AI-сервиса',
        isLoading: false,
      });
    }
  },
  
  retry: () => {
    const state = get();
    if (state.lastPayload) {
      get().submitPrompt(state.lastPayload.prompt, state.lastPayload.context);
    }
  },
}));

// Export a constant object to match the previous class instance API
// where components were doing `assistantStore.setPrompt(...)`
export const assistantStore = useAssistantStore.getState();
