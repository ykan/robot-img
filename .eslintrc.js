module.exports = {
  ignorePatterns: ['**/dist/*.js', '**/_site/*'],
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react-hooks', 'jest'],
  rules: {
    'max-nested-callbacks': ['error', 5],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
}
