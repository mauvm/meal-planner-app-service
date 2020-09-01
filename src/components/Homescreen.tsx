import { Component } from 'react'
import { Space, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

type Props = {}
type State = {}

export default class Homescreen extends Component<Props, State> {
  render() {
    return (
      <Space>
        <Button
          type="default"
          icon={<UserOutlined />}
          href="/api/v1/auth/login"
        >
          Registreren
        </Button>

        <Button
          type="primary"
          icon={<UserOutlined />}
          href="/api/v1/auth/login"
        >
          Inloggen
        </Button>
      </Space>
    )
  }
}
