import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Category } from '../entities/category';

import { CategoriesService } from './categories.service';

/** カテゴリコントローラ */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): Promise<Array<Category>> {
    return await this.categoriesService.findAll();
  }
  
  /**
   * 指定の ID とそれに紐付く記事一覧を取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id') id: number): Promise<Category | null> {
    return await this.categoriesService.findById(id);
  }
}
