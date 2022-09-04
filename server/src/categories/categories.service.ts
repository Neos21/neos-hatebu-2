import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { Category } from '../entities/category';

/** カテゴリサービス */
@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger: Logger = new Logger(CategoriesService.name);
  constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>) { }
  
  /** 本モジュール起動時にデータが存在しなければカテゴリマスタを投入する */
  public async onModuleInit(): Promise<void> {
    const countAll = await this.countAll();
    if(countAll === 0) {
      this.logger.warn('#onModuleInit() : Create Categories For First Time');
      await this.createCategories();
    }
    else {
      this.logger.log('#onModuleInit() : Categories Are Already Exist. Do Nothing');
    }
  }
  
  /**
   * 全件取得する
   * 
   * @return 取得結果
   */
  public async findAll(): Promise<Array<Category>> {
    return await this.categoriesRepository.find({
      relations: { entries: false },  // カテゴリのみ取得して記事は取得しない
      order: { id: 'ASC' }  // ID の昇順
    });
  }
  
  /**
   * 指定の ID とそれに紐付く記事一覧を取得する
   * 
   * @param id ID
   * @return 取得結果
   */
  public async findById(id: number): Promise<Category> {
    return await this.categoriesRepository.findOneOrFail({
      where: { id: id },  // ID 指定
      relations: { entries: true }  // 紐付く記事一覧を取得する
    });
  }
  
  /**
   * 対象カテゴリの最終クロール日時を更新する
   * 
   * @param id ID
   * @return 更新結果
   */
  public async updateUpdatedAt(id: number): Promise<UpdateResult> {
    return await this.categoriesRepository.update(id, {});  // 空更新することで現在日時で更新させる
  }
  
  
  // 初期処理用
  // ================================================================================
  
  /**
   * テーブルの全レコード件数を取得する
   * 
   * @return レコード件数
   */
  private async countAll(): Promise<number> {
    return this.categoriesRepository.count();
  }
  
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
}
