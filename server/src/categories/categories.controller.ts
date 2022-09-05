import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

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
   * 全カテゴリについてスクレイピングして更新し、再度全件取得する
   * 
   * @return 取得結果
   */
   @UseGuards(JwtAuthGuard)
   @Post()
   public async scrapeAll(): Promise<Array<Category>> {
     await this.entriesService.scrapeAllEntries();
     return await this.categoriesService.findAll();
   }
   
  /**
   * 指定の ID のカテゴリととそれに紐付く記事一覧を取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id') id: number): Promise<Category> {
    return await this.categoriesService.findById(id);
  }
  
  /**
   * 指定の ID のカテゴリについてスクレイピングして更新し、再度指定の ID のカテゴリととそれに紐付く記事一覧を取得する
   * 
   * @param id ID
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  public async scrapeById(@Param('id') id: number): Promise<Category> {
    await this.entriesService.scrapeEntries(id);
    return await this.categoriesService.findById(id);
  }
}
