const withSourceMaps = require('@zeit/next-source-maps')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const dotenv = require('dotenv')

dotenv.config()

module.exports = (phase) => {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER

  return withSourceMaps({
    webpack(config, options) {
      return config
    },

    serverRuntimeConfig: {
      host: process.env.NEXTJS_HOST || 'http://localhost:8080',
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        cookieSecret: process.env.AUTH0_COOKIE_SECRET,
      },
    },

    publicRuntimeConfig: {
      // Empty for same domain (i.e. `${shoppingListServiceHost}/v1/shopping-lists/items`)
      shoppingListServiceHost: isDevelopment ? 'http://localhost:3000' : '',
    },
  })
}
