import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NgUrl } from '../entities/ng-url';

import { NgUrlsController } from './ng-urls.controller';
import { NgUrlsService } from './ng-urls.service';

/** NG URL モジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([NgUrl])  // Repository を使えるようにする
  ],
  controllers: [NgUrlsController],
  providers: [NgUrlsService],
  exports: [NgUrlsService]  // `AppModule` で使うためエクスポートする
})
export class NgUrlsModule { }
