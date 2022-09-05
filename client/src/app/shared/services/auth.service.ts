import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** ログインしているか否か (セッションの有無) */
  public isLogined: boolean = false;
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ */
  public accessToken: string = '';
  
  /** ユーザ名・パスワード・JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly authInfoStorageKey: string = 'auth_info';
  
  constructor(private readonly httpClient: HttpClient) { }
  
  public async login(userName: string, password: string): Promise<void> {
    try {
      const { accessToken } = await this.httpClient.post(`/auth/login`, { userName, password }).toPromise();  // TODO
      
      window.localStorage.setItem(this.authInfoStorageKey, JSON.stringify({ userName, password, accessToken }));
      this.accessToken = accessToken;
      
      this.isLogined = true;
      
      // TODO : NG 情報・カテゴリ一覧の習得？
    }
    catch(error) {
      console.warn('Failed To Login', { userName, password }, error);
      this.isLogined = false;
    }
  }
  
  public async reLogin(): Promise<void> {
    const rawAuthInfo = window.localStorage.getItem(this.authInfoStorageKey);
    if(!rawAuthInfo) throw new Error('Auth Info does not exist');
    const { userName, password, accessToken } = JSON.parse(rawAuthInfo);
    await this.login(userName, password);
    // TODO : // 通信エラー時のみ「自動再ログイン失敗」のメッセージを表示する
    // sessionStorage.setItem(appConstants.sessionStorage.loginInitMessageKey, `自動再ログイン失敗 : ${JSON.stringify(error)}`);
  }
  
  public logout(needsNavigateToLoginPage?: boolean): void {
    window.localStorage.removeItem(this.authInfoStorageKey);
    this.accessToken = '';
    
    this.isLogined = false;
    // TODO : キャッシュ削除？
    if(needsNavigateToLoginPage) this.router.navigate(['/login']);
  }
}
