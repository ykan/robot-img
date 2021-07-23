/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const showdown = require('showdown')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const pug = require('pug')

async function main() {
  const workspace = process.cwd()
  const converter = new showdown.Converter()
  const examplesDir = path.join(workspace, './docs/examples')
  const indexPug = path.join(workspace, './docs/index.pug')
  const indexHTML = path.join(workspace, './docs/index.html')
  const indexMD = await fs.readFile(path.join(workspace, './docs/README.md'), 'utf8')
  const examples = await fs.readdir(examplesDir)
  loadLanguages(['tsx'])

  const indexTpl = pug.compileFile(indexPug)

  let introHTML
  if (fs.existsSync(indexMD)) {
    const mdContent = await fs.readFile(indexMD, 'utf8')
    introHTML = converter.makeHtml(mdContent)
  }

  const demos = []
  for (const example of examples) {
    const stat = await fs.stat(path.join(examplesDir, example))
    const exampleDir = path.join(examplesDir, example)
    const indexFile = path.join(exampleDir, 'index.tsx')
    if (stat.isDirectory && fs.existsSync(indexFile)) {
      const demoItem = { name: example }
      const mdFile = path.join(exampleDir, 'README.md')
      if (fs.existsSync(mdFile)) {
        const demoMD = await fs.readFile(mdFile, 'utf8')
        demoItem.mdHTML = converter.makeHtml(demoMD)
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
