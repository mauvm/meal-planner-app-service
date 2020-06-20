import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from './service'
import user from '../../util/user'

export default async function createItem(data: {
  title: string
}): Promise<string> {
  const response = await axios.post(`${getHost()}/v1/lists/items`, data, {
    headers: {
      authorization: `Bearer ${user.accessToken}`,
    },
    maxRedirects: 0,
    validateStatus: (status) => status === HttpStatus.SEE_OTHER,
  })

  const newId = response.headers['x-resource-id'] || ''

  if (!newId) {
    const message = 'Could not determine new item ID from response'
    console.error(message, response)
    throw new Error(message)
  }

  return newId
}
