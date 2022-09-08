// ESLint 設定 : https://eslint.org/docs/latest/user-guide/configuring/
module.exports = {
  root: true,  // 設定をカスケードする際のルートとして機能するように指定する
  parser: '@typescript-eslint/parser',  // `@typescript-eslint/parser` で TypeScript を扱えるようにする
  parserOptions: {  // 構文解析オプション
    sourceType: 'module',  // `import`・`export` を解釈させるため `module` を指定する
    tsconfigRootDir : __dirname,
    project: 'tsconfig.json'
  },
  ignorePatterns: [  // ESLint が無視するファイルを指定する
    '.eslintrc.js'  // 本ファイル自体がどこからも `import` されていないというエラーが出ないようにするため指定する
  ],
  env: {  // グローバル変数を設定する
    node: true  // Node.js のグローバル変数を再定義する
  },
  plugins: [  // 機能を追加する・`extends` にてプラグインを参照できる
    '@typescript-eslint/eslint-plugin'  // `@typescript-eslint/eslint-plugin` TypeScript 用のルールを利用できるようにする
  ],
  extends: [  // 設定ファイルを拡張する
    'eslint:recommended',  // ESLint 内蔵の推奨設定
    'plugin:@typescript-eslint/recommended',  // `@typescript-eslint/eslint-plugin` 推奨設定を利用する
    'plugin:@typescript-eslint/recommended-requiring-type-checking',  // `@typescript-eslint/eslint-plugin` より厳格なチェックを追加する : https://github.com/typescript-eslint/typescript-eslint/blob/v5.36.0/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.ts
    // NOTE : `eslint-config-prettier` = `'prettier'` ルールをこの `extends` の最後に書くことで、Prettier と競合する ESLint ルールを無効化できる。`prettier/@typescript-eslint` も併記する文献もあったが v8.0.0 以降はこの `prettier` に統合されているため記載不要
    // NOTE : `plugin:prettier/recommended` (`eslint-plugin-prettier`) は Prettier を ESLint から実行するためのプラグインだが現在は非推奨となり ESLint と Prettier を個別に実行することが推奨されている
  ],
  rules: {  // 個別ルールの調整
    '@typescript-eslint/no-explicit-any'               : 'off',  // `any` を許容しないためのモノ・`any` が必要な箇所があるので無効化する
    '@typescript-eslint/no-non-null-assertion'         : 'off',  // Non-Null-Assertion (`!`) を許容する
    '@typescript-eslint/no-unsafe-assignment'          : 'off',  // 型が合わない引数設定を無効化する (ロガーへの出力時にエラー扱いされるので無効化する)
    '@typescript-eslint/no-unsafe-call'                : 'off',  // `ServerStaticModule` が吐くエラーを無視する
    '@typescript-eslint/no-unsafe-member-access'       : 'off',  // `any` なプロパティへのアクセス時のエラーを無効化する
    '@typescript-eslint/restrict-template-expressions' : 'off'   // テンプレートリテラルの型チェックを無効化する
  }
};
