/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs-extra')
const path = require('path')

async function main() {
  const workspace = process.cwd()
  await fs.copy(path.join(workspace, 'docs/imgs'), path.join(workspace, 'docs/_site/imgs'))
  console.log('copy imgs done.')
}

main()
