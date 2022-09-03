import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../entities/category';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

/** カテゴリモジュール */
@Module({
  imports: [
    TypeOrmModule.forFeature([Category])  // Repository を使えるようにする
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule { }
