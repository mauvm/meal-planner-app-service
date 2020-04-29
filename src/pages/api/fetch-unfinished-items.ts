import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import HttpStatus from 'http-status-codes'

export async function fetchUnfinishedItems(): Promise<any[]> {
  const response = await axios.get(
    'http://localhost:3000/v1/shopping-lists/unfinished-items',
  )
  return response.data.data
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = await fetchUnfinishedItems()
    res.status(HttpStatus.OK).json(items)
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).end({ message: err.message })
  }
}
