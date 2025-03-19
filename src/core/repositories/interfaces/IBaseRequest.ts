import { InternalAxiosRequestConfig } from 'axios';

export interface IBaseRequest {
  config?: Partial<InternalAxiosRequestConfig>;
  data?: object;
  method: 'delete' | 'get' | 'head' | 'patch' | 'post' | 'put' | 'request';
  path: string;
}
