import { useSyncExternalStore } from 'react';
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

type Listener = () => void;

class AssistantStore {
  private state: AssistantState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const savedTheme = (typeof window !== 'undefined'
      ? (localStorage.getItem('team_ai_theme') as 'dark' | 'light' | null)
      : null) || 'dark';

    this.state = {
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
      theme: savedTheme,
    };

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  public getState = (): AssistantState => {
    return this.state;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private setState(partial: Partial<AssistantState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }

  // Actions
  public setPrompt = (prompt: string) => {
    this.setState({ prompt });
  };

  public setContext = (context: string) => {
    this.setState({ context });
  };

  public setCategory = (category: AssistantCategory) => {
    this.setState({ category });
  };

  public clearInput = () => {
    this.setState({ prompt: '', context: '', error: null });
  };

  public toggleHistory = (open?: boolean) => {
    this.setState({
      isHistoryOpen: open !== undefined ? open : !this.state.isHistoryOpen,
    });
  };

  public toggleTheme = () => {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('team_ai_theme', nextTheme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
    this.setState({ theme: nextTheme });
  };

  public dismissError = () => {
    this.setState({ error: null });
  };

  public loadHistory = async () => {
    const history = await fetchHistory();
    this.setState({ history });
  };

  public loadHealth = async () => {
    const health = await fetchHealth();
    this.setState({ health });
  };

  public selectHistoryItem = (item: HistoryItem) => {
    this.setState({
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
    });
  };

  public clearHistory = async () => {
    const success = await clearHistoryApi();
    if (success) {
      this.setState({
        history: [],
        selectedHistoryId: null,
      });
    } 11
  };

  public submitPrompt = async (customPrompt?: string, customContext?: string) => {
    const promptToSend = (customPrompt ?? this.state.prompt).trim();
    const contextToSend = (customContext ?? this.state.context).trim();

    if (!promptToSend) return;

    const payload = {
      prompt: promptToSend,
      category: this.state.category,
      context: contextToSend,
    };

    this.setState({
      error: null,
      isLoading: true,
      selectedHistoryId: null,
      activePromptLabel: promptToSend,
      lastPayload: payload,
    });

    try {
      const result = await askAssistant(payload.prompt, payload.category, payload.context);
      this.setState({
        currentResponse: result,
        isLoading: false,
      });
      await this.loadHistory();
    } catch (err) {
      this.setState({
        error: (err as Error).message || 'Не удалось получить ответ от AI-сервиса',
        isLoading: false,
      });
    }
  };

  public retry = () => {
    if (this.state.lastPayload) {
      this.submitPrompt(this.state.lastPayload.prompt, this.state.lastPayload.context);
    }
  };
}

export const assistantStore = new AssistantStore();

export function useAssistantStore<T>(selector: (state: AssistantState) => T): T {
  return useSyncExternalStore(
    assistantStore.subscribe,
    () => selector(assistantStore.getState()),
    () => selector(assistantStore.getState())
  );
}
