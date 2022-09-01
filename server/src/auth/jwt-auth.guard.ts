import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TokenExpiredError } from 'jsonwebtoken'; // `@nestjs/jwt` の依存パッケージとして含まれているので参照できる

/** JWT Auth Guard : ガードを使用する際にクラス名を指定する方が分かりやすいのでラッパーを作っておく */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * デフォルトだとトークン期限切れかどうかが判断できないので制御を追加する
   *
   * @param error エラー (継承元の `AuthGuard` の宣言自体が `any` なので合わせてある)
   * @param user ユーザ情報 (継承元の `AuthGuard` の宣言自体が `any` なので合わせてある)
   * @param info エラー情報
   * @return トークン認証成功時に認証ユーザ情報を返す
   * @throws トークン認証失敗時
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public handleRequest(error: any, user: any, info: Error): any {
    // トークン切れの場合はレスポンスを変える : `{"statusCode":401,"message":"JWT Access Token Expired","error":"Unauthorized"}` このようなレスポンスになる
    if (info instanceof TokenExpiredError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      console.warn('JWT Auth Guard : Token Expired Error', { error, user, info });
      throw new UnauthorizedException('JWT Access Token Expired');
    }
    // エラーがある・もしくは Token 認証切れの際は `user` が `false` になっているのでエラーと判断する
    if (error || !user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      console.error('JWT Auth Guard : Other Errors', { error, user, info });
      throw error || new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { userName: user.userName }; // トークン認証成功時
  }
}
