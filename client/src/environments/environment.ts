/** 環境変数 (開発用) */
export const environment = {
  production: false,
  
  /** サーバ URL : 末尾はスラッシュなし・各実装場所では `/api` から記載しているのでホスト部分のみで良い */
  serverUrl: 'http://localhost:2323',
  /* ログレベル : 詳細は `Logger` クラス内の定義を参照 */
  logLevel: 'all'
};
