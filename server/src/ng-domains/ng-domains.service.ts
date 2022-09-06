import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NgDomain } from '../entities/ng-domain';

/** NG ドメインサービス */
@Injectable()
export class NgDomainsService {
  private readonly logger: Logger = new Logger(NgDomainsService.name);
  constructor(@InjectRepository(NgDomain) private readonly ngDomainsRepository: Repository<NgDomain>) { }
  
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
   * @return 登録後のエンティティ
   */
  public async create(ngDomain: NgDomain): Promise<NgDomain> {
    const insertResult = await this.ngDomainsRepository.insert(ngDomain);
    const id: number = insertResult.identifiers?.[0]?.id;  // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    if(id == null) {
      this.logger.error('#create() : Something Wrong', insertResult);
      throw new Error('Failed To Insert NgDomain');
    }
    return this.ngDomainsRepository.findOneByOrFail({ id: id });
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   */
  public async remove(id: number): Promise<void> {
    await this.ngDomainsRepository.delete(id);
  }
}
