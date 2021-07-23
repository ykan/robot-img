/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const showdown = require('showdown')
const pug = require('pug')
const { default: parseFiles } = require('@muya-ui/baozheng-tsdoc')

function isDev() {
  for (const arg of process.argv) {
    if (arg.trim() === '-d') {
      return true
    }
  }
  return false
}

async function main() {
  const devMode = isDev()
  const workspace = process.cwd()
  const converter = new showdown.Converter()
  const apiPug = path.join(workspace, './docs/api.pug')
  const apiTpl = pug.compileFile(apiPug)
  const result = parseFiles(['./packages/react-img/src/types.ts'], {
    tsconfigPath: './tsconfig.json',
  })
  const interfaces = result.props.map((interface) => ({
    ...interface,
    comment: interface.comment ? converter.makeHtml(interface.comment) : '',
    properties: interface.properties.map((prop) => ({
      ...prop,
      comment: converter.makeHtml(prop.comment),
    })),
  }))
  const types = result.types.map((type) => ({
    ...type,
    comment: type.comment ? converter.makeHtml(type.comment) : '',
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
