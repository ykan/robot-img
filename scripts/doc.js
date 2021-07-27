/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
const fs = require('fs-extra')
const path = require('path')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const pug = require('pug')
const chokidar = require('chokidar')
const { performance } = require('perf_hooks')

loadLanguages(['tsx'])
const md = require('markdown-it')({
  highlight: (str, lang) => {
    if (lang && Prism.languages[lang]) {
      const code = Prism.highlight(str, Prism.languages[lang], lang)
      return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
    }

    const code = md.utils.escapeHtml(str)
    return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
  },
})

const { hasArg } = require('./utils')
async function main() {
  const workspace = process.cwd()
  const examplesDir = path.join(workspace, './docs/examples')
  const indexPug = path.join(workspace, './docs/index.pug')
  const outputPath = path.join(workspace, './docs/index.html')
  const indexMDPath = path.join(workspace, './docs/README.md')

  async function render() {
    const time = performance.now()
    const indexMD = await fs.readFile(indexMDPath, 'utf8')
    const examples = await fs.readdir(examplesDir)

    const indexTpl = pug.compileFile(indexPug)

    const introHTML = md.render(indexMD)

    const demos = []
    for (const example of examples) {
      const stat = await fs.stat(path.join(examplesDir, example))
      const exampleDir = path.join(examplesDir, example)
      const indexFile = path.join(exampleDir, 'index.tsx')
      if (stat.isDirectory() && fs.existsSync(indexFile)) {
        const demoItem = { name: example }
        const mdFile = path.join(exampleDir, 'README.md')
        if (fs.existsSync(mdFile)) {
          let demoMD = await fs.readFile(mdFile, 'utf8')
          demoMD = demoMD.replace(/\[Open.in.codesandbox\]\((.*)\)/, ($0, $1) => {
            if ($1.includes('codesandbox')) {
              demoItem.codesandboxUrl = $1.trim()
            }
            return ''
          })
          demoItem.mdHTML = md.render(demoMD)
        }
        const code = await fs.readFile(indexFile, 'utf8')
        // Returns a highlighted HTML string
        demoItem.code = Prism.highlight(code, Prism.languages.tsx, 'tsx')
        demos.push(demoItem)
      }
    }

    await fs.outputFile(
      outputPath,
      indexTpl({
        introHTML,
        demos,
      })
    )
    console.log(`Render index.html done.  Cost: ${performance.now() - time}ms`)
  }

  if (hasArg('-w')) {
    console.log('Start to watch ./docs...')
    let isChange = false
    let isRendering = false
    chokidar.watch(['./docs/**/*.md', './docs/**/*.pug']).on('change', () => {
      isChange = true
    })
    let timer
    const tick = () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (isChange && !isRendering) {
        isChange = false
        isRendering = true
        render().finally(() => {
          isRendering = false
        })
      }

      timer = setTimeout(tick, 100)
    }
    tick()
  } else {
    await render()
  }
}

main()
