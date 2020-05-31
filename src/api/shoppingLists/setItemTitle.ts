import axios from 'axios'
import { getHost } from './service'

export default async function setItemTitle(
  id: string,
  title: string,
): Promise<void> {
  await axios.patch(`${getHost()}/v1/shopping-lists/items/${id}`, {
    title,
  })
}
