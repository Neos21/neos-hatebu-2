import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NgUrl } from '../classes/ng-url';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';

/** NG ドメインサービス */
@Injectable({ providedIn: 'root' })
export class NgDomainsService {
  /** NG ドメインのキャッシュ */
  public readonly ngDomains$ = new BehaviorSubject<Array<NgDomain> | null>(null);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * NG ドメイン一覧を取得する
   * 
   * @return NG ドメイン一覧
   */
  public async findAll(): Promise<Array<NgDomain>> {
    if(this.ngDomains$.getValue() == null) {  // キャッシュがなければ取得してキャッシュする
      console.log('NgDomainsService#findAll() : Fetch');
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
  public async create(ngDomain: NgDomain): Promise<NgDomain> {
    const createdNgDomain = await firstValueFrom(this.httpClient.post<NgDomain>(`${environment.serverUrl}/api/ng-domains`, ngDomain));
    console.log('NgDomainsService#create() : Succeeded', createdNgDomain);
    
    // 登録後のエンティティをキャッシュに追加する
    const ngDomains = this.ngDomains$.getValue()!;
    ngDomains.push(createdNgDomain);
    this.ngDomains$.next(ngDomains);
    return createdNgDomain;
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param id 削除対象 ID
   */
  public async remove(id: number): Promise<void> {
    const ngDomains = this.ngDomains$.getValue()!;
    const removedIndex = ngDomains.findIndex(ngDomain => ngDomain.id === id);
    if(removedIndex < 0) throw new Error('The NgDomain ID does not exist');
    
    await firstValueFrom(this.httpClient.delete(`${environment.serverUrl}/api/ng-domains/${id}`));
    console.log('NgDomainsService#remove() : Succeeded', id);
    
    // 削除したエンティティをキャッシュから削除する
    ngDomains.splice(removedIndex, 1);
    this.ngDomains$.next(ngDomains);
  }
}
