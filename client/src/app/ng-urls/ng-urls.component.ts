import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, map } from 'rxjs';

import { NgUrl } from '../shared/classes/ng-url';

import { SharedStateService } from '../shared/services/shared-state.service';
import { NgUrlsService } from '../shared/services/ng-urls.service';

/** NG URL 確認ページ */
@Component({
  selector: 'app-ng-urls',
  templateUrl: './ng-urls.component.html',
  styleUrls: ['./ng-urls.component.css']
})
export class NgUrlsComponent implements OnInit, OnDestroy {
  /** ページデータの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$      = this.dataState$.pipe(map(dataState => dataState.error));
  
  /** NG URL 一覧 */
  public ngUrls: Array<NgUrl> = [];
  /** 全件を表示するか否か (`true` で全件表示・`false` で省略表示) */
  public isShownAll = false;
  
  constructor(
    private readonly sharedStateService: SharedStateService,
    private readonly ngUrlsService: NgUrlsService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.sharedStateService.setPageTitle('NG URL 確認');
    try {
      await this.show();  // 初期表示
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
  
  /** NG URL の全件表示・省略表示を切り替える */
  public async toggleShow(): Promise<void> {
    this.isShownAll = !this.isShownAll;
    await this.show();
  }
  
  /** 全件再読込する */
  public async reloadAll(): Promise<void> {
    this.dataState$.next({ isLoading: true });
    try {
      await this.ngUrlsService.findAll(true);
      await this.show();
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
  
  /** NG URL 一覧を表示する */
  private async show(): Promise<void> {
    const ngUrls = await this.ngUrlsService.findAll();
    if(this.isShownAll) {
      this.ngUrls = ngUrls;
    }
    else {
      this.ngUrls = ngUrls.slice(0, 50);  // 50件までに省略表示する
    }
  }
}
