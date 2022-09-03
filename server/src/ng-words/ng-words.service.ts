import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { NgWord } from '../entities/ng-word';

/** NG ワードサービス */
@Injectable()
export class NgWordsService {
  constructor(@InjectRepository(NgWord) private ngWordsRepository: Repository<NgWord>) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  public async findAll(): Promise<Array<NgWord>> {
    return await this.ngWordsRepository.find();
  }
  
  /**
   * 登録する
   * 
   * @param ngWord 登録する内容
   * @return 登録結果
   */
  public async create(ngWord: NgWord): Promise<InsertResult> {
    return await this.ngWordsRepository.insert(ngWord);
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   * @return 削除結果
   */
  public async remove(id: number): Promise<DeleteResult> {
    return await this.ngWordsRepository.delete(id);
  }
}
