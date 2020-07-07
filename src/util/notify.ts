import { notification } from 'antd'

export function notifyError(message: string, err: Error): void {
  notification.error({
    message,
    description: err.message,
    placement: 'topRight',
  })
}
