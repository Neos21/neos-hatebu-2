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
  public readonly ngUrls$ = new BehaviorSubject<Array<NgUrl>>([]);
  /** NG ワードのキャッシュ */
  public readonly ngWords$ = new BehaviorSubject<Array<NgWord>>([]);
  /** NG ドメインのキャッシュ */
  public readonly ngDomains$ = new BehaviorSubject<Array<NgDomain>>([]);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /** NG 情報をまとめて取得する : 全て強制再取得する */
  public async findAll(): Promise<void> {
    await Promise.all([
      this.findNgUrls(true),
      this.findNgWords(true),
      this.findNgDomains(true)
    ]);
  }
  
  
  // NG URL
  // ================================================================================
  
  /**
   * NG URL 一覧を取得する
   * 
   * @param isForceGet `true` を指定するとキャッシュを使わず強制再取得する
   * @return NG URL 一覧
   */
  public async findNgUrls(isForceGet?: boolean): Promise<Array<NgUrl>> {
    if(isForceGet || this.ngUrls$.getValue().length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      const ngUrls = await firstValueFrom(this.httpClient.get<Array<NgUrl>>(`${environment.serverUrl}/api/ng-urls`));
      this.ngUrls$.next(ngUrls);
    }
    return this.ngUrls$.getValue();
  }
  
  /**
   * NG URL を登録する
   * 
   * @param ngUrl NG URL
   */
  public async createNgUrl(ngUrl: NgUrl): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.post(`${environment.serverUrl}/api/ng-urls`, ngUrl));
      console.log('NgDataService#createNgUrl() : Succeeded', result);
      // TODO : 登録後のエンティティをキャッシュに追加する
    }
    catch(error) {
      console.warn('NgDataService#createNgUrl() : Failed', error);  // エラーは伝搬させない
    }
  }
  
  
  // NG ワード
  // ================================================================================
  
  /**
   * NG ワード一覧を取得する
   * 
   * @param isForceGet `true` を指定するとキャッシュを使わず強制再取得する
   * @return NG ワード一覧
   */
  public async findNgWords(isForceGet?: boolean): Promise<Array<NgWord>> {
    if(isForceGet || this.ngWords$.getValue().length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      const ngWords = await firstValueFrom(this.httpClient.get<Array<NgWord>>(`${environment.serverUrl}/api/ng-words`));
      this.ngWords$.next(ngWords);
    }
    return this.ngWords$.getValue();
  }
  
  /**
   * NG ワードを登録する
   * 
   * @param ngWord NG ワード
   */
  public async createNgWord(ngWord: NgWord): Promise<void> {
    const createdNgWord = await firstValueFrom(this.httpClient.post<NgWord>(`${environment.serverUrl}/api/ng-words`, ngWord));
    // 登録後のエンティティをキャッシュに追加する
    const ngWords = this.ngWords$.getValue();
    ngWords.push(createdNgWord);
    this.ngWords$.next(ngWords);
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param ngWordId 削除対象の NG ワード ID
   */
  public async removeNgWord(ngWordId: number): Promise<void> {
    const removedIndex = this.ngWords$.getValue().findIndex(ngWord => ngWord.id === ngWordId);
    if(removedIndex < 0) throw new Error('The NgWord ID does not exist');
    const result = await firstValueFrom(this.httpClient.delete<NgWord>(`${environment.serverUrl}/api/ng-words/${ngWordId}`));
    // 削除したエンティティをキャッシュから削除する
    const ngWords = this.ngWords$.getValue();
    ngWords.splice(removedIndex, 1);
    this.ngWords$.next(ngWords);
  }
  
  
  // NG ドメイン
  // ================================================================================
  
  /**
   * NG ドメイン一覧を取得する
   * 
   * @param isForceGet `true` を指定するとキャッシュを使わず強制再取得する
   * @return NG ドメイン一覧
   */
  public async findNgDomains(isForceGet?: boolean): Promise<Array<NgDomain>> {
    if(isForceGet || this.ngDomains$.getValue().length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      const ngDomains = await firstValueFrom(this.httpClient.get<Array<NgDomain>>(`${environment.serverUrl}/api/ng-domains`));
      this.ngDomains$.next(ngDomains);
    }
    return this.ngDomains$.getValue();
  }
  
  /**
   * NG ドメインを登録する
   * 
   * @param ngDomain NG ドメイン
   */
  public async createNgDomain(ngDomain: NgDomain): Promise<void> {
    const createdNgDomain = await firstValueFrom(this.httpClient.post<NgDomain>(`${environment.serverUrl}/api/ng-domains`, ngDomain));
    console.log('NgDataService#createNgDomain() : Succeeded', createdNgDomain);
    // 登録後のエンティティをキャッシュに追加する
    const ngDomains = this.ngDomains$.getValue();
    ngDomains.push(createdNgDomain);
    this.ngDomains$.next(ngDomains);
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param ngDomainId 削除対象の NG ドメイン ID
   */
  public async removeNgDomain(ngDomainId: number): Promise<void> {
    const removedIndex = this.ngDomains$.getValue().findIndex(ngDomain => ngDomain.id === ngDomainId);
    if(removedIndex < 0) throw new Error('The NgDomain ID does not exist');
    const result = await firstValueFrom(this.httpClient.delete<NgDomain>(`${environment.serverUrl}/api/ng-domains/${ngDomainId}`));
    // 削除したエンティティをキャッシュから削除する
    const ngDomains = this.ngDomains$.getValue();
    ngDomains.splice(removedIndex, 1);
    this.ngDomains$.next(ngDomains);
  }
}
