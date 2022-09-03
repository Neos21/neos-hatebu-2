import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { NgUrl } from '../entities/ng-url';

/** NG URL サービス */
@Injectable()
export class NgUrlsService {
  constructor(@InjectRepository(NgUrl) private readonly ngUrlsRepository: Repository<NgUrl>) { }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  public async findAll(): Promise<Array<NgUrl>> {
    return await this.ngUrlsRepository.find({ order: { createdAt: 'DESC' } });  // 登録日時が新しい順
  }
  
  /**
   * 登録する
   * 
   * @param ngUrl 登録する内容
   * @return 登録結果
   */
  public async create(ngUrl: NgUrl): Promise<InsertResult> {
    return await this.ngUrlsRepository.insert(ngUrl);
  }
  
  
  // バッチ処理用
  // ================================================================================
  
  /**
   * 指定日付以前のデータを削除する : フロントエンドからの呼び出しはナシ
   * 
   * @param createdAt 登録日時
   * @return 削除結果
   */
  public async removeByCreatedAt(createdAt: string): Promise<DeleteResult> {
    return await this.ngUrlsRepository.delete({});  // TODO : 後で実装する `created_at < YYYY-MM-DD
  }
}
