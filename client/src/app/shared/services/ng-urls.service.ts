import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NgUrl } from '../classes/ng-url';

/** NG URL サービス */
@Injectable({ providedIn: 'root' })
export class NgUrlsService {
  /** NG URL のキャッシュ */
  public readonly ngUrls$ = new BehaviorSubject<Array<NgUrl> | null>(null);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * NG URL 一覧を取得する
   * 
   * @return NG URL 一覧
   */
  public async findAll(): Promise<Array<NgUrl>> {
    if(this.ngUrls$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      console.log('NgUrlsService#findAll() : Fetch');
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
  public async create(ngUrl: NgUrl): Promise<NgUrl> {
    const createdNgUrl = await firstValueFrom(this.httpClient.post<NgUrl>(`${environment.serverUrl}/api/ng-urls`, ngUrl));
    console.log('NgUrlsService#create() : Succeeded', createdNgUrl);
    
    // 登録後のエンティティをキャッシュに追加する
    const ngUrls = this.ngUrls$.getValue()!;
    ngUrls.push(createdNgUrl);
    this.ngUrls$.next(ngUrls);
    return createdNgUrl;
  }
}
