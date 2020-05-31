import axios from 'axios'
import { getHost } from './service'
import { ItemLabel } from '../../util/types'

export default async function listItemsLabels(): Promise<ItemLabel[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/list-items-labels`,
  )
  return response.data.data
}
