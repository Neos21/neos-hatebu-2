import * as path from 'path';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

// Common
import { AccessLogMiddleware } from './common/middlewares/access-log.middleware';

// Entities
import { NgDomain } from './entities/ng-domain';

// Modules
import { AuthModule } from './auth/auth.module';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

/** Neo's Hatebu Server */
@Module({
  imports: [
    // 環境変数注入をできるようにする
    ConfigModule.forRoot(),
    // TypeORM : https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.resolve(__dirname, '../db/neos-hatebu.sqlite3.db'),
      entities: [
        NgDomain
      ],
      synchronize: true
    }),
    // Repository を使えるようにする
    TypeOrmModule.forFeature([
      NgDomain
    ]),
    
    // Modules
    AuthModule,
    // `/api` の Prefix を付ける : https://docs.nestjs.com/recipes/router-module
    RouterModule.register([
      {
        path: 'api',
        children: [
          AuthModule
        ]
      }
    ])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ]
})
export class AppModule {
  /**
   * 独自のミドルウェアを追加する
   * 
   * - 参考 : https://docs.nestjs.com/middleware
   * 
   * @param middlewareConsumer Middleware Consumer
   */
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');  // アクセスログ出力
  }
}
