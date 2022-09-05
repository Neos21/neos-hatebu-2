import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category } from '../classes/category';

/** カテゴリサービス */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  /** カテゴリ一覧のキャッシュ */
  public categories: Array<Category> = [];
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * カテゴリ一覧を取得する
   * 
   * @return カテゴリ一覧
   */
  public async findAll(): Promise<Array<Category>> {
    if(this.categories.length === 0) {  // キャッシュがなければ取得してキャッシュする
      this.categories = await firstValueFrom(this.httpClient.get<Array<Category>>(`${environment.serverUrl}/api/categories`));
    }
    return this.categories;
  }
  
  /**
   * 対象カテゴリの記事一覧を取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報と記事一覧
   */
  public async findById(id: number): Promise<Category> {
    const targetIndex = this.categories.findIndex((category) => category.id === id);
    if(targetIndex < 0) throw new Error('Category not found');  // カテゴリ一覧から指定のカテゴリ ID が見つからなかった
    // キャッシュがなければ取得してキャッシュする
    if(this.categories[targetIndex].entries == null || this.categories[targetIndex].entries.length !== 0) {
      this.categories[targetIndex] = await firstValueFrom(this.httpClient.get<Category>(`${environment.serverUrl}/api/categories/${id}`));
    }
    return this.categories[targetIndex];
  }
  
  /**
   * 全カテゴリの記事一覧を再スクレイピングしてカテゴリ一覧を再取得する (配下の記事一覧も消えるので必要な場合は別途取得する)
   * 
   * @return カテゴリ一覧
   */
  public async reloadAll(): Promise<Array<Category>> {
    this.categories = await firstValueFrom(this.httpClient.post<Array<Category>>(`${environment.serverUrl}/api/categories`, {}));
    return this.categories;
  }
  
  /**
   * 対象カテゴリの記事一覧を再スクレイピングして取得する
   * 
   * @param id カテゴリ ID
   * @return 指定のカテゴリ情報と記事一覧
   */
  public async reloadById(id: number): Promise<Category> {
    const targetIndex = this.categories.findIndex((category) => category.id === id);
    if(targetIndex < 0) throw new Error('Category not found');  // カテゴリ一覧から指定のカテゴリ ID が見つからなかった
    this.categories[targetIndex] = await firstValueFrom(this.httpClient.post<Category>(`${environment.serverUrl}/api/categories/${id}`, {}));
    return this.categories[targetIndex];
  }
}
