import { Item, ItemLabel } from './types'

export default function getItemLabels(item: Item): ItemLabel[] {
  return (item.labels || []).sort()
}
