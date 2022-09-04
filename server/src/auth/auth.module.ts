import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    PassportModule,  // For `LocalStrategy#validate()`
    JwtModule.registerAsync({
      // `AppModule` にて `isGlobal: true` でロードしているため、本 `@Module.imports` と `registerAsync.imports` に `ConfigModule` の記載が不要になる
      inject: [ConfigService],  // `useFactory()` で使うサービスを注入する
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),  // 環境変数から注入する
        signOptions: { expiresIn: configService.get<string>('jwtExpiresIn') }  // JWT アクセストークンの有効期限 : https://github.com/vercel/ms
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
