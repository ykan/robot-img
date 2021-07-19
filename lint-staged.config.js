module.exports = {
  '**/*.ts?(x)': [
    'prettier --write',
    'eslint --cache --fix',
    () => 'tsc -p tsconfig.json --noEmit',
  ],
  '**/*.js?(x)': ['prettier --write', 'eslint --cache --fix'],
}
