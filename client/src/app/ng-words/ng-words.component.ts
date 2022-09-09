import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, map } from 'rxjs';

import { NgWord } from '../shared/classes/ng-word';

import { SharedStateService } from '../shared/services/shared-state.service';
import { NgWordsService } from '../shared/services/ng-words.service';

/** NG ワード管理ページ */
@Component({
  selector: 'app-ng-words',
  templateUrl: './ng-words.component.html',
  styleUrls: ['./ng-words.component.css']
})
export class NgWordsComponent implements OnInit, OnDestroy {
  /** 登録フォーム */
  public form!: FormGroup;
  /** ページデータの状態管理オブジェクト */
  private readonly dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string | any }>({ isLoading: true });
  /** ローディング中か否か */
  public readonly isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public readonly error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ワード一覧 */
  public readonly ngWords$    = this.ngWordsService.ngWords$;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sharedStateService: SharedStateService,
    private readonly ngWordsService: NgWordsService
  ) { }
  
  /** 初期表示時 */
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({
      word: ['', [Validators.required]]
    });
    this.sharedStateService.setPageTitle('NG ワード管理');
    
    try {
      await this.ngWordsService.findAll();
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      this.dataState$.next({ isLoading: false, error });
    }
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
  }
  
  /** 登録する */
  public async create(): Promise<void> {
    if(this.form.value.word == null || this.form.value.word.trim() === '') return;  // iOS で空登録ができてしまうバグ回避
    this.dataState$.next({});  // Clear Error
    try {
      const word = `${this.form.value.word}`.trim();
      
      // NOTE : 登録データは重複がないように曖昧一致で確認する
      const fuzzyWord = this.ngWordsService.transformText(word);
      if(this.ngWords$.getValue()!.some(ngWord => this.ngWordsService.transformText(ngWord.word) === fuzzyWord)) {
        this.dataState$.next({ error: `${word} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngWordsService.create(new NgWord({ word }));
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
    this.dataState$.next({});  // Clear Error
    try {
      await this.ngWordsService.remove(id);
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
  
  /** 全件再読込する */
  public async reloadAll(): Promise<void> {
    this.dataState$.next({ isLoading: true });
    try {
      await this.ngWordsService.findAll(true);
      this.dataState$.next({ isLoading: false });
    }
    catch(error) {
      this.dataState$.next({ error });
    }
  }
}
