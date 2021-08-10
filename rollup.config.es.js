import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const extensions = ['.ts', '.tsx']
export default [
  {
    input: './packages/react-img/src/index.ts',
    external: ['@robot-img/utils', 'react'],
    output: {
      file: './packages/react-img/dist/react-img.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      babel({ babelHelpers: 'inline', extensions }),
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
      nodeResolve({
        extensions,
      }),
      babel({ babelHelpers: 'inline', extensions }),
    ],
  },
]
