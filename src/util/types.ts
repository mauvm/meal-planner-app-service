export type Item = {
  id: string
  title: string
  createdAt: string
  finishedAt?: string
  labels?: ItemLabel[]
}

export type ItemLabel = string
