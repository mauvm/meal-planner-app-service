import getConfig from 'next/config'

const {
  publicRuntimeConfig: { listServiceHost },
} = getConfig()

export function getHost(): string {
  return listServiceHost
}
