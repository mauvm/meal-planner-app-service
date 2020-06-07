import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function createItem(data: {
  title: string
}): Promise<string> {
  const response = await axios.post(
    `${getHost()}/v1/shopping-lists/items`,
    data,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
  const newId = response.data.data?.id

  if (!newId) {
    const message = 'Could not determine new item ID from response'
    console.error(message, response)
    throw new Error(message)
  }

  return newId
}
