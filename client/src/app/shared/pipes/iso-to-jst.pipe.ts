import { Pipe, PipeTransform } from '@angular/core';

/** ISO 8601 形式の日時文字列を JST に変換する */
@Pipe({ name: 'isoToJst' })
export class IsoToJstPipe implements PipeTransform {
  /** JST は UTC の9時間後 (`60 * 9`)・それを分単位で表現したモノ */
  private readonly jstOffsetMinutes = 540;
  /** 分単位からミリ秒単位に変換する */
  private readonly minutesToMilliSeconds = 60000;
  
  /**
   * ISO 8601 形式の日時文字列 (`YYYY-MM-DDTHH:mm:SS.sssZ`) を JST (`YYYY-MM-DD HH:mm:SS`) に変換する
   * 
   * @param isoDateTime ISO 8601 形式の日時文字列
   * @return JST 文字列
   */
  public transform(isoDateTime: string): string {
    const dateTime = new Date(isoDateTime);
    if(dateTime.toString() === 'Invalid Date') return isoDateTime;  // 形式不一致
    // 実行環境に左右されず JST を得る
    const jstDateTime = new Date(dateTime.getTime() + ((new Date().getTimezoneOffset() + this.jstOffsetMinutes) * this.minutesToMilliSeconds));
    const jstDateTimeString = jstDateTime.getFullYear()
      + '-' + `0${jstDateTime.getMonth() + 1}`.slice(-2)
      + '-' + `0${jstDateTime.getDate()}`     .slice(-2)
      + ' ' + `0${jstDateTime.getHours()}`    .slice(-2)
      + ':' + `0${jstDateTime.getMinutes()}`  .slice(-2)
      + ':' + `0${jstDateTime.getSeconds()}`  .slice(-2);
    return jstDateTimeString;
  }
}
