import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NgWord } from '../entities/ng-word';

/** NG ワードサービス */
@Injectable()
export class NgWordsService {
  private readonly logger: Logger = new Logger(NgWordsService.name);
  constructor(@InjectRepository(NgWord) private readonly ngWordsRepository: Repository<NgWord>) { }
  
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
   * @return 登録後のエンティティ
   */
  public async create(ngWord: NgWord): Promise<NgWord> {
    const insertResult = await this.ngWordsRepository.insert(ngWord);
    const id: number = insertResult.identifiers?.[0]?.id;
    if(id == null) {
      this.logger.error('#create() : Failed', insertResult);
      throw new Error('Failed to insert NgWord');
    }
    return this.ngWordsRepository.findOneByOrFail({ id });
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   */
  public async remove(id: number): Promise<void> {
    await this.ngWordsRepository.delete(id);
  }
}
