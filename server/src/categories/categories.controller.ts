import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

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
   * @param queryIsExcludeEntries 紐付く記事一覧を取得しない場合は `'true'` が指定される
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(@Query('is_exclude_entries') queryIsExcludeEntries?: string | boolean): Promise<Array<Category>> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
    return await this.categoriesService.findAll(isExcludeEntries);
  }
  
  /**
   * 指定の ID のカテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param id ID
   * @param queryIsExcludeEntries 紐付く記事一覧を取得しない場合は `'true'` が指定される
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id') id: number, @Query('is_exclude_entries') queryIsExcludeEntries?: string | boolean): Promise<Category> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
    return await this.categoriesService.findById(id, isExcludeEntries);
  }
  
  /**
   * 全カテゴリについてスクレイピングして更新し、再度全件取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async scrapeAll(): Promise<Array<Category>> {
    await this.categoriesService.scrapeAllEntries();
    return await this.categoriesService.findAll();
  }
  
  /**
   * 指定の ID のカテゴリについてスクレイピングして更新し、再度指定の ID のカテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param id ID
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  public async scrapeById(@Param('id') id: number): Promise<Category> {
    await this.categoriesService.scrapeEntries(id);
    return await this.categoriesService.findById(id);
  }
  
  /**
   * `@Query()` はどうしても文字列型になってしまうようなので文字列であっても Boolean を判定できるようにする
   * 
   * @param value 値
   * @return 値が Truthy か否か
   */
  private isTruthy(value?: string | boolean): boolean {
    if(value == null) return false;
    if(typeof value === 'boolean') return value;
    if((/^(true|yes|1)$/i).test(value)) return true;
    if((/^(false|no|0)$/i).test(value)) return false;
    return Boolean(value);  // その他の文字列や型の場合 (空文字は `false`)
  }
}
