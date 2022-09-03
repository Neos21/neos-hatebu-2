import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

/** App コントローラ */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  /**
   * API ルートを示す
   * 
   * @return テキスト
   */
  @Get('/api')
  public getApiRoot(): string {
    return this.appService.getApiRoot();
  }
}
