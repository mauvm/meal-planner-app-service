import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function createList(data: {
  title: string
}): Promise<string> {
  const response = await axios.post(`${getHost()}/v1/lists`, data, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
  })

  const newId = response.data.id

  if (!newId) {
    const message = 'Could not determine new list ID from response'
    console.error(message, response)
    throw new Error(message)
  }

  return newId
}
