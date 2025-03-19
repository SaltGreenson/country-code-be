import { CACHE_TTL_EXCHANGE_RATE } from '@/core/constants';
import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get } from '@nestjs/common';
import { CurrencyGetService } from './currency-get.service';

@Controller('/currency')
@CacheTTL(CACHE_TTL_EXCHANGE_RATE)
export class CurrencyController {
  constructor(private readonly currencyGetService: CurrencyGetService) {}

  @Get('/many')
  async getMany() {
    return this.currencyGetService.many();
  }
}
