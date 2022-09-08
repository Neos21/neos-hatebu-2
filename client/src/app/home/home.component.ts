import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, map, Subscription } from 'rxjs';

import { SharedStateService } from '../shared/services/shared-state.service';
import { ApiService } from '../shared/services/api.service';
import { Category } from '../shared/classes/category';

/** 記事一覧ページ */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
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
    console.log('HomeComponent#ngOnInit() : Init');
    this.queryParamMap$ = this.activatedRoute.queryParamMap.subscribe(params => {
      const categoryId = params.get(this.queryParamKey);
      console.log('HomeComponent#ngOnInit() : Category ID', categoryId);
      if(categoryId == null) return this.moveFirst();
      return this.show(Number(categoryId));
    });
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    console.log('HomeComponent#ngOnDestroy() : Destroy');
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
      category.entries = category.entries
        .filter(entry => !ngDomains.some(ngDomain => entry.url.toLowerCase().includes(ngDomain.domain.toLowerCase())))  // 大文字・小文字関係なくドメインを含んでいないこと
        .filter(entry => !ngWords.some(ngWord => `${entry.title}\n${entry.description}`.includes(ngWord.word)))  // TODO : タイトルと本文を対象にする・曖昧一致…
        .filter(entry => !ngUrls.some(ngUrl => entry.url.toLowerCase().includes(ngUrl.url.toLocaleLowerCase())));  // NG URL でないモノ
      this.category = category;
      this.sharedStateService.setPageTitle(category.name);
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      console.error('HomeComponent#show() : Failed', categoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /** 現在のカテゴリをスクレイピングして再表示する */
  public async reload(): Promise<void> {
    const categoryId = this.category!.id;  // 予め ID を取得しておく
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.api.categories.reloadById(categoryId);
      await this.show(categoryId);
    }
    catch(error) {
      console.error('HomeComponent#reload() : Failed', categoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /** 次のカテゴリを開く */
  public async moveNext(): Promise<void> {
    const categories = await this.api.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === this.category!.id);
    const nextCategory = categories[currentCategoryIndex + 1];
    this.movePage(nextCategory == null ? categories[0].id : nextCategory.id);  // 一つ後がなければ最初のカテゴリに移動する
  }
  
  /** 前のカテゴリを開く */
  public async movePrev(): Promise<void> {
    const categories = await this.api.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === this.category!.id);
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
    console.log(`HomeComponent#moveCategory() : Category ID [${categoryId}]`);
    this.router.navigate(['/home'], { queryParams: { [this.queryParamKey]: categoryId }});
  }
}
