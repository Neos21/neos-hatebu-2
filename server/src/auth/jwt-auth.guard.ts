import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TokenExpiredError } from 'jsonwebtoken';  // `@nestjs/jwt` の依存パッケージとして含まれているので参照できる

/** JWT Auth Guard : ガードを使用する際にクラス名を指定する方が分かりやすいのでラッパーを作っておく */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger: Logger = new Logger(JwtAuthGuard.name);
  
  /**
   * デフォルトだとトークン期限切れかどうかが判断できないので制御を追加する
   * 
   * @param error エラー (継承元の `AuthGuard` の宣言自体が `any` なので合わせてある)
   * @param user ユーザ情報 (継承元の `AuthGuard` の宣言自体が `any` なので合わせてある)
   * @param info エラー情報
   * @return トークン認証成功時に認証ユーザ情報を返す
   * @throws トークン認証失敗時
   */
  public handleRequest(error: any, user: any, info: Error): any {  // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    // トークン切れの場合はレスポンスを変える : `{"statusCode":401,"message":"JWT Access Token Expired","error":"Unauthorized"}` このようなレスポンスになる
    if(info instanceof TokenExpiredError) {
      this.logger.warn('#handleRequest() : Token expired error', { error, user, info });  // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      throw new UnauthorizedException('JWT Access Token Expired');
    }
    // エラーがある・もしくは Token 認証切れの際は `user` が `false` になっているのでエラーと判断する
    if(error || !user) {
      this.logger.warn('#handleRequest() : Unauthorized error', { error, user, info });  // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      throw error || new UnauthorizedException();
    }
    // トークン認証成功時
    return { userName: user.userName };  // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  }
}
