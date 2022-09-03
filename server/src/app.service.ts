import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NgDomain } from './entities/ng-domain';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(NgDomain) private ngDomainsRepository: Repository<NgDomain>
  ) { }
    
  public getHello(): string {
    return 'Hello World!';
  }
  
  /** TODO : TypeORM テスト用関数 */
  public async testFindAll(): Promise<Array<NgDomain>> {
    // テストデータを投入する
    //const saved = await this.ngDomainsRepository.save(new NgDomain({ domain: 'example.com' }));
    //console.log('Saved :', saved);
    // 全件取得して返す
    const founds = await this.ngDomainsRepository.find();
    console.log('Founds : ', founds);
    return founds;
  }
}
