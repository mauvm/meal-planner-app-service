import axios from 'axios'
import { getHost } from './service'
import { ListItem } from '../../util/types'
import user from '../../util/user'

export default async function fetchUnfinishedItems(
  listId: string,
): Promise<ListItem[]> {
  const response = await axios.get(
    `${getHost()}/v1/lists/${listId}/unfinished-items`,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  return response.data.data
}
