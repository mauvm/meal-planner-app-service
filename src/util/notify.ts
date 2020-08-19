import { AxiosError } from 'axios'
import { notification } from 'antd'

export function notifyError(message: string, err: AxiosError): void {
  console.error('Notify error', err, err.response)

  notification.error({
    message,
    description: `${err.message}: ${err.response.data?.message}`,
    placement: 'topRight',
  })
}
