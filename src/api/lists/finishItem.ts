import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function finishItem(
  listId: string,
  itemId: string,
): Promise<void> {
  await axios.post(
    `${getHost()}/v1/lists/${listId}/items/${itemId}/finish`,
    {},
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
}
