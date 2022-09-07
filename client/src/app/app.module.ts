import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgUrlsComponent } from './ng-urls/ng-urls.component';
import { NgWordsComponent } from './ng-words/ng-words.component';
import { NgDomainsComponent } from './ng-domains/ng-domains.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/** App Module */
@NgModule({
  imports: [
    BrowserModule,
    // Common
    CoreModule,
    SharedModule,
    // App
    AppRoutingModule,
  ],
  declarations: [
    // App
    AppComponent,
    // Pages
    HomeComponent,
    LoginComponent,
    NgUrlsComponent,
    NgWordsComponent,
    NgDomainsComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
