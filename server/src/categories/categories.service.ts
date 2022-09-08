import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CheerioAPI, load } from 'cheerio';
import fetch from 'node-fetch';
import { DataSource, Repository } from 'typeorm';

import { Category } from '../entities/category';
import { Entry } from '../entities/entry';

/** カテゴリサービス */
@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger: Logger = new Logger(CategoriesService.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Entry) private readonly entriesRepository: Repository<Entry>,
  ) { }
  
  /** 本モジュール起動時にデータが存在しなければカテゴリマスタを投入する */
  public async onModuleInit(): Promise<void> {
    const countAll = await this.categoriesRepository.count();
    if(countAll === 0) {
      this.logger.warn('#onModuleInit() : Create categories for first time');
      await this.createCategories();
      await this.scrapeAllEntries();
    }
    else {
      this.logger.log('#onModuleInit() : Categories are already exist. Do nothing');
    }
  }
  
  /**
   * 全カテゴリを取得する・オプション未指定時は紐付く記事一覧も取得する
   * 
   * @param isExcludeEntries 紐付く記事一覧を取得しない場合は `true` (Repository の関数内に変数として与えると上手く切り分けられなかった)
   * @return 取得結果
   */
  public async findAll(isExcludeEntries?: boolean): Promise<Array<Category>> {
    if(isExcludeEntries) return await this.categoriesRepository.find({
      relations: { entries: false },  // 紐付く記事一覧を取得しない
      order: { id: 'ASC' }  // ID の昇順
    });
    return await this.categoriesRepository.find({
      relations: { entries: true },  // 紐付く記事一覧を取得する
      order: { id: 'ASC' }  // ID の昇順
    });
  }
  
  /**
   * 指定の ID とそれに紐付く記事一覧を取得する
   * 
   * @param id ID
   * @param isExcludeEntries 紐付く記事一覧を取得しない場合は `true` (Repository の関数内に変数として与えると上手く切り分けられなかった)
   * @return 取得結果
   */
  public async findById(id: number, isExcludeEntries?: boolean): Promise<Category> {
    if(isExcludeEntries) return await this.categoriesRepository.findOneOrFail({
      relations: { entries: false },  // 紐付く記事一覧を取得しない
      where: { id }  // ID 指定
    });
    return await this.categoriesRepository.findOneOrFail({
      relations: { entries: true },  // 紐付く記事一覧を取得する
      where: { id }  // ID 指定
    });
  }
  
  /** 全カテゴリについてスクレイピングして更新する */
  public async scrapeAllEntries(): Promise<void> {
    this.logger.log('#scrapeAllEntries() : Start');
    const categories = await this.findAll(true);  // カテゴリ情報のみ取得する
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
      this.logger.log(`#scrapeEntries() : Transaction start : [${categoryId}] ${pageUrl ?? 'Unknown'}`);
      // 引数でページ URL が渡されていない場合は取得する
      if(pageUrl == null) {
        const category = await this.findById(categoryId, true);  // カテゴリ情報のみ取得する
        pageUrl = category.pageUrl;
        this.logger.log(`#scrapeEntries() :   Get page URL : [${categoryId}] ${pageUrl}`);
      }
      
      const html          = await this.crawlPage(pageUrl);           // クロールする
      const $: CheerioAPI = load(html);                              // jQuery ライクに変換する
      const entries       = this.transformToEntries(categoryId, $);  // 抽出する
      await this.entriesRepository.delete({ categoryId });           // 先に一括削除する
      await this.entriesRepository.insert(entries);                  // 一括登録する
      await this.categoriesRepository.update(categoryId, {});        // 空更新することでカテゴリの最終クロール日時を現在日時で更新させる
      this.logger.log(`#scrapeEntries() : Transaction end : [${categoryId}] ${pageUrl}`);
    });
  }
  
  
  // 初期処理用
  // ================================================================================
  
  /** 初期データとしてカテゴリマスタを登録する */
  private async createCategories(): Promise<void> {
    this.logger.log('#createCategories() : Start');
    const categories = [
      new Category({ name: '総合 - 人気'          , rssUrl: 'http://b.hatena.ne.jp/hotentry.rss'               , pageUrl: 'http://b.hatena.ne.jp/hotentry/all'            }),
      new Category({ name: '総合 - 新着'          , rssUrl: 'http://b.hatena.ne.jp/entrylist.rss'              , pageUrl: 'http://b.hatena.ne.jp/entrylist/all'           }),
      new Category({ name: '一般 - 人気'          , rssUrl: 'http://b.hatena.ne.jp/hotentry/general.rss'       , pageUrl: 'http://b.hatena.ne.jp/hotentry/general'        }),
      new Category({ name: '一般 - 新着'          , rssUrl: 'http://b.hatena.ne.jp/entrylist/general.rss'      , pageUrl: 'http://b.hatena.ne.jp/entrylist/general'       }),
      new Category({ name: '世の中 - 人気'        , rssUrl: 'http://b.hatena.ne.jp/hotentry/social.rss'        , pageUrl: 'http://b.hatena.ne.jp/hotentry/social'         }),
      new Category({ name: '世の中 - 新着'        , rssUrl: 'http://b.hatena.ne.jp/entrylist/social.rss'       , pageUrl: 'http://b.hatena.ne.jp/entrylist/social'        }),
      new Category({ name: '政治と経済 - 人気'    , rssUrl: 'http://b.hatena.ne.jp/hotentry/economics.rss'     , pageUrl: 'http://b.hatena.ne.jp/hotentry/economics'      }),
      new Category({ name: '政治と経済 - 新着'    , rssUrl: 'http://b.hatena.ne.jp/entrylist/economics.rss'    , pageUrl: 'http://b.hatena.ne.jp/entrylist/economics'     }),
      new Category({ name: '暮らし - 人気'        , rssUrl: 'http://b.hatena.ne.jp/hotentry/life.rss'          , pageUrl: 'http://b.hatena.ne.jp/hotentry/life'           }),
      new Category({ name: '暮らし - 新着'        , rssUrl: 'http://b.hatena.ne.jp/entrylist/life.rss'         , pageUrl: 'http://b.hatena.ne.jp/entrylist/life'          }),
      new Category({ name: '学び - 人気'          , rssUrl: 'http://b.hatena.ne.jp/hotentry/knowledge.rss'     , pageUrl: 'http://b.hatena.ne.jp/hotentry/knowledge'      }),
      new Category({ name: '学び - 新着'          , rssUrl: 'http://b.hatena.ne.jp/entrylist/knowledge.rss'    , pageUrl: 'http://b.hatena.ne.jp/entrylist/knowledge'     }),
      new Category({ name: 'テクノロジー - 人気'  , rssUrl: 'http://b.hatena.ne.jp/hotentry/it.rss'            , pageUrl: 'http://b.hatena.ne.jp/hotentry/it'             }),
      new Category({ name: 'テクノロジー - 新着'  , rssUrl: 'http://b.hatena.ne.jp/entrylist/it.rss'           , pageUrl: 'http://b.hatena.ne.jp/entrylist/it'            }),
      new Category({ name: 'おもしろ - 人気'      , rssUrl: 'http://b.hatena.ne.jp/hotentry/fun.rss'           , pageUrl: 'http://b.hatena.ne.jp/hotentry/fun'            }),
      new Category({ name: 'おもしろ - 新着'      , rssUrl: 'http://b.hatena.ne.jp/entrylist/fun.rss'          , pageUrl: 'http://b.hatena.ne.jp/entrylist/fun'           }),
      new Category({ name: 'エンタメ - 人気'      , rssUrl: 'http://b.hatena.ne.jp/hotentry/entertainment.rss' , pageUrl: 'http://b.hatena.ne.jp/hotentry/entertainment'  }),
      new Category({ name: 'エンタメ - 新着'      , rssUrl: 'http://b.hatena.ne.jp/entrylist/entertainment.rss', pageUrl: 'http://b.hatena.ne.jp/entrylist/entertainment' }),
      new Category({ name: 'アニメとゲーム - 人気', rssUrl: 'http://b.hatena.ne.jp/hotentry/game.rss'          , pageUrl: 'http://b.hatena.ne.jp/hotentry/game'           }),
      new Category({ name: 'アニメとゲーム - 新着', rssUrl: 'http://b.hatena.ne.jp/entrylist/game.rss'         , pageUrl: 'http://b.hatena.ne.jp/entrylist/game'          })
    ];
    for(const [index, category] of Object.entries(categories)) {
      const insertResult = await this.categoriesRepository.insert(category);
      this.logger.log(`#createCategories() :   [${index}] ${category.name} : Inserted [${JSON.stringify(insertResult)}]`);
    }
    this.logger.log('#createCategories() : Succeeded');
  }
  
  
  // スクレイピング処理
  // ================================================================================
  
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
      const thumbnailUrl = `${$(element).find('.entrylist-contents-thumb span').attr('style')}`
        .replace('background-image:url(\'', '')
        .replace('\');', '')
        .replace((/^undefined$/), '');  // サムネイルがない記事は `span` 要素がなく最終的な文字列が `undefined` になるので空文字に修正する
      // 記事オブジェクトとして追加する : 最終クロール日時は自動挿入される
      entries.push(new Entry({ categoryId, title, url, description, count, date, faviconUrl, thumbnailUrl }));
    });
    return entries;
  }
}
