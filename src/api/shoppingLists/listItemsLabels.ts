import axios from 'axios'
import { getHost } from './service'

export default async function listItemsLabels(): Promise<any[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/list-items-labels`,
  )
  return response.data.data
}
