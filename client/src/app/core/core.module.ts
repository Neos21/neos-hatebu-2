import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CustomInterceptor } from './interceptors/custom.interceptor';

/** Core Module : `SharedModule` をインポートせず独立させる */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {  // クッキーによるセッション管理を有効にする
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
