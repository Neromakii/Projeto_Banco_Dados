import { Module, Global, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = parseInt(process.env.REDIS_PORT || '6379', 10);
        const useMock = process.env.REDIS_MOCK === 'true';

        if (useMock || host === 'localhost') {
          Logger.log('Using ioredis-mock (in-memory Redis)', 'RedisModule');
          return new RedisMock();
        }

        return new Redis({ host, port });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
