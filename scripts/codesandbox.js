/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
const fetch = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')
const { getParameters } = require('codesandbox/lib/api/define')

async function addCodesandbox(indexContent) {
  const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
    method: 'post',
    body: JSON.stringify({
      parameters: getParameters({
        files: {
          'index.tsx': {
            content: indexContent,
            isBinary: false,
          },
          'index.html': {
            content: '<div id="root"></div>',
            isBinary: false,
          },
          'package.json': {
            isBinary: false,
            content: JSON.stringify(
              {
                name: 'robot-img-example',
                main: './index.tsx',
                devDependencies: {
                  typescript: 'latest',
                  '@types/react': 'latest',
                  '@types/react-dom': 'latest',
                },
                dependencies: {
                  react: 'latest',
                  'react-dom': 'latest',
                  '@emotion/react': 'latest',
                  '@emotion/styled': 'latest',
                  '@robot-img/react-img': 'latest',
                },
              },
              null,
              '  '
            ),
          },
          'tsconfig.json': {
            isBinary: false,
            content: JSON.stringify(
              {
                compilerOptions: {
                  target: 'es5',
                  strict: true,
                  skipLibCheck: true,
                  resolveJsonModule: true,
                  noEmit: true,
                  moduleResolution: 'node',
                  module: 'esnext',
                  lib: ['dom', 'dom.iterable', 'esnext'],
                  jsx: 'preserve',
                  isolatedModules: true,
                  forceConsistentCasingInFileNames: true,
                  esModuleInterop: true,
                  allowSyntheticDefaultImports: true,
                  allowJs: true,
                },
              },
              null,
              '  '
            ),
          },
        },
      }),
      json: 1,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await response.json()

  return data.sandbox_id
}

async function main() {
  const workspace = process.cwd()
  const examplesDir = path.join(workspace, './docs/examples')
  const examples = await fs.readdir(examplesDir)
  for (const example of examples) {
    const stat = await fs.stat(path.join(examplesDir, example))
    const exampleDir = path.join(examplesDir, example)
    const indexFile = path.join(exampleDir, 'index.tsx')
    if (stat.isDirectory && fs.existsSync(indexFile)) {
      console.log(`生成 ${example} 的 codesandbox 链接...`)
      const mdFile = path.join(exampleDir, 'README.md')
      const code = await fs.readFile(indexFile, 'utf8')
      const id = await addCodesandbox(code.replace(example, 'root'))
      if (fs.existsSync(mdFile)) {
        let md = await fs.readFile(mdFile, 'utf8')
        const codesandboxStr = `[Open in codesandbox](https://codesandbox.io/s/${id})`
        if (md.includes('[Open in codesandbox]')) {
          md = md.replace(/\[Open.in.codesandbox\]\(.*\)/, codesandboxStr)
        } else {
          md += codesandboxStr
        }
        await fs.outputFile(mdFile, md, 'utf8')
      }
    }
  }
  console.log('done.')
}

main()
