/** 環境変数 (本番用) */
export const environment = {
  production: true,
  
  /** サーバ URL : 末尾はスラッシュなし・各実装場所では `/api` から記載しているのでホスト部分のみで良い */
  serverUrl: '',
  /* ログレベル : 詳細は `Logger` クラス内の定義を参照 */
  logLevel: 'warn'
};
