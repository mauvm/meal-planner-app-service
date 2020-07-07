import axios from 'axios'
import { getHost } from './service'
import { ListItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function fetchItemsLabels(
  listId: string,
): Promise<ListItemLabel[]> {
  const response = await axios.get(
    `${getHost()}/v1/lists/${listId}/items-labels`,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )

  return response.data.data
}
