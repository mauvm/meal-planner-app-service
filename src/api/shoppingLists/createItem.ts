import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { getHost } from './service'

export default async function createItem(data: {
  title: string
}): Promise<void> {
  await axios.post(`${getHost()}/v1/shopping-lists/items`, data, {
    // Expect 303 See Other
    maxRedirects: 0,
    validateStatus(status) {
      return status === HttpStatus.SEE_OTHER
    },
  })
}
