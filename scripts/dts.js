/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs-extra')
const path = require('path')

async function main() {
  const workspace = process.cwd()
  const pkgPath = path.join(workspace, 'packages')
  await fs.copy(
    path.join(pkgPath, './react-img/src/types.ts'),
    path.join(pkgPath, './react-img/dist/react-img.d.ts')
  )
  await fs.copy(
    path.join(pkgPath, './utils/src/types.ts'),
    path.join(pkgPath, './utils/dist/utils.d.ts')
  )
  console.log('dts done.')
}

main()
