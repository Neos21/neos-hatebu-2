import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NgWord } from '../entities/ng-word';

import { NgWordsService } from './ng-words.service';

/** NG ワードコントローラ */
@Controller('ng-words')
export class NgWordsController {
  constructor(private readonly ngWordsService: NgWordsService) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): Promise<Array<NgWord>> {
    return await this.ngWordsService.findAll();
  }
  
  /**
   * 登録する
   * 
   * @param ngWord 登録する内容
   * @return 登録後のエンティティ
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() ngWord: NgWord): Promise<NgWord> {
    return await this.ngWordsService.create(ngWord);
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number): Promise<void> {
    await this.ngWordsService.remove(id);
  }
}
