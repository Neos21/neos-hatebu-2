import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, map } from 'rxjs';

import { SharedStateService } from '../shared/services/shared-state.service';
import { NgDataService } from '../shared/services/ng-data.service';
import { NgDomain } from '../shared/classes/ng-domain';

/** NG ドメイン管理画面 */
@Component({
  selector: 'app-ng-domains',
  templateUrl: './ng-domains.component.html',
  styleUrls: ['./ng-domains.component.css']
})
export class NgDomainsComponent implements OnInit, OnDestroy {
  /** 登録欄 */
  public form!: FormGroup;
  /** 画面データの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$ = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$     = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ドメイン一覧 */
  public readonly ngDomains$ = this.ngDataService.ngDomains$;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sharedStateService: SharedStateService,
    private readonly ngDataService: NgDataService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.sharedStateService.setPageTitle('NG ドメイン管理');
    this.form = this.formBuilder.group({
      domain: ['', [Validators.required]]
    });
    
    try {
      await this.ngDataService.findNgDomains();
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      console.error('NgDomainsComponent#ngOnInit() : Failed', error);
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
      
      // プロトコル部分があれば除去しておく
      const domain = `${this.form.value.domain}`.trim().replace(/^https?:\/\//, '');
      
      if(this.ngDomains$.getValue()!.some(ngDomain => ngDomain.domain === domain)) {
        this.dataState$.next({ error: `${domain} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngDataService.createNgDomain(new NgDomain({ domain }));
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
      await this.ngDataService.removeNgDomain(id);
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
}
