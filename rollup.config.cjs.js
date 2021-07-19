import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
export default [
  {
    input: './packages/react-img/dist/react-img.esm.js',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/react-img/dist/react-img.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [babel({ babelHelpers: 'runtime' }), commonjs()],
  },
  {
    input: './packages/utils/dist/utils.esm.js',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/utils/dist/utils.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [babel({ babelHelpers: 'runtime' }), commonjs()],
  },
]
