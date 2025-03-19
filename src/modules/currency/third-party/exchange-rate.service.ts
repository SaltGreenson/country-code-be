import { IConfig } from '@/core/interfaces';
import { HttpRepository } from '@/core/repositories';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IExchangeRateReq, IExchangeRateRes } from './interfaces/IExchange';

@Injectable()
export class ExchangeRateService extends HttpRepository {
  constructor(
    private readonly httpService: HttpService,
    protected readonly configService: ConfigService<IConfig, true>,
  ) {
    super(httpService, configService);
  }

  protected getBaseOptions(): { API_URL: string } {
    const API_URL = this.configService.get<string>('COUNTRY_PHONE_API_URL');

    return { API_URL };
  }

  async fetchCurrency({ code }: IExchangeRateReq) {
    const { data } = await this.get<IExchangeRateRes>({ path: `/${code}` });

    if (data.result !== 'success') {
      throw new BadRequestException('Unknown fetch error');
    }

    return data;
  }
}
