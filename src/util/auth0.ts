import dotenv from 'dotenv'
import { initAuth0 } from '@auth0/nextjs-auth0'
import AccessTokenError from '@auth0/nextjs-auth0/dist/tokens/access-token-error'

dotenv.config()

const config = {
  host:
    process.env.NEXTJS_HOST ||
    process.env.HOST_DOMAIN ||
    'http://localhost:8080',
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  cookieSecret: process.env.AUTH0_COOKIE_SECRET,
}

export { AccessTokenError }

export default initAuth0({
  domain: config.domain,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  audience: config.audience,
  scope: [
    'openid',
    // Get name of user
    'profile',
    // Fetch JWT access token
    'id_token',
    // Ensure we'll receive a refresh token
    'offline_access',
  ].join(' '),
  redirectUri: `${config.host}/api/v1/auth/callback`,
  postLogoutRedirectUri: `${config.host}/`,
  session: {
    cookieSecret: config.cookieSecret,
    cookieLifetime: 60 * 60 * 8, // 8 hours
    // cookieDomain: config.host, // Breaks session creation
    storeIdToken: true,
    storeAccessToken: true,
    storeRefreshToken: true,
  },
})
