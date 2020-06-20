import axios from 'axios'
import { getHost } from './service'
import { ItemLabel } from '../../util/types'
import user from '../../util/user'

export default async function listItemsLabels(): Promise<ItemLabel[]> {
  const response = await axios.get(`${getHost()}/v1/lists/list-items-labels`, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
  })
  return response.data.data
}
