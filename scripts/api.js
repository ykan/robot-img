/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const pug = require('pug')
const { default: parseFiles } = require('@muya-ui/baozheng-tsdoc')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
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
const { hasArg } = require('./utils')

async function main() {
  const devMode = hasArg('-d')
  const workspace = process.cwd()
  const apiPug = path.join(workspace, './docs/api.pug')
  const apiTpl = pug.compileFile(apiPug)
  const result = parseFiles(['./packages/react-img/src/types.ts'], {
    tsconfigPath: './tsconfig.json',
  })
  const interfaces = result.props.map((interface) => ({
    ...interface,
    comment: interface.comment ? md.render(interface.comment) : '',
    properties: interface.properties.map((prop) => ({
      ...prop,
      comment: md.render(prop.comment),
    })),
  }))
  const types = result.types.map((type) => ({
    ...type,
    comment: type.comment ? md.render(type.comment) : '',
  }))
  const targetPath = devMode ? './docs/api.html' : './docs/_site/api.html'
  let cssUrl
  if (!devMode) {
    const assetsFiles = await fs.readdir(path.join(workspace, './docs/_site/assets'))
    assetsFiles.forEach((file) => {
      if (file.includes('.css')) {
        cssUrl = `./assets/${file}`
      }
    })
  }

  await fs.outputFile(
    path.join(workspace, targetPath),
    apiTpl({
      cssUrl,
      interfaces,
      types,
    })
  )
  console.log('api.html done.')
}

main()
