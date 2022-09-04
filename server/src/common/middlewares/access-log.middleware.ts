import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { cyan, yellow } from '../utils/colour-logger';

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
    const stringifyParam = (name: string, param: any): string => {  // eslint-disable-line @typescript-eslint/no-explicit-any
      try {
        const parsedParam = param != null ? JSON.stringify(param) : '';
        return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
      }
      catch(_error) {
        return '';
      }
    };
    
    // アクセスログを出力する
    this.logger.log(yellow(`[${req.method}]`) + ' ' + cyan(`[${req.baseUrl}]`) + stringifyParam('Query', req.query) + stringifyParam('Body', req.body));
    
    next();
  }
}
