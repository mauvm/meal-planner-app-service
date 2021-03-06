import axios from 'axios'
import { getHost } from './service'
import { ListItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function setItemLabels(
  listId: string,
  itemId: string,
  labels: ListItemLabel[],
): Promise<void> {
  await axios.put(
    `${getHost()}/v1/lists/${listId}/items/${itemId}/labels`,
    {
      labels,
    },
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
}
