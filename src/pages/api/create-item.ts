import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body.body

  try {
    const response = await axios.post(
      `${getHost()}/v1/shopping-lists/items`,
      {
        title: data.title,
      },
      {
        // Expect 303 See Other
        maxRedirects: 0,
        validateStatus(status) {
          return status === HttpStatus.SEE_OTHER
        },
      },
    )
    const id = response.headers['x-resource-id']
    res.status(HttpStatus.OK).json({ id })
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message })
  }
}
