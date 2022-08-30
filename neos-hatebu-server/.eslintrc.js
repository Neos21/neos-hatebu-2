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
    'prettier',  // `eslint-config-prettier` Prettier と競合する ESLint ルールを無効化する・`extends` の最後に書くこと・`prettier/@typescript-eslint` も併記する文献もあった v8.0.0 以降はこの `prettier` に統合されているため記載不要
    // NOTE : `plugin:prettier/recommended` (`eslint-plugin-prettier`) は Prettier を ESLint から実行するためのプラグインだが現在は非推奨となり ESLint と Prettier を個別に実行することが推奨されている
  ],
  rules: {  // 個別ルールの調整
    '@typescript-eslint/explicit-function-return-type' : 'error',  // 関数の戻り値を明示的に宣言する
    '@typescript-eslint/explicit-module-boundary-types': 'error',  // クラスメソッドの戻り値を明示的に宣言する
    '@typescript-eslint/no-explicit-any'               : 'error'   // `any` を許容しない
  }
};
