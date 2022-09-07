import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, map } from 'rxjs';

import { SharedStateService } from '../shared/services/shared-state.service';
import { NgDataService } from '../shared/services/ng-data.service';
import { NgWord } from '../shared/classes/ng-word';

/** NG ワード管理画面 */
@Component({
  selector: 'app-ng-words',
  templateUrl: './ng-words.component.html',
  styleUrls: ['./ng-words.component.css']
})
export class NgWordsComponent implements OnInit, OnDestroy {
  /** 登録欄 */
  public form!: FormGroup;
  /** 画面データの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$ = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$     = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ワード一覧 */
  public readonly ngWords$   = this.ngDataService.ngWords$;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sharedStateService: SharedStateService,
    private readonly ngDataService: NgDataService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.sharedStateService.setPageTitle('NG ワード管理');
    this.form = this.formBuilder.group({
      word: ['', [Validators.required]]
    });
    
    try {
      await this.ngDataService.findNgWords();
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      console.error('NgWordsComponent#ngOnInit() : Failed', error);
      this.dataState$.next({ isLoading: false, error });
    }
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
  }
  
  /** 登録する */
  public async create(): Promise<void> {
    try {
      this.dataState$.next({});  // Clear Error
      
      const word = `${this.form.value.word}`.trim();
      
      if(this.ngWords$.getValue()!.some(ngWord => ngWord.word === word)) {  // TODO : 曖昧一致
        this.dataState$.next({ error: `${word} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngDataService.createNgWord(new NgWord({ word }));
      this.form.reset();
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 削除する
   * 
   * @param id 削除する ID
   */
  public async remove(id: number): Promise<void> {
    try {
      this.dataState$.next({});  // Clear Error
      await this.ngDataService.removeNgWord(id);
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
}
