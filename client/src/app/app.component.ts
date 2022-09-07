import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './shared/services/auth.service';
import { SharedStateService } from './shared/services/shared-state.service';
import { CategoriesService } from './shared/services/categories.service';

/** App Component */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private readonly router: Router,
    public readonly authService: AuthService,
    public readonly sharedStateService: SharedStateService,
    public readonly categoriesService: CategoriesService
  ) { }
  
  public async reloadAll(): Promise<void> {
    await this.categoriesService.reloadAll();
  }
  
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
