import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Entry } from '../entities/entry';

import { EntriesService } from './entries.service';

/** 記事モジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([Entry])  // Repository を使えるようにする
  ],
  providers: [EntriesService]
})
export class EntriesModule { }
