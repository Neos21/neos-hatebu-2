import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';  // LocalStrategy と親クラスを区別するために名前を付けておく

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Authorization Bearer から JWT アクセストークンを読み込むようにする
      ignoreExpiration: false,  // 有効期間を無視しない
      secretOrKey: configService.get<string>('NEOS_HATEBU_JWT_SECRET_KEY')  // JWT アクセストークン発行に使用する秘密鍵を環境変数から取得する
    });
  }
  
  /**
   * Payload を使用して認証する (特に独自にすることはないので Payload をそのまま返すのみ)
   * 
   * @param payload Payload
   * @return 認証ユーザ情報
   */
  public validate(payload: { userName: string }): { userName: string } {
    return payload;
  }
}
