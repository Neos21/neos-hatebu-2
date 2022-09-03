import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { NgDomain } from '../entities/ng-domain';

/** NG ドメインサービス */
@Injectable()
export class NgDomainsService {
  constructor(@InjectRepository(NgDomain) private ngDomainsRepository: Repository<NgDomain>) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  public async findAll(): Promise<Array<NgDomain>> {
    return await this.ngDomainsRepository.find();
  }
  
  /**
   * 登録する
   * 
   * @param ngDomain 登録する内容
   * @return 登録結果
   */
  public async create(ngDomain: NgDomain): Promise<InsertResult> {
    return await this.ngDomainsRepository.insert(ngDomain);
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   * @return 削除結果
   */
  public async remove(id: number): Promise<DeleteResult> {
    return await this.ngDomainsRepository.delete(id);
  }
}
