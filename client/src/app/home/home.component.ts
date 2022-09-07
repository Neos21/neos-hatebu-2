import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, map } from 'rxjs';

import { SharedStateService } from '../shared/services/shared-state.service';
import { Category } from '../shared/classes/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private dataState$ = new BehaviorSubject<{ category?: Category | null; error?: Error | any }>({
                                             category : null           , error : null });
  public readonly isLoading$ = this.dataState$.pipe(map(dataState => dataState.category == null && dataState.error == null));
  public readonly category$  = this.dataState$.pipe(map(dataState => dataState.category));
  public readonly error$     = this.dataState$.pipe(map(dataState => dataState.error   ));
  
  constructor(private readonly sharedStateService: SharedStateService) { }
  
  public async ngOnInit(): Promise<void> {
    await this.testLoadCategory();
  }
  
  /** 終了時の処理 : 不要かも */
  public ngOnDestroy(): void {
    this.dataState$.complete();
    this.dataState$.unsubscribe();
  }
  
  public async testLoadCategory(categoryId: number = -1): Promise<void> {
    this.startLoading();
    await new Promise(r => setTimeout(r, 1000));
    const category = new Category({ id: categoryId, name: 'ほげ' });
    this.sharedStateService.setPageTitle(category.name);
    this.dataState$.next({ category });
  }
  public async testCauseError(): Promise<void> {
    this.startLoading();
    try {
      await new Promise((_, reject) => setTimeout(() => reject('Test Error'), 1000));
      this.dataState$.next({ category: new Category({ id: -2 }) });
    }
    catch(error) {
      this.sharedStateService.pageTitle$.next('');
      this.dataState$.next({ error });
    }
  }
  
  private startLoading(): void {
    this.dataState$.next({});
  }
}
