import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Category } from '../entities/category';

import { CategoriesService } from './categories.service';
import { EntriesService } from './entries.service';

/** カテゴリコントローラ */
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly entriesService: EntriesService
  ) { }
  
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
  public async findById(@Param('id') id: number): Promise<Category> {
    return await this.categoriesService.findById(id);
  }
  
  /**
   * 全カテゴリについてスクレイピングして更新する
   * 
   * @return 全ての更新結果
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async scrapeAll(): Promise<Array<{ category: Category; result: { deleteResult: DeleteResult; insertResult: InsertResult; updateResult: UpdateResult } }>> {
    return await this.entriesService.scrapeAllEntries();
  }
  
  /**
   * 指定の ID のカテゴリについてスクレイピングして記事情報を更新する
   * 
   * @param id ID
   * @return 更新結果
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  public async scrapeById(@Param('id') id: number): Promise<{ deleteResult: DeleteResult; insertResult: InsertResult; updateResult: UpdateResult }> {
    return await this.entriesService.scrapeEntries(id);
  }
}
