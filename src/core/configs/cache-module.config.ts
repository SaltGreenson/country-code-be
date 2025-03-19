import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig } from '../interfaces';

export const CACHE_MODULE_CONFIG: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<IConfig, true>) => ({
    ttl: configService.get<number>('CACHE_TTL'),
  }),
};
