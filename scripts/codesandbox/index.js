/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
const { default: fetch } = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')
const { getParameters } = require('codesandbox/lib/api/define')

async function main() {
  const workspace = process.cwd()
  const examplesDir = path.join(workspace, './docs/examples')
  const tplDir = __dirname

  const indexHTML = await fs.readFile(path.join(tplDir, 'index.tpl.html'), 'utf8')
  const pkgJson = await fs.readFile(path.join(tplDir, 'package.tpl.json'), 'utf8')
  const tsconfigJson = await fs.readFile(path.join(tplDir, 'tsconfig.tpl.json'), 'utf8')

  async function addCodesandbox(indexContent) {
    const parameters = getParameters({
      files: {
        'index.tsx': {
          content: indexContent,
          isBinary: false,
        },
        'index.html': {
          content: indexHTML,
          isBinary: false,
        },
        'package.json': {
          isBinary: false,
          content: pkgJson,
        },
        'tsconfig.json': {
          isBinary: false,
          content: tsconfigJson,
        },
      },
    })
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
      method: 'post',
      body: JSON.stringify({
        parameters,
        json: 1,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()

    return data.sandbox_id
  }

  const examples = await fs.readdir(examplesDir)
  for (const example of examples) {
    const stat = await fs.stat(path.join(examplesDir, example))
    const exampleDir = path.join(examplesDir, example)
    const indexFile = path.join(exampleDir, 'index.tsx')
    if (stat.isDirectory() && fs.existsSync(indexFile)) {
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
      console.log(`visit: https://codesandbox.io/s/${id}`)
    }
  }
  console.log('done.')
}

main()
