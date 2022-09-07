import { Component } from '@angular/core';

import { AuthService } from './shared/services/auth.service';
import { SharedStateService } from './shared/services/shared-state.service';

/** App Component */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public readonly authService: AuthService,
    public readonly sharedStateService: SharedStateService
  ) { }
}
