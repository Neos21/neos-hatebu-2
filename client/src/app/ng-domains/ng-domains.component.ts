import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, map } from 'rxjs';

import { NgDomain } from '../shared/classes/ng-domain';
import { SharedStateService } from '../shared/services/shared-state.service';
import { NgDomainsService } from '../shared/services/ng-domains.service';

/** NG ドメイン管理ページ */
@Component({
  selector: 'app-ng-domains',
  templateUrl: './ng-domains.component.html',
  styleUrls: ['./ng-domains.component.css']
})
export class NgDomainsComponent implements OnInit, OnDestroy {
  /** 登録フォーム */
  public form!: FormGroup;
  /** ページデータの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ドメイン一覧 */
  public readonly ngDomains$  = this.ngDomainsService.ngDomains$;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sharedStateService: SharedStateService,
    private readonly ngDomainsService: NgDomainsService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({
      domain: ['', [Validators.required]]
    });
    this.sharedStateService.setPageTitle('NG ドメイン管理');
    
    try {
      await this.ngDomainsService.findAll();
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      this.dataState$.next({ isLoading: false, error });
    }
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
  }
  
  /** 登録する */
  public async create(): Promise<void> {
    try {
      this.dataState$.next({});  // Clear Error
      
      // 小文字に統一する・プロトコル部分があれば除去しておく
      const domain = `${this.form.value.domain}`.trim().toLowerCase().replace(/^https?:\/\//, '');
      
      if(this.ngDomains$.getValue()!.some(ngDomain => ngDomain.domain === domain)) {
        this.dataState$.next({ error: `${domain} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngDomainsService.create(new NgDomain({ domain }));
      this.form.reset();
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   */
  public async remove(id: number): Promise<void> {
    try {
      this.dataState$.next({});  // Clear Error
      await this.ngDomainsService.remove(id);
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
}
