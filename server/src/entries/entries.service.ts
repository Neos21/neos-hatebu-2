import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { Entry } from '../entities/entry';

/** 記事サービス */
@Injectable()
export class EntriesService {
  constructor(@InjectRepository(Entry) private entriesRepository: Repository<Entry>) { }
  
  
  // バッチ処理用
  // ================================================================================
  
  /**
   * 一括登録する
   * 
   * @param entries 記事の配列
   * @return 登録結果
   */
  private async bulkCreate(entries: Array<Entry>): Promise<InsertResult> {
    return this.entriesRepository.insert(entries);
  }
  
  /**
   * 一括削除する
   * 
   * @param categoryId 削除するカテゴリ ID
   * @return 削除結果
   */
  private async bulkRemove(categoryId: number): Promise<DeleteResult> {
    return this.entriesRepository.delete({ categoryId: categoryId });
  }
}
