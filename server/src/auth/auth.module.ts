import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

/**
 * 認証モジュール
 * 
 * - 参考 : https://docs.nestjs.com/security/authentication
 */
@Module({
  imports: [
    ConfigModule,
    PassportModule,  // For `LocalStrategy#validate()`
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],  // `useFactory()` で使うサービスを注入する
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('NEOS_HATEBU_JWT_SECRET_KEY'),  // 環境変数から注入する
        signOptions: { expiresIn: '7 days' }  // JWT アクセストークンの有効期限 : https://github.com/vercel/ms
      })
    })
  ],
  controllers: [
    AuthController
  ],
  providers: [
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule { }
