import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async addToSet(key: string, value: string) {
    return this.client.sadd(key, value);
  }

  async removeFromSet(key: string, value: string) {
    return this.client.srem(key, value);
  }

  async getSetMembers(key: string) {
    return this.client.smembers(key);
  }

  async setHash(key: string, field: string, value: string) {
    return this.client.hset(key, field, value);
  }

  async getHash(key: string, field: string) {
    return this.client.hget(key, field);
  }

  async getAllHash(key: string) {
    return this.client.hgetall(key);
  }

  async deleteFromHash(key: string, field: string) {
    return this.client.hdel(key, field);
  }

  async setExpiry(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
