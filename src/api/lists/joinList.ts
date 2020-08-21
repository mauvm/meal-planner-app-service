import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function joinList(data: { code: string }): Promise<void> {
  await axios.post(`${getHost()}/v1/lists/invite`, data, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
  })
}
