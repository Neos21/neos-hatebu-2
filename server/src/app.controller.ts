import { Controller, Delete, Get, Options, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';

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
  
  @Get    ('test/ng-domains') public async testGetNgDomains    (): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  @Post   ('test/ng-domains') public async testPostNgDomains   (): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  @Put    ('test/ng-domains') public async testPuttNgDomains   (): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  @Patch  ('test/ng-domains') public async testPatchNgDomains  (): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  @Delete ('test/ng-domains') public async testDeleteNgDomains (): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  @Options('test/ng-domains') public async testOptionsNgDomains(): Promise<Array<NgDomain>> { return await this.appService.testFindAll(); }
  
  @UseGuards(JwtAuthGuard)
  @Get('test/profile')
  public testGetProfile(@Req() req: Request): Express.User {
    return req.user!;  // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}
