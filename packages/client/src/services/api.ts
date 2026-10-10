import type { AssistantCategory, AssistantResponse, HealthStatus, HistoryItem } from '../types/assistant';

const API_BASE = '/api/assistant';

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function askAssistant(
  prompt: string,
  category: AssistantCategory = 'general',
  context?: string
): Promise<AssistantResponse> {
  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        category,
        context: context?.trim() || undefined,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка сервера (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;
        }
      } catch {
        // fallback to status code
      }

      if (response.status === 429) {
        errorMessage = 'Превышен лимит запросов к AI (Rate Limit). Пожалуйста, подождите минуту.';
      } else if (response.status === 504) {
        errorMessage = 'Превышено время ожидания ответа AI (Timeout). Попробуйте повторить запрос.';
      } else if (response.status === 502) {
        errorMessage = `AI-сервис временно недоступен: ${errorMessage}`;
      }

      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
      throw new ApiError('Не удалось подключиться к бэкенду. Проверьте, что сервер NestJS запущен на порту 3000.', 0);
    }
    throw new ApiError((error as Error).message || 'Неизвестная ошибка при запросе к AI', 500);
  }
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch {
    return [];
  }
}

export async function clearHistoryApi(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchHealth(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
