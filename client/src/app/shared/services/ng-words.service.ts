import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NgWord } from '../classes/ng-word';

/** NG ワードサービス */
@Injectable({ providedIn: 'root' })
export class NgWordsService {
  /** NG ワードのキャッシュ */
  public readonly ngWords$ = new BehaviorSubject<Array<NgWord> | null>(null);
  
  constructor(private readonly httpClient: HttpClient) { }
  
  /**
   * NG ワード一覧を取得する
   * 
   * @param isForce `true` を指定したら強制再取得する
   * @return NG ワード一覧
   */
  public async findAll(isForce?: boolean): Promise<Array<NgWord>> {
    if(!isForce) {
      const cachedNgWords = this.ngWords$.getValue();
      if(cachedNgWords != null) return cachedNgWords;  // キャッシュを返す
    }
    // キャッシュがなければ取得してキャッシュする
    const ngWords = await firstValueFrom(this.httpClient.get<Array<NgWord>>(`${environment.serverUrl}/api/ng-words`));
    this.ngWords$.next(ngWords);
    return ngWords;
  }
  
  /**
   * NG ワードを登録する
   * 
   * @param ngWord NG ワード
   * @return 登録された NG ワード
   */
  public async create(ngWord: NgWord): Promise<NgWord> {
    const createdNgWord = await firstValueFrom(this.httpClient.post<NgWord>(`${environment.serverUrl}/api/ng-words`, ngWord));
    // 登録後のエンティティをキャッシュに追加する
    const ngWords = this.ngWords$.getValue()!;
    ngWords.push(createdNgWord);
    this.ngWords$.next(ngWords);
    return createdNgWord;
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param id 削除対象 ID
   */
  public async remove(id: number): Promise<void> {
    const ngWords = this.ngWords$.getValue()!;
    const removedIndex = ngWords.findIndex(ngWord => ngWord.id === id);
    if(removedIndex < 0) throw new Error('The NgWord ID does not exist');
    
    await firstValueFrom(this.httpClient.delete(`${environment.serverUrl}/api/ng-words/${id}`));
    // 削除したエンティティをキャッシュから削除する
    ngWords.splice(removedIndex, 1);
    this.ngWords$.next(ngWords);
  }
  
  /**
   * 文字列を曖昧一致できるように変換する
   * 
   * @param value 文字列
   * @return カタカナをひらがなに・全角英数字を半角英数字 (小文字) に統一した文字列
   */
   public transformText(value: string): string {
    return value
      .toLowerCase()          // 半角・全角英字を小文字に統一する
      .replace((/\s/g), ' ')  // 全角スペースなどを全て半角スペースに統一する
      .replace((/[\u30A1-\u30F6]/g  ), match => String.fromCharCode(match.charCodeAt(0) - 0x60  ))   // 全角カタカナをひらがなに変換する
      .replace((/[ａ-ｚ０-９！-～]/g), match => String.fromCharCode(match.charCodeAt(0) - 0xFEE0));  // 全角英数字を半角英数字に変換する
  }
}
