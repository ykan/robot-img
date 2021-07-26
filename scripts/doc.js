/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const pug = require('pug')

loadLanguages(['tsx'])
const md = require('markdown-it')({
  highlight: (str, lang) => {
    if (lang && Prism.languages[lang]) {
      const code = Prism.highlight(str, Prism.languages[lang], lang)
      return `<pre class="language-${lang}"><code class="language-${lang}">${code}</code></pre>`
    }

    return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(
      str
    )}</code></pre>`
  },
})

async function main() {
  const workspace = process.cwd()
  const examplesDir = path.join(workspace, './docs/examples')
  const indexPug = path.join(workspace, './docs/index.pug')
  const indexHTML = path.join(workspace, './docs/index.html')
  const indexMD = await fs.readFile(path.join(workspace, './docs/README.md'), 'utf8')
  const examples = await fs.readdir(examplesDir)

  const indexTpl = pug.compileFile(indexPug)

  const introHTML = md.render(indexMD)

  const demos = []
  for (const example of examples) {
    const stat = await fs.stat(path.join(examplesDir, example))
    const exampleDir = path.join(examplesDir, example)
    const indexFile = path.join(exampleDir, 'index.tsx')
    if (stat.isDirectory && fs.existsSync(indexFile)) {
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
    indexHTML,
    indexTpl({
      introHTML,
      demos,
    })
  )
  console.log('index.html done.')
}

main()
