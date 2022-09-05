import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NgUrl } from '../classes/ng-url';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';

/** NG 情報サービス */
@Injectable({ providedIn: 'root' })
export class NgDataService {
  /** NG URL のキャッシュ */
  public ngUrls   : Array<NgUrl   > = [];
  /** NG ワードのキャッシュ */
  public ngWords  : Array<NgWord  > = [];
  /** NG ドメインのキャッシュ */
  public ngDomains: Array<NgDomain> = [];
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * NG 情報をまとめて取得する : 全て強制再取得する
   * 
   * @return NG URL・NG ワード・NG ドメインの一覧
   */
  public async findAll(): Promise<{ ngUrls: Array<NgUrl>; ngWords: Array<NgWord>; ngDomains: Array<NgDomain> }> {
    const [ngUrls, ngWords, ngDomains] = await Promise.all([
      this.findNgUrls(true),
      this.findNgWords(true),
      this.findNgDomains(true)
    ]);
    this.ngUrls    = ngUrls;
    this.ngWords   = ngWords;
    this.ngDomains = ngDomains;
    return { ngUrls, ngWords, ngDomains };
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
    if(isForceGet || this.ngUrls.length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      this.ngUrls = await firstValueFrom(this.httpClient.get<Array<NgUrl>>(`${environment.serverUrl}/api/ng-urls`));
    }
    return this.ngUrls;
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
    if(isForceGet || this.ngWords.length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      this.ngWords = await firstValueFrom(this.httpClient.get<Array<NgWord>>(`${environment.serverUrl}/api/ng-words`));
    }
    return this.ngWords;
  }
  
  /**
   * NG ワードを登録する
   * 
   * @param ngWord NG ワード
   */
  public async createNgWord(ngWord: NgWord): Promise<void> {
    const createdNgWord = await firstValueFrom(this.httpClient.post<NgWord>(`${environment.serverUrl}/api/ng-words`, ngWord));
    console.log('NgDataService#createNgWord() : Succeeded', createdNgWord);
    // 参照渡しで利用している画面側に反映されるよう配列操作する
    this.ngWords.push(createdNgWord);
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param ngWordId 削除対象の NG ワード ID
   */
  public async removeNgWord(ngWordId: number): Promise<void> {
    const removedIndex = this.ngWords.findIndex((ngWord) => ngWord.id === ngWordId);
    if(removedIndex < 0) throw new Error('Invalid NgWord ID');
    
    const result = await firstValueFrom(this.httpClient.delete<NgWord>(`${environment.serverUrl}/api/ng-words/${ngWordId}`));
    console.log('NgDataService#removeNgWord() : Succeeded', result);
    // 参照渡しで利用している画面側に反映されるよう配列操作する
    this.ngWords.splice(removedIndex, 1);
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
    if(isForceGet || this.ngDomains.length === 0) {  // 強制再取得モードかキャッシュがなければ取得する
      this.ngDomains = await firstValueFrom(this.httpClient.get<Array<NgDomain>>(`${environment.serverUrl}/api/ng-domains`));
    }
    return this.ngDomains;
  }
  
  /**
   * NG ドメインを登録する
   * 
   * @param ngDomain NG ドメイン
   */
  public async createNgDomain(ngDomain: NgDomain): Promise<void> {
    const createdNgDomain = await firstValueFrom(this.httpClient.post<NgDomain>(`${environment.serverUrl}/api/ng-domains`, ngDomain));
    console.log('NgDataService#createNgDomain() : Succeeded', createdNgDomain);
    // 参照渡しで利用している画面側に反映されるよう配列操作する
    this.ngDomains.push(createdNgDomain);
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param ngDomainId 削除対象の NG ドメイン ID
   */
  public async removeNgDomain(ngDomainId: number): Promise<void> {
    const removedIndex = this.ngDomains.findIndex((ngDomain) => ngDomain.id === ngDomainId);
    if(removedIndex < 0) throw new Error('Invalid NgDomain ID');
    
    const result = await firstValueFrom(this.httpClient.delete<NgDomain>(`${environment.serverUrl}/api/ng-domains/${ngDomainId}`));
    console.log('NgDataService#removeNgDomain() : Succeeded', result);
    // 参照渡しで利用している画面側に反映されるよう配列操作する
    this.ngDomains.splice(removedIndex, 1);
  }
}
