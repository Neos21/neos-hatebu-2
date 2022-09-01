import { Controller, Post, Req, UseGuards } from '@nestjs/common'; // `Req` と `Request` は同じ・型名が Express と衝突するので `Req` を使用した
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { LocalAuthGuard } from './local-auth.guard';

/** 認証ルーティング・コントローラ */
@Controller('api/auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  /**
   * パスワード認証によるログインを行い JWT アクセストークンを発行する
   *
   * `LocalAuthGuard` → `LocalStrategy#validate()` (自動検知) にてパスワード認証する
   * 認証成功時は `{ userName: string; }` が返され、メソッド中の `req.user` で参照できるので
   * コレを Payload として `JwtService#sign()` の引数に設定して JWT アクセストークンを発行する
   *
   * @param req リクエスト
   * @return JWT アクセストークン
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Req() req: Request): { accessToken: string } {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { accessToken: this.jwtService.sign(req.user!) }; // ログイン成功時に JWT アクセストークンを返す
  }
}
