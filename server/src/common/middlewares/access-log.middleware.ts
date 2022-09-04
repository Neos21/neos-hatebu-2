import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

/** アクセスログを出力するミドルウェア */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AccessLogMiddleware.name);
  
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
    
    const parseParam = (name: string, param: any): string => {  // eslint-disable-line @typescript-eslint/no-explicit-any
      try {
        const parsedParam = param != null ? JSON.stringify(param) : '';
        return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
      }
      catch(_error) {
        return '';
      }
    };
    
    // アクセスログを出力する
    this.logger.log(yellow(`[${req.method}]`) + ' ' + cyan(`[${req.baseUrl}]`) + parseParam('Query', req.query) + parseParam('Body', req.body));
    
    next();
  }
}
