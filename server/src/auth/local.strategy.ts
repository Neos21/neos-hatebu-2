import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy as BaseLocalStrategy } from 'passport-local';  // JwtStrategy と親クラスを区別するために名前を付けておく

/** Local Strategy : User Name と Password を使って認証を行うクラス */
@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private configService: ConfigService) {
    super({
      usernameField: 'userName',  // ユーザ認証時に POST するキーをデフォルトの `username` (全小文字) から変更する
      passwordField: 'password'
    });
  }
  
  /**
   * パスワードを使用してユーザ認証する
   * 
   * - Passport が `validate()` という名前の関数を期待するためこの関数名で実装している
   * - 参考 : https://docs.nestjs.com/security/authentication
   * - 参考 : https://zenn.dev/uttk/articles/9095a28be1bf5d
   * - 参考 : https://qiita.com/ci7lus/items/4b481d1ae670fba7e137
   * 
   * @param userName User Name
   * @param password Password
   * @return 認証成功時にユーザ情報を返す
   * @throws 認証失敗時
   */
  public validate(userName: string, password: string): { userName: string } {  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if(userName !== this.configService.get<string>('NEOS_HATEBU_USERNAME') || password !== this.configService.get<string>('NEOS_HATEBU_PASSWORD')) throw new UnauthorizedException();  // 環境変数を参照する
    return { userName };
  }
}
