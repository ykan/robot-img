// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'docs/examples': {
      url: '/',
    },
    'packages/utils/src': {
      url: '/dist/utils/',
    },
    'packages/react-img/src': {
      url: '/dist/react-img/',
    },
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
  alias: {
    '@robot-img/utils': './packages/utils/src',
    '@robot-img/react-img': './packages/react-img/src',
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
}
