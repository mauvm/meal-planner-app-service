import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0 from '../../../util/auth0'

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await auth0.handleLogout(req, res)
  } catch (err) {
    console.error('Error logging out of Auth0', err)
    res.status(err.status || HttpStatus.UNAUTHORIZED).end(err.message)
  }
}
