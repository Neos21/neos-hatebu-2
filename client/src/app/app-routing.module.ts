import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgUrlsComponent } from './ng-urls/ng-urls.component';
import { NgWordsComponent } from './ng-words/ng-words.component';
import { NgDomainsComponent } from './ng-domains/ng-domains.component';

/** Routes */
const routes: Routes = [
  { path: 'login'     , component: LoginComponent                               },
  { path: 'home'      , component: HomeComponent     , canActivate: [AuthGuard] },
  { path: 'ng-urls'   , component: NgUrlsComponent   , canActivate: [AuthGuard] },
  { path: 'ng-words'  , component: NgWordsComponent  , canActivate: [AuthGuard] },
  { path: 'ng-domains', component: NgDomainsComponent, canActivate: [AuthGuard] },
  
  // 未指定時は `/home` へのリダイレクトにしておき `/home` に設定した `AuthGuard` によって `/login` か `/home` に振り分けさせる
  { path: ''  , pathMatch: 'full', redirectTo: '/home' },
  { path: '**',                    redirectTo: '/'     }  // 404
];

/** App Routing */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],  // ハッシュモードにする
  exports: [RouterModule]
})
export class AppRoutingModule { }
