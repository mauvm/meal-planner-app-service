const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
]

export default function getLabelColor(label: string): string {
  // Deterministic colors
  const index =
    label
      .toLowerCase()
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0) % colors.length

  return colors[index]
}
