import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { Category } from '../entities/category';

/** カテゴリサービス */
@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoriesRepository: Repository<Category>) { }
  
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
  public async findById(id: number): Promise<Category | null> {
    return await this.categoriesRepository.findOneBy({ id: id });
  }
  
  
  // 初期処理用
  // ================================================================================
  
  /** 初期データとしてカテゴリマスタを登録する */
  public async createCategories(): Promise<void> {
    Logger.log('Create Categories : Start');
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
      const insertResult = await this.create(category);
      Logger.log(`  [${index}] ${category.name} : Inserted`, insertResult);
    }
    Logger.log('Create Categories : Succeeded');
  }
  
  /**
   * 登録する
   * 
   * @param category 登録する内容
   * @return 登録結果
   */
  private async create(category: Category): Promise<InsertResult> {
    return await this.categoriesRepository.insert(category);
  }
  
  
  // バッチ処理用
  // ================================================================================
  
  /**
   * 対象カテゴリの最終クロール日時を更新する
   * 
   * @param id ID
   * @return 更新結果
   */
  public async updateUpdatedAt(id: number): Promise<UpdateResult> {
    return await this.categoriesRepository.update(id, { updatedAt: 'TODO' });  // TODO : 現在日時に更新する
  }
}
