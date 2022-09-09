import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SharedStateService } from '../shared/services/shared-state.service';
import { AuthService } from '../shared/services/auth.service';

/** ログインページ */
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
    private readonly sharedStateService: SharedStateService,
    private readonly authService: AuthService
  ) { }

  /** 初期表示時 */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.sharedStateService.setPageTitle('');  // アプリ名を表示する
    this.authService.logout();  // ログインページに遷移した時はログイン情報を削除しておく
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
