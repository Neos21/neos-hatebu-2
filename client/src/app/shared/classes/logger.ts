import { environment } from '../../../environments/environment';

/** ログレベル定義 */
const logLevels = ['all', 'trace', 'debug', 'log', 'warn', 'error', 'off'];
/** ログレベルを数値化した定義 */
const indexes   = logLevels.reduce((indexes: { [key: string]: number }, logLevel, index) => {
  indexes[logLevel] = index;
  return indexes;
}, {});

/** 環境変数から読み込んだログレベル */
const logLevel = (() => {
  if(environment.logLevel == null) return 'all';  // 環境変数未定義
  const logLevel = environment.logLevel.toLowerCase();
  if(!logLevels.includes(logLevel)) return 'all';  // 不正値
  return logLevel;
})();
/** ログレベルの数値 */
const index = indexes[logLevel];

/** ロガー */
export class Logger {
  /**
   * コンストラクタ
   * 
   * @param context コンテキスト (主にクラス名・Prefix として使用する)
   */
  constructor(private readonly context: string) { }
  
  /** トレースログ */
  public trace(...args: Array<any>): void { this.print('trace', ...args); }
  /** デバッグログ */
  public debug(...args: Array<any>): void { this.print('debug', ...args); }
  /** 通常ログ */
  public log  (...args: Array<any>): void { this.print('log'  , ...args); }
  /** 警告ログ */
  public warn (...args: Array<any>): void { this.print('warn' , ...args); }
  /** エラーログ */
  public error(...args: Array<any>): void { this.print('error', ...args); }
  
  /**
   * ログレベルに従ってログ出力する
   * 
   * @param methodName `console` のメソッド名
   * @param args 出力する値
   */
  private print(methodName: string, ...args: Array<any>): void {
    if(index <= indexes[methodName]) {
      try {
        // `YYYY/MM/DD HH:mm:SS` 形式になる
        const now = new Date().toLocaleDateString(undefined,{
          year  : 'numeric',
          month : '2-digit',
          day   : '2-digit',
          hour  : '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        (window.console as any)[methodName](now, `[${this.context}]`, ...args);
      }
      catch(error) {  // ロギングに失敗した場合
        window.console.error(`Logger#${methodName}() : Failed to logging`, error);
      }
    }
    //else {  // ロギングしない
    //  // window.console.debug(`Logger#${methodName}() : Not logging`, this.index, this.indexes[methodName]);
    //}
  }
}
