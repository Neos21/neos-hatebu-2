import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';

/** Login 画面 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /** ログインフォーム */
  public loginForm!: FormGroup;
  /** エラーメッセージ */
  public errorMessage: string = '';
  
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  /** 画面初期表示時の処理 */
  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // TODO : //this.pageDataService.pageTitleSubject.next(`Neo's Hatebu`);  // ページタイトルを設定する
    console.error('LoginComponent#ngOnInit() : Logout (Reset Auth Info)');
    this.authService.logout();  // ログイン画面に遷移した時はログイン情報を削除しておく
    
    // TODO : 初期表示時に表示するフィードバックメッセージがあれば表示する
    //const initMessage = sessionStorage.getItem(appConstants.sessionStorage.loginInitMessageKey);
    //sessionStorage.removeItem(appConstants.sessionStorage.loginInitMessageKey);
    //if(initMessage) this.message = initMessage;
  }
  
  /** 「Login」ボタン押下時の処理 */
  public async onLogin(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.login(this.loginForm.value.userName, this.loginForm.value.password);
      console.log('LoginComponent#onLogin() : Succeeded');
      this.router.navigate(['/home']);  // カテゴリ ID は `HomeComponent` 側で設定させる
    }
    catch(error) {
      console.error('LoginComponent#onLogin() : Failed', error);
      this.errorMessage = `ログイン失敗 : ${JSON.stringify(error)}`;
    }
  }
}
