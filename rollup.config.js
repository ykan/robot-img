import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: './packages/react-img/src/index.ts',
    external: ['@robot-img/utils'],
    output: [
      {
        file: './packages/react-img/dist/react-img.esm-bundler.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './packages/react-img/dist/react-img.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
  {
    input: './packages/utils/src/index.ts',
    output: [
      {
        file: './packages/utils/dist/utils.esm-bundler.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './packages/utils/dist/utils.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
]
