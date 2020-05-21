import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from '../../util/shoppingListService'

export async function listItemsLabels(): Promise<any[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/list-items-labels`,
  )
  return response.data.data
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = await listItemsLabels()
    res.status(HttpStatus.OK).json(items)
  } catch (err) {
    // @todo Replace with logger service
    console.log('Error while fetching items labels', err)

    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message })
  }
}
