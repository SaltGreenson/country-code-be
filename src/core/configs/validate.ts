import { plainToClass, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { IConfig } from '../interfaces';

const numberTransform = ({ value }: { value: unknown }) => Number(value);

class EnvValidator implements IConfig {
  @IsString()
  @IsNotEmpty()
  CLIENT_URL: string;

  @Transform(numberTransform)
  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  COUNTRY_PHONE_API_URL: string;

  @IsOptional()
  @Transform(numberTransform)
  @IsNumber()
  RETRY_COUNT?: number;

  @IsOptional()
  @Transform(numberTransform)
  @IsNumber()
  RETRY_INTERVAL?: number;

  @IsOptional()
  @Transform(numberTransform)
  @IsNumber()
  MAX_OUTPUT_LENGTH?: number;

  @IsOptional()
  @Transform(numberTransform)
  @IsNumber()
  RETRY_STATUS_CODE?: number;

  @Transform(numberTransform)
  @IsNumber()
  CACHE_TTL: number;
}

export function validateConfig(config: IConfig) {
  const validatedConfig = plainToClass(EnvValidator, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
