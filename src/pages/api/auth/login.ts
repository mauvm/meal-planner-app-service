import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0 from '../../../util/auth0'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleLogin(req, res, {
      authParams: {
        ui_locales: 'nl',
      },
    })
  } catch (err) {
    console.error('Error logging in to Auth0', err)
    res.status(err.status || HttpStatus.UNAUTHORIZED).end(err.message)
  }
}
