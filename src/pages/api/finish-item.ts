import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const uuid = req.body.body.uuid

  try {
    await axios.post(`${getHost()}/v1/shopping-lists/items/${uuid}/finish`)
    res.status(HttpStatus.OK).json({})
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).end({ message: err.message })
  }
}
