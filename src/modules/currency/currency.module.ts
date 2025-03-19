import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CurrencyGetService } from './currency-get.service';
import { CurrencyController } from './currency.controller';
import { ExchangeRateService } from './third-party/exchange-rate.service';

@Module({
  imports: [HttpModule],
  providers: [CurrencyGetService, ExchangeRateService],
  controllers: [CurrencyController],
  exports: [CurrencyGetService],
})
export class CurrencyModule {}
