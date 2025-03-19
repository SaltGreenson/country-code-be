import { IConfig } from '@/core/interfaces';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeRateService } from './third-party/exchange-rate.service';

@Injectable()
export class CurrencyGetService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly exchangeRateApi: ExchangeRateService,
    private readonly configService: ConfigService<IConfig, true>,
  ) {}

  async many() {
    return this.exchangeRateApi.fetchCurrency({ code: 'USD' });
  }
}
