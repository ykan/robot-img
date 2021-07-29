import typescript from '@rollup/plugin-typescript'
export default [
  {
    input: './packages/react-img/src/index.ts',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/react-img/dist/react-img.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tslib: './node_modules/typescript/lib',
      }),
    ],
  },
  {
    input: './packages/utils/src/index.ts',
    output: {
      file: './packages/utils/dist/utils.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tslib: './node_modules/typescript/lib',
      }),
    ],
  },
]
