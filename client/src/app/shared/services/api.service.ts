import { Injectable } from '@angular/core';

import { NgUrl } from '../classes/ng-url';
import { Category } from '../classes/category';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';

import { CategoriesService } from './categories.service';
import { NgUrlsService } from './ng-urls.service';
import { NgWordsService } from './ng-words.service';
import { NgDomainsService } from './ng-domains.service';

/** API サービス */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    public readonly categories: CategoriesService,
    public readonly ngUrls: NgUrlsService,
    public readonly ngWords: NgWordsService,
    public readonly ngDomains: NgDomainsService
  ) { }
  
  /**
   * 全ての情報を取得する
   * 
   * @return カテゴリ一覧、NG URL 一覧、NG ワード一覧、NG ドメイン一覧
   */
  public async fetchAll(): Promise<{ categories: Array<Category>; ngUrls: Array<NgUrl>; ngWords: Array<NgWord>; ngDomains: Array<NgDomain> }> {
    const [categories, ngUrls, ngWords, ngDomains] = await Promise.all([
      this.categories.findAll(),
      this.ngUrls.findAll(),
      this.ngWords.findAll(),
      this.ngDomains.findAll()
    ]);
    return { categories, ngUrls, ngWords, ngDomains };
  }
  
  /** ログアウト用 : 全てのキャッシュを削除する */
  public removeAllCaches(): void {
    this.categories.categories$.next(null);
    this.ngUrls.ngUrls$.next(null);
    this.ngWords.ngWords$.next(null);
    this.ngDomains.ngDomains$.next(null);
  }
}
