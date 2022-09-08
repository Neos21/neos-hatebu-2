import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { SharedStateService } from '../shared/services/shared-state.service';

/** Login 画面 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /** ログインフォーム */
  public form!: FormGroup;
  /** エラー */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sharedStateService: SharedStateService
  ) { }

  /** 初期表示時 */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.sharedStateService.setPageTitle('Login');
    
    this.authService.logout();  // ログイン画面に遷移した時はログイン情報を削除しておく
    
    // TODO : 初期表示時に表示するフィードバックメッセージがあれば表示する
    //const initMessage = sessionStorage.getItem(appConstants.sessionStorage.loginInitMessageKey);
    //sessionStorage.removeItem(appConstants.sessionStorage.loginInitMessageKey);
    //if(initMessage) this.message = initMessage;
  }
  
  /** ログイン試行する */
  public async login(): Promise<void> {
    this.error = undefined;
    try {
      await this.authService.login(this.form.value.userName, this.form.value.password);
      this.router.navigate(['/home']);  // カテゴリ ID は `HomeComponent` 側で設定させる
    }
    catch(error) {
      this.error = `ログイン失敗 : ${JSON.stringify(error)}`;
    }
  }
}
