import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NgUrl } from '../classes/ng-url';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';

/** NG 情報サービス */
@Injectable({ providedIn: 'root' })
export class NgDataService {
  /** NG URL のキャッシュ */
  public readonly ngUrls$ = new BehaviorSubject<Array<NgUrl> | null>(null);
  /** NG ワードのキャッシュ */
  public readonly ngWords$ = new BehaviorSubject<Array<NgWord> | null>(null);
  /** NG ドメインのキャッシュ */
  public readonly ngDomains$ = new BehaviorSubject<Array<NgDomain> | null>(null);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /** NG 情報をまとめて取得する */
  public async findAll(): Promise<{ ngUrls: Array<NgUrl>; ngWords: Array<NgWord>; ngDomains: Array<NgDomain> }> {
    const [ngUrls, ngWords, ngDomains] = await Promise.all([
      this.findNgUrls(),
      this.findNgWords(),
      this.findNgDomains()
    ]);
    return { ngUrls, ngWords, ngDomains };
  }
  
  
  // NG URL
  // ================================================================================
  
  /**
   * NG URL 一覧を取得する
   * 
   * @return NG URL 一覧
   */
  public async findNgUrls(): Promise<Array<NgUrl>> {
    if(this.ngUrls$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      console.log('NgDataService#findNgUrls() : Fetch');
      const ngUrls = await firstValueFrom(this.httpClient.get<Array<NgUrl>>(`${environment.serverUrl}/api/ng-urls`));
      this.ngUrls$.next(ngUrls);
    }
    return this.ngUrls$.getValue()!;
  }
  
  /**
   * NG URL を登録する
   * 
   * @param ngUrl NG URL
   * @return 登録された NG URL
   */
  public async createNgUrl(ngUrl: NgUrl): Promise<NgUrl> {
    const createdNgUrl = await firstValueFrom(this.httpClient.post<NgUrl>(`${environment.serverUrl}/api/ng-urls`, ngUrl));
    console.log('NgDataService#createNgUrl() : Succeeded', createdNgUrl);
    // 登録後のエンティティをキャッシュに追加する
    const ngUrls = this.ngUrls$.getValue()!;
    ngUrls.push(createdNgUrl);
    this.ngUrls$.next(ngUrls);
    return createdNgUrl;
  }
  
  
  // NG ワード
  // ================================================================================
  
  /**
   * NG ワード一覧を取得する
   * 
   * @return NG ワード一覧
   */
  public async findNgWords(): Promise<Array<NgWord>> {
    if(this.ngWords$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      console.log('NgDataService#findNgWords() : Fetch');
      const ngWords = await firstValueFrom(this.httpClient.get<Array<NgWord>>(`${environment.serverUrl}/api/ng-words`));
      this.ngWords$.next(ngWords);
    }
    return this.ngWords$.getValue()!;
  }
  
  /**
   * NG ワードを登録する
   * 
   * @param ngWord NG ワード
   * @return 登録された NG ワード
   */
  public async createNgWord(ngWord: NgWord): Promise<NgWord> {
    const createdNgWord = await firstValueFrom(this.httpClient.post<NgWord>(`${environment.serverUrl}/api/ng-words`, ngWord));
    console.log('NgDataService#createNgWord() : Succeeded', createdNgWord);
    // 登録後のエンティティをキャッシュに追加する
    const ngWords = this.ngWords$.getValue()!;
    ngWords.push(createdNgWord);
    this.ngWords$.next(ngWords);
    return createdNgWord;
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param ngWordId 削除対象の NG ワード ID
   */
  public async removeNgWord(ngWordId: number): Promise<void> {
    const ngWords = this.ngWords$.getValue()!;
    const removedIndex = ngWords.findIndex(ngWord => ngWord.id === ngWordId);
    if(removedIndex < 0) throw new Error('The NgWord ID does not exist');
    await firstValueFrom(this.httpClient.delete(`${environment.serverUrl}/api/ng-words/${ngWordId}`));
    // 削除したエンティティをキャッシュから削除する
    ngWords.splice(removedIndex, 1);
    this.ngWords$.next(ngWords);
  }
  
  
  // NG ドメイン
  // ================================================================================
  
  /**
   * NG ドメイン一覧を取得する
   * 
   * @return NG ドメイン一覧
   */
  public async findNgDomains(): Promise<Array<NgDomain>> {
    if(this.ngDomains$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      console.log('NgDataService#findNgDomains() : Fetch');
      const ngDomains = await firstValueFrom(this.httpClient.get<Array<NgDomain>>(`${environment.serverUrl}/api/ng-domains`));
      this.ngDomains$.next(ngDomains);
    }
    return this.ngDomains$.getValue()!;
  }
  
  /**
   * NG ドメインを登録する
   * 
   * @param ngDomain NG ドメイン
   * @return 登録された NG ドメイン
   */
  public async createNgDomain(ngDomain: NgDomain): Promise<NgDomain> {
    const createdNgDomain = await firstValueFrom(this.httpClient.post<NgDomain>(`${environment.serverUrl}/api/ng-domains`, ngDomain));
    console.log('NgDataService#createNgDomain() : Succeeded', createdNgDomain);
    // 登録後のエンティティをキャッシュに追加する
    const ngDomains = this.ngDomains$.getValue()!;
    ngDomains.push(createdNgDomain);
    this.ngDomains$.next(ngDomains);
    return createdNgDomain;
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param ngDomainId 削除対象の NG ドメイン ID
   */
  public async removeNgDomain(ngDomainId: number): Promise<void> {
    const ngDomains = this.ngDomains$.getValue()!;
    const removedIndex = ngDomains.findIndex(ngDomain => ngDomain.id === ngDomainId);
    if(removedIndex < 0) throw new Error('The NgDomain ID does not exist');
    await firstValueFrom(this.httpClient.delete(`${environment.serverUrl}/api/ng-domains/${ngDomainId}`));
    // 削除したエンティティをキャッシュから削除する
    ngDomains.splice(removedIndex, 1);
    this.ngDomains$.next(ngDomains);
  }
}
