import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { EntriesService } from './categories/entries.service';
import { NgUrlsService } from './ng-urls/ng-urls.service';

/** App サービス */
@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);
  constructor(
    private readonly entriesService: EntriesService,
    private readonly ngUrlsService: NgUrlsService
  ) { }
  
  /**
   * API ルートを示すテキストを返す
   * 
   * @return テキスト
   */
  public getApiRoot(): string {
    return 'Neo\'s Hatebu API';
  }
  
  
  // Cron Job スケジュール用
  // ================================================================================
  
  /**
   * Cron Job スケジュールを定義する
   * 
   * - 参考 : https://docs.nestjs.com/techniques/task-scheduling
   * - Seconds Minutes Hours Dates Months Days(0:Sunday - 6:Saturday) の順
   * - JST で指定している
   *   - 06:00 (UTC 21:00)
   *   - 11:00 (UTC 02:00)
   *   - 15:00 (UTC 05:00)
   *   - 17:00 (UTC 08:00)
   * - 関数内でエラーが発生しても異常終了にはならない
   */
  @Cron('0 0 6,11,15,17 * * *', { timeZone: 'Asia/Tokyo' })
  private async handleCron(): Promise<void> {
    this.logger.log('#handleCron() : Start');
    await this.ngUrlsService.removeByCreatedAt().catch((error) => this.logger.warn('#handleCron() :   Failed at NgUrlsService#removeByCreatedAt()', error));
    await this.entriesService.scrapeAllEntries().catch((error) => this.logger.warn('#handleCron() :   Failed at EntriesService#scrapeAllEntries()', error));
    this.logger.log('#handleCron() : Finished');
  }
}
