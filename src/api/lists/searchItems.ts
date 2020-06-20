import axios from 'axios'
import { getHost } from './service'
import { Item } from '../../util/types'
import user from '../../util/user'

export default async function searchItems(query: string): Promise<Item[]> {
  const response = await axios.get(`${getHost()}/v1/lists/search-items`, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
    params: { query },
  })
  return response.data.data
}
