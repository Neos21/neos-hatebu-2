import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

/** 認証サービス */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ログインしているか否か (セッションの有無) */
  public isLogined = false;
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ */
  public accessToken = '';
  /** 自動再ログイン中か否か */
  public isReLogining = false;
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly authInfoStorageKey = 'auth_info';
  
  constructor(private readonly httpClient: HttpClient, private readonly apiService: ApiService) { }
  
  /**
   * ログインする
   * 
   * @param userName ユーザ名
   * @param password パスワード
   */
  public async login(userName: string, password: string): Promise<void> {
    try {
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string }>(`${environment.serverUrl}/api/auth/login`, { userName, password }));
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ userName, password, accessToken }));
      this.accessToken = accessToken;
      await this.apiService.fetchAll();  // どのページを初期表示しても良いように全ての必要なデータをログイン成功時に読み込んでおく
      this.isLogined = true;
      console.log('AuthService#login() : Succeeded');
    }
    catch(error) {
      console.warn('AuthService#login() : Failed', { userName, password }, error);
      this.isLogined = false;
      throw error;
    }
  }
  
  /** LocalStorage の情報を基に自動再ログインする */
  public async reLogin(): Promise<void> {
    this.isReLogining = true;
    try {
      const authInfo = window.localStorage.getItem(this.authInfoStorageKey);
      if(authInfo == null) throw new Error('Auth info does not exist');
      const { userName, password } = JSON.parse(authInfo);
      await this.login(userName, password);
    }
    catch(error) {
      // TODO : 通信エラー時に「自動再ログイン失敗」のメッセージを表示する
      // sessionStorage.setItem(appConstants.sessionStorage.loginInitMessageKey, `自動再ログイン失敗 : ${JSON.stringify(error)}`);
      throw error;
    }
    finally {
      this.isReLogining = false;
    }
  }
  
  /** ログアウトする */
  public logout(): void {
    this.isLogined = false;
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.accessToken = '';
  }
  
  /** JWT 認証の確認用 : ユーザ情報を取得する */
  public async findProfile(): Promise<void> {
    try {
      const result = await firstValueFrom(this.httpClient.get<{ userName: string }>(`${environment.serverUrl}/api/profile`));
      console.log('AuthService#findProfile() : Succeeded', result);
    }
    catch(error) {
      console.error('AuthService#findProfile() : Failed', error);
      throw error;
    }
  }
}
