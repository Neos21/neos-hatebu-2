import { Component, Input } from '@angular/core';

/** エラーメッセージ表示用コンポーネント */
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  /** エラーオブジェクト */
  @Input() public error?: Error | string;
  
  /** エラーメッセージを取得する */
  public errorMessage(): string {
    if(this.error == null) return 'Unknown Error';
    if(typeof this.error === 'string') return this.error;
    if(this.error?.message != null) return this.error.message;
    return this.error.toString();
  }
}
