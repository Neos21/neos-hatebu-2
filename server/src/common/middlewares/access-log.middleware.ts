import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { cyan, yellow } from '../utils/colour-logger';

/** アクセスログを出力するミドルウェア */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AccessLogMiddleware.name);
  
  /**
   * ミドルウェアの処理 : アクセスログを出力する
   * 
   * @param req リクエスト
   * @param _res レスポンス
   * @param next 次のミドルウェアを呼び出す
   */
  public use(req: Request, _res: Response, next: NextFunction): void {
    this.logger.log(yellow(`[${req.method}]`) + ' ' + cyan(`[${req.baseUrl}]`) + this.stringifyParam('Query', req.query) + this.stringifyParam('Body', req.body));
    next();
  }
  
  /**
   * パラメータオブジェクトを安全に文字列化する
   * 
   * @param name 項目名
   * @param param パラメータオブジェクト
   * @return 文字列化したオブジェクト
   */
  private stringifyParam(name: string, param: any): string {
    try {
      const parsedParam = param != null ? JSON.stringify(param) : '';
      return ['', '{}'].includes(parsedParam) ? '' : ` ${name}:${parsedParam}`;
    }
    catch(_error) {
      return '';
    }
  }
}
