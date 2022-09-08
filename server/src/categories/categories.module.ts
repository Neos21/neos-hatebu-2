import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../entities/category';
import { Entry } from '../entities/entry';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/** カテゴリモジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Entry])  // Repository を使えるようにする
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]  // `AppModule` で使うためエクスポートする
})
export class CategoriesModule { }
