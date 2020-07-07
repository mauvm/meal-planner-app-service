import axios from 'axios'
import { getHost } from './service'
import { ListItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function createItem(
  listId: string,
  data: {
    title: string
    labels: ListItemLabel[]
  },
): Promise<string> {
  const response = await axios.post(
    `${getHost()}/v1/lists/${listId}/items`,
    data,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  const newId = response.data.id

  if (!newId) {
    const message = 'Could not determine new list item ID from response'
    console.error(message, response)
    throw new Error(message)
  }

  return newId
}
