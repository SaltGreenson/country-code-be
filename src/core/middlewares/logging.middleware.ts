import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('LoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, params, ip } = req;

    this.logger.verbose(`Method: ${method}, URL: ${originalUrl}`, {
      originalUrl,
      method,
      query,
      params,
      ip,
    });

    next();
  }
}
