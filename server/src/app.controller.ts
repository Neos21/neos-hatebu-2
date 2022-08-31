import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { NgDomain } from './entities/ng-domain';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('test-ng-domains')
  public async testGetNgDomains(): Promise<Array<NgDomain>> {
    return await this.appService.testFindAll();
  }
}
