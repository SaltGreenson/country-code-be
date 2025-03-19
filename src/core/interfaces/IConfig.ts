export interface IConfig {
  COUNTRY_PHONE_API_URL: string;
  CLIENT_URL: string;
  PORT: number;
  CACHE_TTL: number;
  RETRY_COUNT?: number;
  RETRY_INTERVAL?: number;
  MAX_OUTPUT_LENGTH?: number;
  RETRY_STATUS_CODE?: number;
}
