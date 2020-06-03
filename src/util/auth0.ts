import getConfig from 'next/config'
import { initAuth0 } from '@auth0/nextjs-auth0'

const { serverRuntimeConfig } = getConfig()
const config = serverRuntimeConfig.auth0

export default initAuth0({
  domain: config.domain,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  audience: serverRuntimeConfig.host,
  scope: [
    'openid',
    // Get name of user
    'profile',
    // Fetch JWT access token
    'id_token',
    // Ensure we'll receive a refresh token
    'offline_access',
  ].join(' '),
  redirectUri: `${serverRuntimeConfig.host}/api/auth/callback`,
  postLogoutRedirectUri: `${serverRuntimeConfig.host}/`,
  session: {
    cookieSecret: config.cookieSecret,
    cookieLifetime: 60 * 60 * 8, // 8 hours
    // cookieDomain: serverRuntimeConfig.host, // Breaks session creation
    storeIdToken: true,
    storeAccessToken: true,
    storeRefreshToken: true,
  },
})
