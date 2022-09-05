import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service'

/** カスタム HttpClient インターセプタ */
@Injectable({ providedIn: 'root' })
export class CustomInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) { }
  
  /**
   * HttpClient からの通信時に以下の割り込み処理を行う
   * 
   * @param request リクエスト
   * @param next ハンドラ
   * @return HttpEvent の Observable
   */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // クッキーによるセッション管理を有効にする
    request = request.clone({ withCredentials: true });
    // JWT アクセストークンが取得できればリクエストヘッダに設定する
    const accessToken = this.authService.accessToken;
    if(accessToken) request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${accessToken}`) });
    // リクエストタイムアウトを設定する : 60秒
    return next.handle(request).pipe(timeout(60 * 1000));
  }
}
