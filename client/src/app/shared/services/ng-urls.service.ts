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
   * @param isForce `true` を指定したら強制再取得する
   * @return NG URL 一覧
   */
  public async findAll(isForce?: boolean): Promise<Array<NgUrl>> {
    if(!isForce) {
      const cachedNgUrls = this.ngUrls$.getValue();
      if(cachedNgUrls != null) return cachedNgUrls;  // キャッシュを返す
    }
    // キャッシュがなければ取得してキャッシュする
    const ngUrls = await firstValueFrom(this.httpClient.get<Array<NgUrl>>(`${environment.serverUrl}/api/ng-urls`));
    this.ngUrls$.next(ngUrls);
    return ngUrls;
  }
  
  /**
   * NG URL を登録する
   * 
   * @param ngUrl NG URL
   * @return 登録された NG URL
   */
  public async create(ngUrl: NgUrl): Promise<NgUrl> {
    const createdNgUrl = await firstValueFrom(this.httpClient.post<NgUrl>(`${environment.serverUrl}/api/ng-urls`, ngUrl));
    // 登録後のエンティティをキャッシュに追加する
    const ngUrls = this.ngUrls$.getValue()!;
    ngUrls.unshift(createdNgUrl);  // 配列の先頭に追加する
    this.ngUrls$.next(ngUrls);
    return createdNgUrl;
  }
}
