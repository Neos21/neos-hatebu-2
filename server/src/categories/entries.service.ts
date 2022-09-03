import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import fetch from 'node-fetch';
import { DataSource, DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { Category } from '../entities/category';
import { Entry } from '../entities/entry';

import { CategoriesService } from './categories.service';

/** 記事サービス */
@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry) private readonly entriesRepository: Repository<Entry>,
    private readonly dataSource: DataSource,
    private readonly categoriesService: CategoriesService
  ) { }
  
  /**
   * 全カテゴリについてスクレイピングして更新する
   * 
   * @return 全ての更新結果
   */
  public async scrapeAllEntries(): Promise<Array<{ category: Category; result: { deleteResult: DeleteResult; insertResult: InsertResult; updateResult: UpdateResult } }>> {
    Logger.log('Scrape All Entries : Start');
    const categories = await this.categoriesService.findAll();
    const results = [];
    for(const [index, category] of Object.entries(categories)) {
      Logger.log(`  [${index}] ${category.name} : Start`);
      const result = await this.scrapeEntries(category.id, category.pageUrl);
      results.push({ category, result });
      Logger.log(`  [${index}] ${category.name} : Succeeded`);
    }
    Logger.log('Scrape All Entries : Succeeded');
    return results;
  }
  
  /**
   * 指定のカテゴリについてスクレイピングして更新する
   * 
   * @param categoryId カテゴリ ID
   * @param pageUrl ページ URL (引数で渡されていない場合は内部で SELECT する)
   * @return 更新結果 (`entries` テーブルの一括削除結果・一括登録結果・`categories` テーブルの更新結果)
   */
  public async scrapeEntries(categoryId: number, pageUrl?: string): Promise<{ deleteResult: DeleteResult; insertResult: InsertResult; updateResult: UpdateResult }> {
    let deleteResult = new DeleteResult();  // 型で文句言われるからとりあえず作っておく
    let insertResult = new InsertResult();  // 型で文句言われるからとりあえず作っておく
    let updateResult = new UpdateResult();  // 型で文句言われるからとりあえず作っておく
    await this.dataSource.transaction(async () => {
      Logger.log(`Scrape Entries : Transaction Start : [${categoryId}] ${pageUrl ?? 'Unknown'}`);
      
      // 引数でページ URL が渡されていない場合は取得する
      if(pageUrl == null) {
        const category = await this.categoriesService.findById(categoryId);
        pageUrl = category.pageUrl;
        Logger.log(`Scrape Entries : Get Page URL : [${categoryId}] ${pageUrl}`);
      }
      
      const html = await this.crawlPage(pageUrl);              // クロールする
      const $ = this.convertHtmlToJQueryLikeObject(html);      // jQuery ライクに変換する
      const entries = this.transformToEntries(categoryId, $);  // 抽出する
      deleteResult = await this.bulkRemove(categoryId);                         // 先に一括削除する
      insertResult = await this.bulkCreate(entries);                            // 一括登録する
      updateResult = await this.categoriesService.updateUpdatedAt(categoryId);  // カテゴリの最終クロール日時も更新する
    });
    Logger.log(`Scrape Entries : Transaction End : [${categoryId}] ${pageUrl}`);  // eslint-disable-line @typescript-eslint/restrict-template-expressions
    return { deleteResult, insertResult, updateResult };
  }
  
  /**
   * 指定のページをクロールし HTML を取得する
   * 
   * @param pageUrl ページ URL
   * @return レスポンステキスト (HTML)
   */
  private async crawlPage(pageUrl: string): Promise<string> {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    const response = await fetch(pageUrl, {
      headers: {  // UA を偽装しないと 503 ページに飛ばされるので Windows Chrome の UA を利用する
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
      }
    });
    const responseText: string = await response.text();
    /* eslint-enable */
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
      const linkElem = $(element).find('.entrylist-contents-title a');
      const title = linkElem.attr('title');
      const url = linkElem.attr('href');
      const description = $(element).find('.entrylist-contents-description').text();
      const count = $(element).find('.entrylist-contents-users span').text();
      const date = $(element).find('.entrylist-contents-date').text();  // `YYYY/MM/DD HH:mm`
      const faviconUrl = $(element).find('.entrylist-contents-domain img').attr('src');
      const thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`  // eslint-disable-line @typescript-eslint/restrict-template-expressions
        .replace('background-image:url(\'', '')
        .replace('\');', '')
        .replace((/^undefined$/), '');  // サムネイルがない記事は `span` 要素がなく最終的な文字列が `undefined` になるので空文字に修正する
      // 記事オブジェクトとして追加する : 最終クロール日時は自動挿入される
      const entry = new Entry({ categoryId, title, url, description, count, date, faviconUrl, thumbnailUrl });
      entries.push(entry);
    });
    return entries;
  }
  
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
