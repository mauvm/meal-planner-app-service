import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0 from '../../../util/auth0'

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCache = auth0.tokenCache(req, res)
    const { accessToken } = await tokenCache.getAccessToken()
    const session = await auth0.getSession(req)

    res.json({
      accessToken,
      username: session.user.name,
    })
  } catch (err) {
    console.error('Error fetching JWT or user info', err)

    res
      .status(err.status || HttpStatus.UNAUTHORIZED)
      .json({ message: err.message })
  }
}
