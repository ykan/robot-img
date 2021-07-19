/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs-extra')

async function main() {
  await fs.copy('./packages/react-img/src/types.ts', './packages/react-img/dist/react-img.d.ts')
  await fs.copy('./packages/utils/src/types.ts', './packages/utils/dist/utils.d.ts')
}

main()
