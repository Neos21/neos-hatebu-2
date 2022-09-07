import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LessThanOrEqual, Repository } from 'typeorm';

import { NgUrl } from '../entities/ng-url';

/** NG URL サービス */
@Injectable()
export class NgUrlsService {
  private readonly logger: Logger = new Logger(NgUrlsService.name);
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
   * @return 登録後のエンティティ
   */
  public async create(ngUrl: NgUrl): Promise<NgUrl> {
    const insertResult = await this.ngUrlsRepository.insert(ngUrl);
    const id: number = insertResult.identifiers?.[0]?.id;  // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    if(id == null) {
      this.logger.error('#create() : Failed', insertResult);
      throw new Error('Failed to insert NgUrl');
    }
    return this.ngUrlsRepository.findOneByOrFail({ id });
  }
  
  
  // Cron Job スケジュール用
  // ================================================================================
  
  /**
   * 指定日付以前のデータを削除する : フロントエンドからの呼び出しはナシ
   * 
   * `created_at` カラムは ISO8601 表記の UTC `YYYY-MM-DDTHH:mm:SS.sssZ` で記録されているため
   * 削除条件とする日時情報は UTC で計算することになる
   * 大まかに過去データが削除できればよく厳密さは求めないので、適当に1週間程度以前のデータを削除する
   */
  public async removeByCreatedAt(): Promise<void> {
    const now = new Date();
    const minusDates = 7;  // 現在日から何日前以前のデータを削除するか
    const targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - minusDates, 0, 0, 0, 0));  // マイナス値等は適切に処理してくれる
    this.logger.log(`#removeByCreatedAt() : Target date [${targetDate.toISOString()}]`);
    const deleteResult = await this.ngUrlsRepository.delete({ createdAt: LessThanOrEqual(targetDate) });
    this.logger.log(`#removeByCreatedAt() : Removed rows [${deleteResult.affected}]`);  // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
}
