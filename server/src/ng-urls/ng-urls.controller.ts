import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InsertResult } from 'typeorm';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NgUrl } from '../entities/ng-url';

import { NgUrlsService } from './ng-urls.service';

/** NG URL コントローラ */
@Controller('ng-urls')
export class NgUrlsController {
  constructor(private readonly ngUrlsService: NgUrlsService) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): Promise<Array<NgUrl>> {
    return await this.ngUrlsService.findAll();
  }
  
  /**
   * 登録する
   * 
   * @param ngUrl 登録する内容
   * @return 登録結果
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() ngUrl: NgUrl): Promise<InsertResult> {
    return await this.ngUrlsService.create(ngUrl);
  }
}
