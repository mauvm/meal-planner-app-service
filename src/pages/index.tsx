import { Component } from 'react'
import { notification, Divider, Button } from 'antd'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import HttpStatus from 'http-status-codes'
import fetchMe from '../api/auth/fetchMe'
import user from '../util/user'
import Lists from '../components/Lists'
import MainLayout from '../components/MainLayout'

type Props = {}
type State = {
  isAuthorizing: boolean
  isAuthorized: boolean
  username: string
}

export default class IndexPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isAuthorizing: true,
      isAuthorized: false,
      username: '',
    }
  }

  componentDidMount() {
    this.authorize()
  }

  async authorize() {
    this.setState({
      isAuthorizing: true,
      isAuthorized: false,
      username: '',
    })

    try {
      // Check if logged in (has session)
      const me = await fetchMe()

      // Assign user state
      Object.assign(user, me)

      this.setState({
        isAuthorizing: false,
        isAuthorized: true,
        username: me.username,
      })
    } catch (err) {
      // Not logged in
      if (err.response?.status === HttpStatus.UNAUTHORIZED) {
        this.setState({
          isAuthorizing: false,
          isAuthorized: false,
        })
        return
      }

      console.error('Error logging in', { ...err })
      notification.error({
        message: 'Fout bij inloggen!',
        description: err.message,
        placement: 'topRight',
      })
    }
  }

  render() {
    const isAuthorizing = this.state.isAuthorizing
    const isAuthorized = this.state.isAuthorized
    const username = this.state.username

    return (
      <MainLayout>
        {isAuthorizing && <LoadingOutlined />}
        {!isAuthorizing && isAuthorized && (
          <>
            <Lists />
            <Divider orientation="right" plain>
              Hoi {username}!
              <Divider type="vertical" plain />
              <a href="/api/v1/auth/logout">Uitloggen</a>
            </Divider>
          </>
        )}
        {!isAuthorizing && !isAuthorized && (
          <Button
            type="primary"
            icon={<UserOutlined />}
            href="/api/v1/auth/login"
          >
            Inloggen
          </Button>
        )}
      </MainLayout>
    )
  }
}
