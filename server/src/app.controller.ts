import { All, Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';

import { Request } from 'express';

import { AppService } from './app.service';

/** App コントローラ */
@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) { }
  
  /**
   * API ルートを示す
   * 
   * @return テキスト
   */
  @Get('/api')
  public getApiRoot(): string {
    return this.appService.getApiRoot();  // Service 注入ができているかどうかのチェックも兼ねる
  }
  
  // テスト用のオウム返しエンドポイント群
  @Get    ('/api/tests'    ) public testGet    (                         @Query() query: object): object { this.logger.log(`#testGet() : ${this.stringifyParam(query)}`           ); return query     ; }
  @Post   ('/api/tests'    ) public testPost   (                         @Body()  body : object): object { this.logger.log(`#testPost() : ${this.stringifyParam(body)}`           ); return body      ; }
  @Options('/api/tests'    ) public testOptions(                                               ): string { this.logger.log('#testOptions()'                                       ); return 'OPTIONS' ; }  // 一応 Options も定義できる
  @Get    ('/api/tests/:id') public testGetOne (@Param('id') id: string, @Query() query: object): object { this.logger.log(`#testGetOne() : [${id}] ${this.stringifyParam(query)}`); return query     ; }
  @Put    ('/api/tests/:id') public testPut    (@Param('id') id: string, @Body()  body : object): object { this.logger.log(`#testPut() : [${id}] ${this.stringifyParam(body)}`    ); return body      ; }
  @Patch  ('/api/tests/:id') public testPatch  (@Param('id') id: string, @Body()  body : object): object { this.logger.log(`#testPatch() : [${id}] ${this.stringifyParam(body)}`  ); return body      ; }
  @Delete ('/api/tests/:id') public testDelete (@Param('id') id: string                        ): string { this.logger.log(`#testDelete() : [${id}]`                              ); return id        ; }
  @All    ('/api/tests/all') public testAll    (@Req()      req: Request                       ): string { this.logger.log(`#testAll()' : [${req.method}]`                        ); return req.method; }  // 全メソッドを一括定義できる
  
  /**
   * パラメータを安全に文字列化する
   * 
   * @param param パラメータとなる連想配列
   * @return Stringify した文字列
   */
  private stringifyParam(param: object): string {
    try {
      const parsedParam = param != null ? JSON.stringify(param) : '';
      return ['', '{}'].includes(parsedParam) ? '' : parsedParam;
    }
    catch(_error) {
      return '';
    }
  }
}
