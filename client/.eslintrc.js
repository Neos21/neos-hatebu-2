// Angular ESLint 設定 : https://github.com/angular-eslint/angular-eslint/tree/v14.0.3
module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates'
      ],
      rules: {
        '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style : 'camelCase'  }],
        '@angular-eslint/component-selector': ['error', { type: 'element'  , prefix: 'app', style : 'kebab-case' }]
      }
    },
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended'
      ],
      rules: {
        '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }]
      }
    }
  ]
};
