import getConfig from 'next/config'

const {
  serverRuntimeConfig: { shoppingListService },
} = getConfig()

export function getHost(): string {
  return `http://${shoppingListService.host}:${shoppingListService.port}`
}
