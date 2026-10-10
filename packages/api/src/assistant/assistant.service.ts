import {
  BadRequestException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProxyAgent, request } from 'undici';
import { ASSISTANT_SYSTEM_PROMPTS, AssistantCategory } from './assistant.prompts';
import { AskAssistantDto } from './dto/ask-assistant.dto';
import { HistoryItem, RedisService } from '../redis/redis.service';

export interface AssistantResponse {
  id: string;
  response: string;
  category: AssistantCategory;
  model: string;
  durationMs: number;
  timestamp: number;
  redisStored: boolean;
}

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly proxyAgent: ProxyAgent | null = null;

  constructor(private readonly redisService: RedisService) {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if (proxyUrl) {
      try {
        this.proxyAgent = new ProxyAgent(proxyUrl);
        this.logger.log(`Initialized ProxyAgent for Gemini API with proxy: ${proxyUrl}`);
      } catch (e) {
        this.logger.warn(`Failed to initialize ProxyAgent: ${(e as Error).message}`);
      }
    }
  }

  async ask(dto: AskAssistantDto): Promise<AssistantResponse> {
    const prompt = dto.prompt?.trim();
    if (!prompt) {
      throw new BadRequestException('Запрос не может быть пустым');
    }

    if (!this.apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY не настроен на сервере. Проверьте файл .env',
      );
    }

    const category: AssistantCategory = dto.category || 'general';
    const systemPrompt = ASSISTANT_SYSTEM_PROMPTS[category] || ASSISTANT_SYSTEM_PROMPTS.general;

    let userContent = prompt;
    if (dto.context && dto.context.trim()) {
      userContent = `[КОНТЕКСТ / ИСХОДНЫЙ КОД]:\n${dto.context.trim()}\n\n[ЗАДАЧА / ВОПРОС]:\n${prompt}`;
    }

    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const { text: generatedText, usedModel } = await this.callGeminiApi(systemPrompt, userContent);
      const durationMs = Date.now() - startTime;

      const historyItem: HistoryItem = {
        id: requestId,
        prompt: dto.prompt,
        response: generatedText,
        category,
        timestamp: Date.now(),
        durationMs,
        model: usedModel,
      };

      // Save to Redis asynchronously without blocking if Redis fails
      let redisStored = false;
      try {
        await this.redisService.saveQuery(historyItem);
        redisStored = this.redisService.getIsConnected();
      } catch (err) {
        this.logger.warn(`Failed to store query in Redis: ${(err as Error).message}`);
      }

      return {
        id: requestId,
        response: generatedText,
        category,
        model: usedModel,
        durationMs,
        timestamp: historyItem.timestamp,
        redisStored,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      this.logger.error(`Gemini request failed after ${durationMs}ms: ${(error as Error).message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: `Ошибка при обращении к AI-модели: ${(error as Error).message}`,
          error: 'Bad Gateway',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async callGeminiApi(
    systemPrompt: string,
    userContent: string,
  ): Promise<{ text: string; usedModel: string }> {
    const candidateModels = Array.from(
      new Set([this.modelName, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.7-flash']),
    );

    let lastError: Error | null = null;

    for (const modelToTry of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${this.apiKey}`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userContent }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      try {
        const response = await request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          dispatcher: this.proxyAgent || undefined,
          signal: controller.signal,
        });

        const responseBody = await response.body.text();

        if (response.statusCode >= 400) {
          let parsedError = responseBody;
          try {
            const jsonErr = JSON.parse(responseBody);
            parsedError = jsonErr.error?.message || responseBody;
          } catch {
            // keep raw body
          }

          if (response.statusCode === 503 || response.statusCode === 429) {
            this.logger.warn(
              `Model ${modelToTry} returned ${response.statusCode}: ${parsedError}. Trying next fallback candidate...`,
            );
            lastError = new HttpException(
              `Модель ${modelToTry} временно перегружена: ${parsedError}`,
              HttpStatus.TOO_MANY_REQUESTS,
            );
            continue;
          }

          if (response.statusCode === 403 || response.statusCode === 401) {
            throw new HttpException(
              `Ошибка авторизации Gemini API (${response.statusCode}): ${parsedError}`,
              HttpStatus.UNAUTHORIZED,
            );
          }

          throw new HttpException(
            `Gemini API returned error (${response.statusCode}): ${parsedError}`,
            HttpStatus.BAD_GATEWAY,
          );
        }

        const parsed = JSON.parse(responseBody);
        const text =
          parsed.candidates?.[0]?.content?.parts?.[0]?.text ||
          parsed.candidates?.[0]?.finishReason ||
          '';

        if (!text) {
          throw new HttpException(
            'Модель вернула пустой ответ. Попробуйте переформулировать запрос.',
            HttpStatus.NO_CONTENT,
          );
        }

        return { text, usedModel: modelToTry };
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          throw new GatewayTimeoutException(
            'Превышено время ожидания ответа от AI-модели (таймаут 25с). Проверьте сеть или повторите попытку.',
          );
        }
        lastError = err as Error;
      } finally {
        clearTimeout(timeout);
      }
    }

    throw (
      lastError ||
      new HttpException(
        'Все AI-модели временно недоступны. Повторите попытку через несколько секунд.',
        HttpStatus.BAD_GATEWAY,
      )
    );
  }

  async getHistory(): Promise<HistoryItem[]> {
    return this.redisService.getRecentQueries();
  }

  async clearHistory(): Promise<{ success: boolean }> {
    await this.redisService.clearHistory();
    return { success: true };
  }

  async getHealth() {
    const redisHealthy = await this.redisService.ping();
    const apiKeyConfigured = Boolean(this.apiKey && this.apiKey.length > 5);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        redis: {
          status: redisHealthy ? 'connected' : 'disconnected_fallback',
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
        gemini: {
          status: apiKeyConfigured ? 'configured' : 'missing_api_key',
          model: this.modelName,
          proxyConfigured: Boolean(this.proxyAgent),
        },
      },
    };
  }
}
