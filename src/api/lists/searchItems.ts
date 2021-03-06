import axios from 'axios'
import { getHost } from './service'
import { ListItem } from '../../util/types'
import user from '../../util/user'

export default async function searchItems(
  listId: string,
  query: string,
): Promise<ListItem[]> {
  const response = await axios.get(
    `${getHost()}/v1/lists/${listId}/search-items`,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      params: { query },
    },
  )

  return response.data.data
}
