import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/** 認証ガード */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthService) { }
  
  /**
   * 遷移前に認証チェックする・ログ出力は `AuthService` に任せる
   * 
   * @return 遷移してよければ `true`、遷移させたくなければ `false` を返す
   */
  public async canActivate(): Promise<boolean> {
    if(this.authService.isLogined) return true;  // ログイン済みであれば遷移を許可する
    try {
      await this.authService.reLogin();
      return true;
    }
    catch(error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
