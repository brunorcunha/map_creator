/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'arrow-parens': 'error',
    'no-await-in-loop': 'error',
    'no-return-await': 'error',
    'no-unused-vars': 'off',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'off',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',
    'require-await': 'error',
    'sort-imports': ['error', { ignoreCase: true, allowSeparatedGroups: true }],
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
    'vue/block-lang': ['error', { script: { lang: 'ts' } }],
    'vue/multi-word-component-names': 'off',
    'vue/prop-name-casing': ['error', 'camelCase'],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      {
        allowHigherOrderFunctions: true
      }
    ],
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-for-of': 'error'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
};
