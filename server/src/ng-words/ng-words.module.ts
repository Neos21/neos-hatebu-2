import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NgWord } from '../entities/ng-word';

import { NgWordsController } from './ng-words.controller';
import { NgWordsService } from './ng-words.service';

/** NG ワードモジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([NgWord])  // Repository を使えるようにする
  ],
  controllers: [NgWordsController],
  providers: [NgWordsService]
})
export class NgWordsModule { }
