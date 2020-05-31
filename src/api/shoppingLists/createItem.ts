import axios from 'axios'
import { getHost } from './service'

export default async function createItem(data: {
  title: string
}): Promise<void> {
  await axios.post(`${getHost()}/v1/shopping-lists/items`, data)
}
