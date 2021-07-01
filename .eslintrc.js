module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react-hooks', 'jest'],
  rules: {},
}
