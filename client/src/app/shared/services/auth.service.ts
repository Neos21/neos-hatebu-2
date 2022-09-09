import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Logger } from '../classes/logger';

import { ApiService } from './api.service';

/** 認証サービス */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  /** ログインしているか否か (セッションの有無) */
  public isLogined = false;
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ */
  public accessToken = '';
  /** 自動再ログイン中か否か */
  public isReLogining = false;
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly authInfoStorageKey = 'auth_info';
  
  constructor(
    private readonly httpClient: HttpClient,
    private readonly apiService: ApiService
  ) { }
  
  /**
   * ログインする
   * 
   * @param userName ユーザ名
   * @param password パスワード
   */
  public async login(userName: string, password: string): Promise<void> {
    try {
      // ログイン試行する
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string }>(`${environment.serverUrl}/api/auth/login`, { userName, password }));
      // ログインできたら LocalStorage とキャッシュを保存する
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ userName, password, accessToken }));
      this.accessToken = accessToken;
      // どのページを初期表示しても良いように全ての必要な API データを読み込んでおく
      await this.apiService.fetchAll();
      // ログイン状態に切り替える
      this.logger.log('#login() : Succeeded');
      this.isLogined = true;
    }
    catch(error) {
      this.logger.warn('#login() : Failed', { userName, password }, error);
      this.isLogined = false;
      throw error;
    }
  }
  
  /** `AuthGuard` より呼び出す : LocalStorage の情報を基に自動再ログインする */
  public async reLogin(): Promise<void> {
    this.isReLogining = true;
    try {
      const authInfo = window.localStorage.getItem(this.authInfoStorageKey);
      if(authInfo == null) throw new Error('Auth info does not exist');
      const { userName, password } = JSON.parse(authInfo);
      await this.login(userName, password);
      this.logger.log('#reLogin() : Succeeded');
    }
    catch(error) {
      this.logger.error('#reLogin() : Failed to re-login. Redirect to login page', error);
      throw error;  // 自動再ログインに失敗した場合は `AuthGuard` より `LoginComponent` に遷移し以下の `#logout()` が呼ばれて初期化される
    }
    finally {
      this.isReLogining = false;
    }
  }
  
  /** ログアウトする */
  public logout(): void {
    // LocalStorage とキャッシュを削除する
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.accessToken = '';
    // API データのキャッシュを削除する
    this.apiService.removeAllCaches();
    // ログアウト状態にする
    this.logger.log('#logout() : Succeeded');
    this.isLogined = false;
  }
}
