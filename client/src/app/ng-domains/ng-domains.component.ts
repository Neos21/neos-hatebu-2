import { Component, OnInit } from '@angular/core';
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
export class NgDomainsComponent implements OnInit {
  /** 追加欄 */
  public form!: FormGroup;
  /** 画面データの状態管理オブジェクト */
  private dataState$ = new BehaviorSubject<{ error?: Error | any }>({
                                             error : null });
  /** ローディング中か否か */
  public readonly isLoading$ = this.dataState$.pipe(map(dataState => this.ngDomains$ == null && dataState.error == null));
  /** NG ドメイン一覧 */
  public readonly ngDomains$ = this.ngDataService.ngDomains$;
  /** エラー */
  public readonly error$     = this.dataState$.pipe(map(dataState => dataState.error));
  
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
      await this.ngDataService.findNgDomains(true);  // 強制再読込する
    }
    catch(error) {
      console.error('NgDomainsComponent#fetchAll() : Failed', error);
      this.dataState$.next({ error });
    }
  }
  
  public async create(): Promise<void> {
    try {
      // プロトコル部分があれば除去しておく
      const domain = `${this.form.value.domain}`.trim().replace(/^https?:\/\//, '');
      if(this.ngDomains$.getValue().some(ngDomain => ngDomain.domain === domain)) {
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
  
  public async remove(id: number): Promise<void> {
    try {
      await this.ngDataService.removeNgDomain(id);
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
}
