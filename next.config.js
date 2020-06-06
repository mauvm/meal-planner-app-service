const withSourceMaps = require('@zeit/next-source-maps')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER

  return withSourceMaps({
    webpack(config, options) {
      return config
    },

    publicRuntimeConfig: {
      // Empty for same domain (i.e. `${shoppingListServiceHost}/v1/shopping-lists/items`)
      shoppingListServiceHost: isDevelopment ? 'http://localhost:3000' : '',
    },
  })
}
