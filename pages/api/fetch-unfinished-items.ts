import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get(
      'http://localhost:3000/v1/shopping-lists/unfinished-items',
    )
    res.status(HttpStatus.OK).json(response.data)
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).end({ message: err.message })
  }
}
