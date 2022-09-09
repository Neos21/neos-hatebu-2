import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingComponent } from './components/loading/loading.component';
import { WarningComponent } from './components/warning/warning.component';
import { ErrorComponent } from './components/error/error.component';

import { HatebuUrlPipe } from './pipes/hatebu-url.pipe';
import { IsoToJstPipe } from './pipes/iso-to-jst.pipe';
import { SlashToHyphenPipe } from './pipes/slash-to-hyphen.pipe'

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
    WarningComponent,
    WarningComponent,
    ErrorComponent,
    // Pipes
    HatebuUrlPipe,
    IsoToJstPipe,
    SlashToHyphenPipe
  ],
  exports: [
    // Re-Export
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Components
    LoadingComponent,
    WarningComponent,
    ErrorComponent,
    // Pipes
    HatebuUrlPipe,
    IsoToJstPipe,
    SlashToHyphenPipe
  ]
})
export class SharedModule { }
