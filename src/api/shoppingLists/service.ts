import getConfig from 'next/config'

const {
  publicRuntimeConfig: { shoppingListServiceHost },
} = getConfig()

export function getHost(): string {
  return shoppingListServiceHost
}
