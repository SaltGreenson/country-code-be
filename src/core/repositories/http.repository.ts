import { HttpService as NestHttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AxiosError,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  Observable,
  catchError,
  lastValueFrom,
  map,
  retry,
  throwError,
  timer,
} from 'rxjs';

import { IConfig } from '../interfaces';
import { IBaseRequest } from './interfaces/IBaseRequest';

export abstract class HttpRepository implements OnModuleInit {
  private readonly logger = new Logger(HttpRepository.name);

  protected constructor(
    private readonly http: NestHttpService,
    protected readonly configService: ConfigService<IConfig, true>,
  ) {}

  protected abstract getBaseOptions(): {
    API_URL: string;
  };

  onModuleInit() {
    this.http.axiosRef.interceptors.request.use(this.onRequest.bind(this));
    this.http.axiosRef.interceptors.response.use(this.onResponse.bind(this));
    this.http.axiosRef.defaults.headers.common['Content-Type'] =
      'application/json';
  }

  private async _request<T>({ config = {}, data, method, path }: IBaseRequest) {
    const { API_URL } = this.getBaseOptions();
    path = `${API_URL}${path}`;
    config.headers = { ...(config.headers || {}) } as AxiosRequestHeaders;

    let request$: Observable<AxiosResponse<T>> | null = null;

    if (method === 'request') {
      request$ = this.http[method]<T>(config);
    }

    if (!request$ && ['delete', 'get', 'head'].includes(method)) {
      request$ = this.http[method as 'get']<T>(path, config);
    }

    if (!request$ && ['post', 'patch', 'put'].includes(method)) {
      request$ = this.http[method as 'post']<T>(path, data, config);
    }

    let resHeaders: Record<string, unknown> = {};

    if (!request$) {
      throw new InternalServerErrorException('Invalid method for http service');
    }

    const responseData$ = request$.pipe(
      map((res) => {
        resHeaders = {
          ...resHeaders,
          ...res.headers,
        };
        return res.data;
      }),
      retry({
        delay: (err, i) => this.retryCallback(err as AxiosError, i),
      }),
      catchError((err: AxiosError) => this.handleError(err)),
    );

    const resData = await lastValueFrom<T>(responseData$);

    return { data: resData, headers: resHeaders };
  }

  protected delete<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'delete' });
  }

  protected get<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'get' });
  }

  protected head<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'head' });
  }

  protected patch<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'get' });
  }

  protected post<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'post' });
  }

  protected put<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'put' });
  }

  protected request<T>(options: Omit<IBaseRequest, 'method'>) {
    return this._request<T>({ ...options, method: 'request' });
  }

  private get RETRY_COUNT(): number {
    return this.configService.get<number>('RETRY_COUNT') ?? 2;
  }

  private get RETRY_INTERVAL(): number {
    return this.configService.get<number>('RETRY_INTERVAL') ?? 500;
  }

  private get RETRY_STATUS_CODE(): number {
    return this.configService.get<number>('RETRY_STATUS_CODE') ?? 401;
  }

  private handleError(err: AxiosError): Observable<never> {
    const { API_URL } = this.getBaseOptions();

    this.logger.error(`${API_URL} request error`, err.response?.data);

    return throwError(() => err);
  }

  private onRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig<unknown> {
    this.logger.verbose(`Outgoing HTTP request to ${config.url}`, {
      headers: config.headers,
      method: config.method,
      params: config.params as unknown,
    });

    return config;
  }

  private onResponse(response: AxiosResponse): AxiosResponse {
    const { API_URL } = this.getBaseOptions();

    this.logger.verbose(`Incoming HTTP response from ${API_URL}`, {
      code: response.status,
      status: response.status,
      statusText: response.statusText,
    });

    return response;
  }

  private retryCallback(err: AxiosError, i: number): Observable<0> {
    const { API_URL } = this.getBaseOptions();

    return i >= this.RETRY_COUNT ||
      this.RETRY_STATUS_CODE === err.response?.status
      ? throwError(() => {
          this.logger.error(`${API_URL} request failed`, { err });
          return err;
        })
      : timer(this.RETRY_INTERVAL);
  }
}
