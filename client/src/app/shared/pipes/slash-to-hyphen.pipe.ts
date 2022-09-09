import { Pipe, PipeTransform } from '@angular/core';

/** スラッシュ区切りの日時文字列をハイフン区切りに変換する */
@Pipe({ name: 'slashToHyphen' })
export class SlashToHyphenPipe implements PipeTransform {
  /**
   * スラッシュ区切りの日時文字列をハイフン区切りに変換する
   * 
   * @param date スラッシュ区切りの日時文字列
   * @return ハイフン区切り文字列
   */
  public transform(date: string): string {
    return date.replace((/\//g), '-');
  }
}
