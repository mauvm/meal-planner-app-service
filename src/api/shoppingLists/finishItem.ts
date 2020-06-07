import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function finishItem(id: string): Promise<void> {
  await axios.post(
    `${getHost()}/v1/shopping-lists/items/${id}/finish`,
    {},
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
}
