import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

/** アクセスログを出力するミドルウェア */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  /**
   * ミドルウェアの処理
   * 
   * @param req リクエスト
   * @param _res レスポンス
   * @param next 次のミドルウェアを呼び出す
   */
  public use(req: Request, _res: Response, next: NextFunction): void {
    // NestJS のロガー `cli-colors.util.js` を参照
    const isColourAllowed = (): boolean => !process.env.NO_COLOR;
    const colourIfAllowed = (colourFunction: (text: string) => string) => (text: string) => isColourAllowed() ? colourFunction(text) : text;
    const yellow = colourIfAllowed((text) => `\x1B[33m${text}\x1B[39m`);
    const cyan   = colourIfAllowed((text) => `\x1B[96m${text}\x1B[39m`);
    
    // アクセスログを出力する
    Logger.log(yellow(`[${req.method}]`) + ' ' + cyan(`[${req.url}]`));
    
    next();
  }
}
