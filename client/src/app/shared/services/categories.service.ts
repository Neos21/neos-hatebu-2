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
   * @return カテゴリ一覧とそれぞれに紐付く記事一覧
   */
  public async findAll(): Promise<Array<Category>> {
    if(this.categories$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      const categories = await firstValueFrom(this.httpClient.get<Array<Category>>(`${environment.serverUrl}/api/categories`));
      this.categories$.next(categories);
    }
    return this.categories$.getValue()!;
  }
  
  /**
   * 全カテゴリの記事一覧を再スクレイピングしてカテゴリ一覧を再取得する
   * 
   * @return カテゴリ一覧
   */
  public async reloadAll(): Promise<Array<Category>> {
    const categories = await firstValueFrom(this.httpClient.post<Array<Category>>(`${environment.serverUrl}/api/categories`, {}));
    this.categories$.next(categories);
    return this.categories$.getValue()!;
  }
  
  /**
   * 対象カテゴリの記事一覧を再スクレイピングして取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報と記事一覧
   */
  public async reloadById(id: number): Promise<Category> {
    const categories = this.categories$.getValue()!;
    const targetIndex = categories.findIndex(category => category.id === id);
    if(targetIndex < 0) throw new Error('The category does not exist');
    const category = await firstValueFrom(this.httpClient.post<Category>(`${environment.serverUrl}/api/categories/${id}`, {}));
    categories[targetIndex] = category;
    this.categories$.next(categories);
    return category;
  }
}
