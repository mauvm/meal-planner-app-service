import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body.body

  try {
    await axios.post(
      `${getHost()}/v1/shopping-lists/items/${data.id}/set-labels`,
      {
        labels: data.labels,
      },
    )
    res.status(HttpStatus.OK).json({})
  } catch (err) {
    // @todo Replace with logger service
    console.log('Error while setting item labels', err)

    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message })
  }
}
