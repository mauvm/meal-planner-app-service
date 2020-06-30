import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0, { AccessTokenError } from '../../../../util/auth0'

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCache = auth0.tokenCache(req, res)
    const { accessToken } = await tokenCache.getAccessToken()
    const session = await auth0.getSession(req)
    let username = String(session.user.name || '')

    // Abbreviate to first name
    if (username.includes(' ')) {
      username = username.substr(0, username.indexOf(' '))
    }

    res.json({
      accessToken,
      username,
    })
  } catch (err) {
    // Not logged in or session expired
    if (err instanceof AccessTokenError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
      return
    }

    console.error('Error fetching JWT or user info', err)
    res
      .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message })
  }
}
