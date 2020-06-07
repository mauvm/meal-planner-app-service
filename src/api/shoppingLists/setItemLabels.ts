import axios from 'axios'
import { getHost } from './service'
import { ItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function setItemLabels(
  id: string,
  labels: ItemLabel[],
): Promise<void> {
  await axios.post(
    `${getHost()}/v1/shopping-lists/items/${id}/set-labels`,
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
