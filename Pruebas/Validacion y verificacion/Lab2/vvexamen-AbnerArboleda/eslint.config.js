const js = require('@eslint/js');

module.exports = [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'error',
      eqeqeq: 'error',
      camelcase: 'error',
      'no-unused-vars': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'max-lines-per-function': ['error', 20],
    },
  },
];
