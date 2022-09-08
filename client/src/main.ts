import 'zone.js';  // From `polyfills.ts` : Zone JS is required by default for Angular itself

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if(environment.production) enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error('Bootstrap : Error', error));
