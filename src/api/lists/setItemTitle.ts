import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function setItemTitle(
  listId: string,
  itemId: string,
  title: string,
): Promise<void> {
  await axios.patch(
    `${getHost()}/v1/lists/${listId}/items/${itemId}`,
    {
      title,
    },
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
}
