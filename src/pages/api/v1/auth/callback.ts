import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0 from '../../../../util/auth0'

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await auth0.handleCallback(req, res, { redirectTo: '/' })
  } catch (err) {
    console.error('Error handling Auth0 callback', err)

    res
      .status(err.status || HttpStatus.BAD_REQUEST)
      .json({ message: err.message })
  }
}
