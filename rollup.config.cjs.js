import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const extensions = ['.ts', '.tsx']
export default [
  {
    input: './packages/react-img/src/index.ts',
    external: ['@robot-img/utils', 'react'],
    output: {
      file: './packages/react-img/dist/react-img.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      babel({ babelHelpers: 'inline', extensions }),
      commonjs(),
    ],
  },
  {
    input: './packages/utils/src/index.ts',
    external: ['@robot-img/utils'],
    output: {
      file: './packages/utils/dist/utils.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      babel({ babelHelpers: 'inline', extensions }),
      commonjs(),
    ],
  },
]
