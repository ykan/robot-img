/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check
const { default: parseFiles } = require('@muya-ui/baozheng-tsdoc')

const fs = require('fs-extra')
const path = require('path')
const showdown = require('showdown')

async function main() {
  const workspace = process.cwd()
  const { types, props } = parseFiles([path.join(workspace, './packages/react-img/src/types.ts')], {
    tsconfigPath: path.join(workspace, './tsconfig.json'),
  })
  const converter = new showdown.Converter()
  const typesContent = types
    .map((typeItem) => {
      const typeText =
        typeItem.typeKind === 'union' ? typeItem.types.join(' | ') : typeItem.types.join(' ')
      const typeHTML = converter.makeHtml(`\`${typeText}\``)

      const descHTML = converter.makeHtml(typeItem.comment).replace(/[\n\r]/g, '')
      return `| ${typeItem.name} | ${typeHTML}  | ${descHTML} |`
    })
    .join('\n')

  const interfacesContent = props
    .map((prop) => {
      const propsContent = prop.properties
        .map((typeItem) => {
          const typeText =
            typeItem.typeKind === 'union' ? typeItem.types.join(' | ') : typeItem.types.join(' ')

          const typeHTML = converter.makeHtml(`\`${typeText}\``)
          const descHTML = converter.makeHtml(typeItem.comment).replace(/[\n\r]/g, '')
          return `| ${typeItem.name} | ${typeHTML} | ${typeItem.optional}  | ${descHTML} |`
        })
        .join('\n')
      return `
### ${prop.name}
| Property | Type | Optional | Desc |
| --- | --- | --- | --- |
${propsContent}
    `.trim()
    })
    .join('\n\n')
  const apiContent = `# API
## Types
| Name | Type | Desc |
| --- | --- | --- |
${typesContent}

## Interfaces
${interfacesContent}
`
  await fs.outputFile(path.join(workspace, 'docs/API.md'), apiContent)
}

main()
