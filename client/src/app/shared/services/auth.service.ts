import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ログインしているか否か (セッションの有無) */
  public isLogined: boolean = false;
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ */
  public accessToken: string = '';
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly authInfoStorageKey: string = 'auth_info';
  
  constructor(private readonly httpClient: HttpClient, private readonly router: Router) { }
  
  /**
   * ログインする
   * 
   * @param userName ユーザ名
   * @param password パスワード
   */
  public async login(userName: string, password: string): Promise<void> {
    try {
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string }>(`${environment.serverUrl}/api/auth/login`, { userName, password }));
      this.isLogined = true;
      // LocalStorage に認証情報・JWT アクセストークンを保存する
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ userName, password, accessToken }));
      this.accessToken = accessToken;
      
      // TODO : NG 情報・カテゴリ一覧の習得？
    }
    catch(error) {
      console.warn('Failed To Login', { userName, password }, error);
      this.isLogined = false;
    }
  }
  
  /** LocalStorage の情報を元に自動再ログインする */
  public async reLogin(): Promise<void> {
    const rawAuthInfo = window.localStorage.getItem(this.authInfoStorageKey);
    if(!rawAuthInfo) throw new Error('Auth Info does not exist');
    const { userName, password, accessToken } = JSON.parse(rawAuthInfo);
    await this.login(userName, password);
    // TODO : // 通信エラー時のみ「自動再ログイン失敗」のメッセージを表示する
    // sessionStorage.setItem(appConstants.sessionStorage.loginInitMessageKey, `自動再ログイン失敗 : ${JSON.stringify(error)}`);
  }
  
  /**
   * ログアウトする
   * 
   * @param needsNavigateToLoginPage `true` を設定するとログイン画面に遷移する
   */
  public logout(needsNavigateToLoginPage?: boolean): void {
    this.isLogined = false;
    // LocalStorage・キャッシュを削除する
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.accessToken = '';
    
    // TODO : API データのキャッシュ削除？
    
    if(needsNavigateToLoginPage) this.router.navigate(['/login']);
  }
  
  /** JWT 認証の確認用 : ユーザ情報を取得する */
  public async findProfile(): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.get<{ userName: string }>(`${environment.serverUrl}/api/profile`));
      console.log('AuthService#findProfile() : Succeeded', result);
    }
    catch(error) {
      console.error('AuthService#findProfile() : Failed', error);
    }
  }
}
