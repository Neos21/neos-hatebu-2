import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  public async findAll(): Promise<{ ngUrls: Array<NgUrl>; ngWords: Array<NgWords>; ngDomains: Array<NgDomain> }> {
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
      this.ngUrls = await this.httpClient.get(`/ng-urls`).toPromise();  // TODO
    }
    return this.ngUrls;
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
      this.ngWords = await this.httpClient.get(`/ng-words`).toPromise();  // TODO
    }
    return this.ngWords;
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
      this.ngDomains = await this.httpClient.get(`/ng-domains`).toPromise();  // TODO
    }
    return this.ngDomains;
  }
}
