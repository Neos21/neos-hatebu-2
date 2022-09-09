import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

/** 共有データ管理サービス */
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  /** ページタイトル : 空白時の初期値は `AppComponent` にて処理する */
  public readonly pageTitle$ = new BehaviorSubject<string>('');
  
  /**
   * ページタイトルを設定する
   * 
   * @param pageTitle ページタイトル
   */
  public setPageTitle(pageTitle: string = ''): void {
    window.setTimeout(() => {  // `ExpressionChangedAfterItHasBeenCheckedError` 対策
      this.pageTitle$.next(pageTitle);
    }, 0);
  }
}
