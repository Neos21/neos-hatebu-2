import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, map, Subscription } from 'rxjs';

import { Logger } from '../shared/classes/logger';
import { Category } from '../shared/classes/category';
import { Entry } from '../shared/classes/entry';
import { NgUrl } from '../shared/classes/ng-url';

import { SharedStateService } from '../shared/services/shared-state.service';
import { ApiService } from '../shared/services/api.service';

/** 記事一覧ページ */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly logger = new Logger(HomeComponent.name);
  /** ページデータの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** クエリパラメータの購読 */
  private queryParamMap$!: Subscription;
  
  /** カテゴリ */
  public category?: Category;
  /** クエリパラメータのキー名 */
  private readonly queryParamKey = 'category_id';
  
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly sharedStateService: SharedStateService,
    private readonly api: ApiService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.queryParamMap$ = this.activatedRoute.queryParamMap.subscribe(params => {
      const categoryId = params.get(this.queryParamKey);
      this.logger.debug('#ngOnInit() : Category ID', categoryId);
      if(categoryId == null) return this.moveFirst();
      return this.show(Number(categoryId));
    });
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    this.logger.debug('#ngOnDestroy() : Destroy');
    this.dataState$.unsubscribe();
    this.queryParamMap$.unsubscribe();
  }
  
  /**
   * 指定のカテゴリ情報を取得し表示する
   * 
   * @param categoryId カテゴリ ID
   */
  public async show(categoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      const { categories, ngUrls, ngWords, ngDomains } = await this.api.fetchAll();  // フィルタに使用する NG 情報も確実に取得しておく
      const category = categories.find(category => category.id === categoryId);
      if(category == null) throw new Error('The category does not exist');
      
      // NG 情報のフィルタ処理
      category.entries = category.entries.filter(entry => {
        // NG ドメイン : 大文字・小文字関係なくドメインを含んでいないこと
        const lowerUrl = entry.url.toLowerCase();
        if(ngDomains.some(ngDomain => lowerUrl.includes(ngDomain.domain.toLowerCase()))) return false;
        // NG ワード : タイトルと本文を対象にする (TODO : 英数字の全半・ひらがな・カタカナ・半角カナを曖昧チェックしたい)
        if(ngWords.some(ngWord => `${entry.title}\n${entry.description}`.includes(ngWord.word))) return false;
        // NG URL
        if(ngUrls.some(ngUrl => lowerUrl.includes(ngUrl.url.toLowerCase()))) return false;
        // いずれにも一致しなかったら残す
        return true;
      });
      
      this.category = category;
      this.sharedStateService.setPageTitle(category.name);
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      this.logger.error('#show() : Failed', categoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 「削除する」ボタン押下時：選択された記事を NG URL に追加して削除する
   * 
   * @param viewIndex 表示中の添字 (`this.category.entries` の添字)
   * @param entry 削除する記事
   */
  public async removeEntry(viewIndex: number, entry: Entry): Promise<void> {
    try {
      // 先に表示上の記事を削除する
      this.category!.entries.splice(viewIndex, 1);
      // API コールして NG URL を追加する
      const ngUrl = new NgUrl({
        title       : entry.title,
        url         : entry.url,
        description : entry.description,
        count       : entry.count,
        date        : entry.date,
        faviconUrl  : entry.faviconUrl,
        thumbnailUrl: entry.thumbnailUrl
      });
      await this.api.ngUrls.create(ngUrl);
      try {
        (window.document.activeElement as any).blur();
      }
      catch(blurError) {
        this.logger.warn('#removeEntry() : Failed to blur', blurError);
      }
    }
    catch(error) {
      this.logger.warn('#removeEntry() : Failed', error);
      this.dataState$.next({ error });
    }
  }
  
  
  // 再読込 (キャッシュをクリアして再表示する)
  // ================================================================================
  
  /**
   * 全てのカテゴリを再読込して再表示する
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async reloadAll(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.api.categories.findAll(true);
      await this.show(currentCategoryId);
    }
    catch(error) {
      this.logger.error('#reloadAll() : Failed', currentCategoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 現在のカテゴリをスクレイピングして再表示する
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async reloadById(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.api.categories.findById(currentCategoryId, true);
      await this.show(currentCategoryId);
    }
    catch(error) {
      this.logger.error('#reloadById() : Failed', currentCategoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  
  // スクレイピング
  // ================================================================================
  
  /**
   * 全てのカテゴリをスクレイピングして再表示する
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async scrapeAll(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.api.categories.scrapeAll();
      await this.show(currentCategoryId);
    }
    catch(error) {
      this.logger.error('#scrapeAll() : Failed', currentCategoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 現在のカテゴリをスクレイピングして再表示する
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async scrapeById(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.api.categories.scrapeById(currentCategoryId);
      await this.show(currentCategoryId);
    }
    catch(error) {
      this.logger.error('#scrapeById() : Failed', currentCategoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  
  // カテゴリ移動
  // ================================================================================
  
  /**
   * 次のカテゴリを開く
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async moveNext(currentCategoryId: number): Promise<void> {
    const categories = await this.api.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === currentCategoryId);
    const nextCategory = categories[currentCategoryIndex + 1];
    this.movePage(nextCategory == null ? categories[0].id : nextCategory.id);  // 一つ後がなければ最初のカテゴリに移動する
  }
  
  /**
   * 前のカテゴリを開く
   * 
   * @param currentCategoryId カテゴリ ID
   */
  public async movePrev(currentCategoryId: number): Promise<void> {
    const categories = await this.api.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === currentCategoryId);
    const prevCategory = categories[currentCategoryIndex - 1];
    this.movePage(prevCategory == null ? categories[categories.length - 1].id : prevCategory.id);  // 一つ前がなければ最後のカテゴリに移動する
  }
  
  /** 最初のカテゴリを開く */
  private async moveFirst(): Promise<void> {
    const categories = await this.api.categories.findAll();
    const firstCategoryId = categories[0].id;
    this.movePage(firstCategoryId);
  }
  
  /**
   * 指定のカテゴリ ID のページを開く
   * 
   * @param categoryId カテゴリ ID
   */
  private movePage(categoryId: number): void {
    this.logger.debug(`#moveCategory() : Category ID [${categoryId}]`);
    this.router.navigate(['/home'], { queryParams: { [this.queryParamKey]: categoryId }});
  }
}
