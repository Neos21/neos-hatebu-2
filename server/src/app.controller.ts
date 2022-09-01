import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Express, Request } from 'express';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { NgDomain } from './entities/ng-domain';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/ng-domains')
  public async testGetNgDomains(): Promise<Array<NgDomain>> {
    return await this.appService.testFindAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('test/profile')
  public testGetProfile(@Req() req: Request): Express.User {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return req.user!;
  }
}
