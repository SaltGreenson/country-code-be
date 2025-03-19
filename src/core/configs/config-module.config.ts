import { ConfigModuleOptions } from '@nestjs/config';
import { validateConfig } from './validate';

export const CONFIG_MODULE_CONFIG: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  validate: validateConfig,
};
