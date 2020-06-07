import axios from 'axios'
import { getHost } from './service'
import { Item } from '../../util/types'
import user from '../../util/user'

export default async function listUnfinishedItems(): Promise<Item[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/unfinished-items`,
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
  return response.data.data
}
