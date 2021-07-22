/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const showdown = require('showdown')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')

async function main() {
  const workspace = process.cwd()
  const converter = new showdown.Converter()
  const examplesDir = path.join(workspace, './docs/examples')
  const indexFile = path.join(workspace, './docs/index.html')
  const indexMD = await fs.readFile(path.join(workspace, './docs/README.md'), 'utf8')
  const examples = await fs.readdir(examplesDir)
  loadLanguages(['tsx'])

  const scripts = []
  const demos = []
  for (const example of examples) {
    const stat = await fs.stat(path.join(examplesDir, example))
    const exampleDir = path.join(examplesDir, example)
    const indexFile = path.join(exampleDir, 'index.tsx')
    if (stat.isDirectory && fs.existsSync(indexFile)) {
      scripts.push(`<script type="module" src="./examples/${example}/index.tsx"></script>`)
      const mdFile = path.join(exampleDir, 'README.md')
      let demo = `<div id="${example}"></div>`
      if (fs.existsSync(mdFile)) {
        const demoMD = await fs.readFile(mdFile, 'utf8')
        demo = `${converter.makeHtml(demoMD)}\n${demo}`
      }
      const code = await fs.readFile(indexFile, 'utf8')
      // Returns a highlighted HTML string
      const html = Prism.highlight(code, Prism.languages.tsx, 'tsx')
      demo += `<pre class="language-tsx"><code class="language-tsx">${html}</code></pre>`
      demos.push(`<div class="container">${demo}</div>`)
    }
  }

  const indexHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>Robot Img 文档</title>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css">
    <link rel="stylesheet" href="../node_modules/prismjs/themes/prism-solarizedlight.css">
  </head>
  <body>
    <div id="nav"></div>
    <div class="container">
      ${converter.makeHtml(indexMD)}
    </div>

    ${demos.join('\n')}
    <script type="module" src="./index.tsx"></script>
    ${scripts.join('\n')}
  </body>
</html>
`
  await fs.outputFile(indexFile, indexHTML)
}

main()
