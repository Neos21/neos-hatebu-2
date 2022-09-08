import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { AuthService } from './shared/services/auth.service';
import { SharedStateService } from './shared/services/shared-state.service';
import { CategoriesService } from './shared/services/categories.service';

/** App Component */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /** 画面幅が狭い時にサイドメニュー `.menu` を開いているかどうか */
  private isShownMenu = false;
  /** 左利きモードか否か (`true` がデフォルト左利きモード・`false` で右利きモード) */
  private isLeftHandMode = true;
  
  constructor(
    private readonly router: Router,
    private readonly renderer2: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
    public readonly authService: AuthService,                // メニュー表示切替・ログイン・ログアウト用
    public readonly sharedStateService: SharedStateService,  // ページタイトル表示用
    public readonly categoriesService: CategoriesService     // カテゴリ一覧の参照用
  ) { }
  
  /** 初期表示時 */
  public ngOnInit(): void {
    // ページ遷移時はサイドメニューを閉じ、ページトップに遷移させる
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.toggleMenu(false);
        this.moveToTop();  // `RouterModule.forRoot()` に `scrollPositionRestoration: 'enabled'` を設定してみたが動きがカクつくので止めた
      }
    });
  }
  
  /**
   * サイドメニューを開閉する
   * 
   * @param isShown サイドメニューを強制的に開く場合は `true`・強制的に閉じる場合は `false` を指定する
   */
  public toggleMenu(isShown?: boolean): void {
    // 引数が指定されていれば引数に従って操作、そうでなければ現在の状態を反転させる
    this.isShownMenu = typeof isShown !== 'undefined' ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
  
  /** 利き手モードを切り替える */
  public toggleHand(): void {
    this.isLeftHandMode = !this.isLeftHandMode;
    this.renderer2[this.isLeftHandMode ? 'removeClass' : 'addClass'](this.document.body, 'right-hand-mode');
  }
  
  /** * ページ最上部に戻る */
  public moveToTop(): void {
    window.scrollTo(0, 0);
  }
  
  /** ログアウトする */
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
