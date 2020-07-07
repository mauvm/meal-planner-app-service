import axios from 'axios'
import { getHost } from './service'
import { List } from '../../util/types'
import user from '../../util/user'

export default async function fetchLists(): Promise<List[]> {
  const response = await axios.get(`${getHost()}/v1/lists`, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
  })

  return response.data.data
}
