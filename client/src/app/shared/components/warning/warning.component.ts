import { Component, Input } from '@angular/core';

/** ワーニングメッセージ表示コンポーネント */
@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent {
  /** ワーニングメッセージ */
  @Input() public message?: string;
}
