import axios from 'axios'
import { getHost } from './service'
import { ItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function createItem(data: {
  title: string
  labels: ItemLabel[]
}): Promise<string> {
  const response = await axios.post(`${getHost()}/v1/lists/items`, data, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
  })

  const newId = response.data.id

  if (!newId) {
    const message = 'Could not determine new item ID from response'
    console.error(message, response)
    throw new Error(message)
  }

  return newId
}
