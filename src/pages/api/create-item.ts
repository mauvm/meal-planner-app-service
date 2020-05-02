import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body.body

  try {
    const response = await axios.post(`${getHost()}/v1/shopping-lists/items`, {
      title: data.title,
    })
    res.status(HttpStatus.OK).json(response.data?.data)
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).end({ message: err.message })
  }
}
