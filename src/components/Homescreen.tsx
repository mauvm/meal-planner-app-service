import { Component } from 'react'
import { Typography, Space, Button, Divider } from 'antd'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

type Props = {}
type State = {}

export default class Homescreen extends Component<Props, State> {
  render() {
    return (
      <>
        <Title level={3}>Boodschappen</Title>

        <Space>
          <Button
            type="default"
            icon={<UserAddOutlined />}
            href="/api/v1/auth/signup"
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

        <Divider />

        <Paragraph>
          Made with <span style={{ color: 'red' }}>♥</span> by{' '}
          <a href="https://github.com/users/mauvm/projects/1" target="_blank">
            Maurits
          </a>
        </Paragraph>
      </>
    )
  }
}
