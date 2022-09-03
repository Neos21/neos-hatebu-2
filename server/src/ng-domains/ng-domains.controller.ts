import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { DeleteResult, InsertResult } from 'typeorm';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NgDomain } from '../entities/ng-domain';

import { NgDomainsService } from './ng-domains.service';

/** NG ドメインコントローラ */
@Controller('ng-domains')
export class NgDomainsController {
  constructor(private readonly ngDomainsService: NgDomainsService) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): Promise<Array<NgDomain>> {
    return await this.ngDomainsService.findAll();
  }
  
  /**
   * 登録する
   * 
   * @param ngDomain 登録する内容
   * @return 登録結果
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Body() ngDomain: NgDomain): Promise<InsertResult> {
    return await this.ngDomainsService.create(ngDomain);
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   * @return 削除結果
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number): Promise<DeleteResult> {
    return await this.ngDomainsService.remove(id);
  }
}
