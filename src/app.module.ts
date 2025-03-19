import { CACHE_MODULE_CONFIG, CONFIG_MODULE_CONFIG } from '@/core/configs';
import { LoggingMiddleware } from '@/core/middlewares';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CurrencyModule } from './modules';
@Module({
  imports: [
    ConfigModule.forRoot(CONFIG_MODULE_CONFIG),
    CacheModule.registerAsync(CACHE_MODULE_CONFIG),
    CurrencyModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
