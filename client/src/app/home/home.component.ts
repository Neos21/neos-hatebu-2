import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, map, Subscription } from 'rxjs';

import { SharedStateService } from '../shared/services/shared-state.service';
import { CategoriesService } from '../shared/services/categories.service';
import { NgDataService } from '../shared/services/ng-data.service';
import { Category } from '../shared/classes/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  /** 画面データの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$ = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$     = this.dataState$.pipe(map(dataState => dataState.error   ));
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
    private readonly categoriesService: CategoriesService,
    private readonly ngDataService: NgDataService
  ) { }
  
  /** 画面初期表示 */
  public async ngOnInit(): Promise<void> {
    console.log('HomeComponent#ngOnInit() : Init');
    this.queryParamMap$ = this.activatedRoute.queryParamMap.subscribe(async params => {
      const categoryId = params.get(this.queryParamKey);
      console.log('HomeComponent#ngOnInit() : Category ID', categoryId);
      if(categoryId == null) return await this.moveFirst();
      await this.show(Number(categoryId));
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
      const categories = await this.categoriesService.findAll();
      const category = categories.find(category => category.id === categoryId);
      if(category == null) throw new Error('The category does not exist');
      
      await this.filterCategory(category);
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      console.error('HomeComponent#show() : Failed', categoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  public async reload(): Promise<void> {
    const categoryId = this.category!.id;  // 予め ID を取得しておく
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      const category = await this.categoriesService.reloadById(categoryId);
      await this.filterCategory(category);
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      console.error('HomeComponent#reload() : Failed', categoryId, error);
      this.dataState$.next({ error });
    }
  }
  
  /** 次のカテゴリを開く */
  public async moveNext(): Promise<void> {
    const categories = await this.categoriesService.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === this.category!.id);
    const nextCategory = categories[currentCategoryIndex + 1];
    this.moveCategory(nextCategory == null ? categories[0].id : nextCategory.id);  // 一つ後がなければ最初のカテゴリに移動する
  }
  
  /** 前のカテゴリを開く */
  public async movePrev(): Promise<void> {
    const categories = await this.categoriesService.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === this.category!.id);
    const prevCategory = categories[currentCategoryIndex - 1];
    this.moveCategory(prevCategory == null ? categories[categories.length - 1].id : prevCategory.id);  // 一つ前がなければ最後のカテゴリに移動する
  }
  
  /** 最初のカテゴリを開く */
  private async moveFirst(): Promise<void> {
    const categories = await this.categoriesService.findAll();
    const firstCategoryId = categories[0].id;
    this.moveCategory(firstCategoryId);
  }
  
  /**
   * 指定のカテゴリ ID のページを開く
   * 
   * @param categoryId カテゴリ ID
   */
  private moveCategory(categoryId: number): void {
    console.log('HomeComponent#moveCategory() : Category ID', categoryId);
    this.router.navigate(['/home'], { queryParams: { [this.queryParamKey]: categoryId }});
  }
  
  /**
   * カテゴリをフィルタリングして表示する
   * 
   * @param category カテゴリ
   */
  private async filterCategory(category: Category): Promise<void> {
    const { ngUrls, ngWords, ngDomains } = await this.ngDataService.findAll();
    category.entries = category.entries
      .filter(entry => !ngDomains.some(ngDomain => entry.url.toLowerCase().includes(ngDomain.domain.toLowerCase())))  // 大文字・小文字関係なくドメインを含んでいないこと
      .filter(entry => !ngWords.some(ngWord => `${entry.title}\n${entry.description}`.includes(ngWord.word)))  // TODO : タイトルと本文を対象にする・曖昧一致…
      .filter(entry => !ngUrls.some(ngUrl => entry.url.toLowerCase().includes(ngUrl.url.toLocaleLowerCase())));  // NG URL でないモノ
    this.category = category;
    this.sharedStateService.setPageTitle(category.name);
  }
}
