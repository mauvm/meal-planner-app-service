import { NextApiRequest, NextApiResponse } from 'next'
import HttpStatus from 'http-status-codes'
import auth0 from '../../../../util/auth0'

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await auth0.handleLogin(req, res, {
      authParams: {
        ui_locales: 'nl',

        // Requires change to Auth0's Universal Login page too:
        // Add `initialScreen: config.extraParams.prompt === 'signup' ? 'signUp' : 'login',` to Auth0Lock's options
        // See https://github.com/sandrinodimattia/nextjs-auth0-example/commit/ce7f73b24ea04398a52e959cc5ac43842c509397
        prompt: 'signup',
      },
    })
  } catch (err) {
    console.error('Error logging in to Auth0', err)

    res
      .status(err.status || HttpStatus.UNAUTHORIZED)
      .json({ message: err.message })
  }
}
