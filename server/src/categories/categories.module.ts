import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../entities/category';
import { Entry } from '../entities/entry';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { EntriesService } from './entries.service';

/** カテゴリモジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([  // Repository を使えるようにする
      Category,
      Entry
    ])
  ],
  controllers: [
    CategoriesController
  ],
  providers: [
    CategoriesService,
    EntriesService
  ],
})
export class CategoriesModule { }
