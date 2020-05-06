import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body.body.id

  try {
    await axios.post(`${getHost()}/v1/shopping-lists/items/${id}/finish`)
    res.status(HttpStatus.OK).json({})
  } catch (err) {
    console.log('Error while finishing item', err) // @todo Replace with logger service
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message })
  }
}
