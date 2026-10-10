import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  category: string;
  timestamp: number;
  durationMs: number;
  model: string;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  private readonly historyKey = 'assistant:query_history';
  private readonly ttlSeconds: number;
  private readonly maxMessages: number;

  constructor() {
    this.ttlSeconds = parseInt(process.env.AI_CONTEXT_TTL || '3600', 10);
    this.maxMessages = parseInt(
      process.env.AI_CONTEXT_MAX_MESSAGES || '20',
      10,
    );
  }

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => {
          if (times > 5) {
            this.logger.warn(
              'Redis reconnection stopped after 5 attempts. Operating in fallback mode.',
            );
            return null;
          }
          return Math.min(times * 300, 2000);
        },
        maxRetriesPerRequest: 2,
        connectTimeout: 4000,
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis at ${redisUrl}`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection warning: ${err.message}`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        `Failed to connect to Redis initially: ${(error as Error).message}. Fallback mode active.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit().catch(() => {});
    }
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  async ping(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      const res = await this.client.ping();
      return res === 'PONG';
    } catch {
      return false;
    }
  }

  async saveQuery(item: HistoryItem): Promise<void> {
    if (!this.client || !this.isConnected) {
      this.logger.warn('Redis not available, query not persisted to Redis.');
      return;
    }

    try {
      const serialized = JSON.stringify(item);
      const pipeline = this.client.pipeline();
      // Add to front of history list
      pipeline.lpush(this.historyKey, serialized);
      // Trim to max allowed messages
      pipeline.ltrim(this.historyKey, 0, this.maxMessages - 1);
      // Refresh TTL
      pipeline.expire(this.historyKey, this.ttlSeconds);
      await pipeline.exec();
    } catch (err) {
      this.logger.error(
        `Error saving query to Redis: ${(err as Error).message}`,
      );
    }
  }

  async getRecentQueries(): Promise<HistoryItem[]> {
    if (!this.client || !this.isConnected) {
      return [];
    }

    try {
      const rawList = await this.client.lrange(
        this.historyKey,
        0,
        this.maxMessages - 1,
      );
      return rawList
        .map((str) => {
          try {
            return JSON.parse(str) as HistoryItem;
          } catch {
            return null;
          }
        })
        .filter((item): item is HistoryItem => item !== null);
    } catch (err) {
      this.logger.error(
        `Error fetching history from Redis: ${(err as Error).message}`,
      );
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.del(this.historyKey);
    } catch (err) {
      this.logger.error(`Error clearing history: ${(err as Error).message}`);
    }
  }
}
