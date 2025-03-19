import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return { statusCode: HttpStatus.OK };
  }
}
