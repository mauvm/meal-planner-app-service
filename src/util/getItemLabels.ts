import { ListItem, ListItemLabel } from './types'

export default function getItemLabels(item: ListItem): ListItemLabel[] {
  return (item.labels || []).sort()
}
