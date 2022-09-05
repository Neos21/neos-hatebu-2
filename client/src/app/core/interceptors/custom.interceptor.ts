import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

/** カスタム HttpClient インターセプタ */
@Injectable({ providedIn: 'root' })
export class CustomInterceptor implements HttpInterceptor {
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
    // JWT アクセストークンが取得できればリクエストヘッダに設定する (TODO : キャッシュすることも考えたがログアウト時にキャッシュをクリアするのが難しいため止める)
    const accessToken = window.localStorage.getItem('accessToken');
    if(accessToken) request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${accessToken}`) });
    // リクエストタイムアウトを設定する : 60秒
    return next.handle(request).pipe(timeout(60 * 1000));
  }
}
