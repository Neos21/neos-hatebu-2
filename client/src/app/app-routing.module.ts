import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Routes */
const routes: Routes = [
  // 未指定時は `/home` へのリダイレクトにしておき `/home` に設定した `AuthGuard` によって `/login` か `/home` に振り分けさせる
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  // 404 (TODO)
  { path: '**', redirectTo: '/' }
];

/** App Routing */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],  // ハッシュモードにする
  exports: [RouterModule]
})
export class AppRoutingModule { }
