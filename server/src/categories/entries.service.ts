import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import fetch from 'node-fetch';
import { DataSource, Repository } from 'typeorm';

import { Entry } from '../entities/entry';

import { CategoriesService } from './categories.service';

/** 記事サービス */
@Injectable()
export class EntriesService {
  private readonly logger: Logger = new Logger(EntriesService.name);
  constructor(
    @InjectRepository(Entry) private readonly entriesRepository: Repository<Entry>,
    private readonly dataSource: DataSource,
    private readonly categoriesService: CategoriesService
  ) { }
  
  /** 全カテゴリについてスクレイピングして更新する */
  public async scrapeAllEntries(): Promise<void> {
    this.logger.log('#scrapeAllEntries() : Start');
    const categories = await this.categoriesService.findAll();
    for(const [index, category] of Object.entries(categories)) {
      this.logger.log(`#scrapeAllEntries() :   [${index}] ${category.name} : Start`);
      await this.scrapeEntries(category.id, category.pageUrl);
      this.logger.log(`#scrapeAllEntries() :   [${index}] ${category.name} : Succeeded`);
    }
    this.logger.log('#scrapeAllEntries() : Succeeded');
  }
  
  /**
   * 指定のカテゴリについてスクレイピングして更新する
   * 
   * @param categoryId カテゴリ ID
   * @param pageUrl ページ URL (引数で渡されていない場合は内部で取得する)
   */
  public async scrapeEntries(categoryId: number, pageUrl?: string): Promise<void> {
    await this.dataSource.transaction(async () => {
      this.logger.log(`#scrapeEntries() : Transaction Start : [${categoryId}] ${pageUrl ?? 'Unknown'}`);
      // 引数でページ URL が渡されていない場合は取得する
      if(pageUrl == null) {
        const category = await this.categoriesService.findById(categoryId);
        pageUrl = category.pageUrl;
        this.logger.log(`#scrapeEntries() :   Get Page URL : [${categoryId}] ${pageUrl}`);
      }
      
      const html    = await this.crawlPage(pageUrl);             // クロールする
      const $       = this.convertHtmlToJQueryLikeObject(html);  // jQuery ライクに変換する
      const entries = this.transformToEntries(categoryId, $);    // 抽出する
      await this.bulkRemove(categoryId);                         // 先に一括削除する
      await this.bulkCreate(entries);                            // 一括登録する
      await this.categoriesService.updateUpdatedAt(categoryId);  // カテゴリの最終クロール日時も更新する
      this.logger.log(`#scrapeEntries() : Transaction End : [${categoryId}] ${pageUrl}`);
    });
  }
  
  /**
   * 指定のページをクロールし HTML を取得する
   * 
   * @param pageUrl ページ URL
   * @return レスポンステキスト (HTML)
   */
  private async crawlPage(pageUrl: string): Promise<string> {
    const response = await fetch(pageUrl, {
      headers: {  // UA を偽装しないと 503 ページに飛ばされるので Windows Chrome の UA を利用する
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
      }
    });
    const responseText: string = await response.text();
    return responseText;
  }
  
  /**
   * HTML テキストを jQuery ライクなオブジェクトに変換する (Cheerio を使用する)
   * 
   * @param html HTML テキスト
   * @return jQuery ライクオブジェクト
   */
  private convertHtmlToJQueryLikeObject(html: string): CheerioAPI {
    return load(html);
  }
  
  /**
   * 記事情報を抽出する
   * 
   * @param categoryId カテゴリ ID
   * @param $ jQuery ライクオブジェクト
   * @return 記事一覧
   */
  private transformToEntries(categoryId: number, $: CheerioAPI): Array<Entry> {
    const entries: Array<Entry> = [];
    $('.entrylist-contents').each((_index, element) => {
      const linkElem     = $(element).find('.entrylist-contents-title a');
      const title        = linkElem.attr('title');
      const url          = linkElem.attr('href');
      const description  = $(element).find('.entrylist-contents-description').text();
      const count        = $(element).find('.entrylist-contents-users span').text();
      const date         = $(element).find('.entrylist-contents-date').text();  // `YYYY/MM/DD HH:mm`
      const faviconUrl   = $(element).find('.entrylist-contents-domain img').attr('src');
      const thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`  // eslint-disable-line @typescript-eslint/restrict-template-expressions
        .replace('background-image:url(\'', '')
        .replace('\');', '')
        .replace((/^undefined$/), '');  // サムネイルがない記事は `span` 要素がなく最終的な文字列が `undefined` になるので空文字に修正する
      // 記事オブジェクトとして追加する : 最終クロール日時は自動挿入される
      entries.push(new Entry({ categoryId, title, url, description, count, date, faviconUrl, thumbnailUrl }));
    });
    return entries;
  }
  
  /**
   * 一括登録する
   * 
   * @param entries 記事の配列
   */
  private async bulkCreate(entries: Array<Entry>): Promise<void> {
    await this.entriesRepository.insert(entries);
  }
  
  /**
   * 一括削除する
   * 
   * @param categoryId 削除するカテゴリ ID
   */
  private async bulkRemove(categoryId: number): Promise<void> {
    await this.entriesRepository.delete({ categoryId: categoryId });
  }
}
