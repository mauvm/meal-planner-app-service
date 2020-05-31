import axios from 'axios'
import { getHost } from './service'

export default async function listUnfinishedItems(): Promise<any[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/unfinished-items`,
  )
  return response.data.data
}
