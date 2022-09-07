import { Component, Input } from '@angular/core';

/** ローディングメッセージ表示用コンポーネント */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  /** ローディングメッセージ */
  @Input() public message = '読込中…';
}
