import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingComponent } from './components/loading/loading.component';
import { ErrorComponent } from './components/error/error.component';
import { HatebuUrlPipe } from './pipes/hatebu-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    // Components
    LoadingComponent,
    ErrorComponent,
    // Pipes
    HatebuUrlPipe
  ],
  exports: [
    // Re-Export
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Common
    LoadingComponent,
    ErrorComponent
  ]
})
export class SharedModule { }
