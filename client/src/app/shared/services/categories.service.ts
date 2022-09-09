import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category } from '../classes/category';

/** カテゴリサービス */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  /** カテゴリ一覧のキャッシュ */
  public readonly categories$ = new BehaviorSubject<Array<Category> | null>(null);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * カテゴリ一覧を取得する
   * 
   * @param isForce `true` を指定したら強制再取得する
   * @return カテゴリ一覧とそれぞれに紐付く記事一覧
   */
  public async findAll(isForce?: boolean): Promise<Array<Category>> {
    if(!isForce) {
      const cachedCategories = this.categories$.getValue();
      if(cachedCategories != null) return cachedCategories;  // キャッシュを返す
    }
    // キャッシュがなければ取得してキャッシュする
    const categories = await firstValueFrom(this.httpClient.get<Array<Category>>(`${environment.serverUrl}/api/categories`));
    this.categories$.next(categories);
    return categories;
  }
  
  /**
   * 対象カテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param id カテゴリ ID
   * @param isForce `true` を指定したら強制再取得する
   * @return 指定のカテゴリ情報と記事一覧
   */
  public async findById(id: number, isForce?: boolean): Promise<Category> {
    let categories = this.categories$.getValue()!;
    if(categories == null) {  // 万が一データがなかったら取得してしまう
      categories = await this.findAll();
    }
    const targetIndex = categories.findIndex(category => category.id === id);
    if(targetIndex < 0) throw new Error('The category does not exist');
    if(!isForce) return categories[targetIndex];  // キャッシュを返す
    // 取得してキャッシュする
    const category = await firstValueFrom(this.httpClient.get<Category>(`${environment.serverUrl}/api/categories/${id}`));
    categories[targetIndex] = category;
    this.categories$.next(categories);
    return category;
  }
  
  /**
   * 全カテゴリの記事一覧を再スクレイピングしてカテゴリ一覧を再取得する
   * 
   * @return カテゴリ一覧
   */
  public async scrapeAll(): Promise<Array<Category>> {
    // 取得してキャッシュする
    const categories = await firstValueFrom(this.httpClient.post<Array<Category>>(`${environment.serverUrl}/api/categories`, {}));
    this.categories$.next(categories);
    return categories;
  }
  
  /**
   * 対象カテゴリの記事一覧を再スクレイピングして取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報と記事一覧
   */
  public async scrapeById(id: number): Promise<Category> {
    const categories = this.categories$.getValue()!;
    const targetIndex = categories.findIndex(category => category.id === id);
    if(targetIndex < 0) throw new Error('The category does not exist');
    // 取得してキャッシュする
    const category = await firstValueFrom(this.httpClient.post<Category>(`${environment.serverUrl}/api/categories/${id}`, {}));
    categories[targetIndex] = category;
    this.categories$.next(categories);
    return category;
  }
}
