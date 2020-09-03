import { Component, ReactElement } from 'react'
import { notification } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import HttpStatus from 'http-status-codes'
import fetchMe from '../api/auth/fetchMe'
import user from '../util/user'

type Props = {
  onUnauthenticated: () => ReactElement
  onAuthenticated: () => void
  children: ReactElement[]
}
type State = {
  isAuthorizing: boolean
  isAuthorized: boolean
}

export default class RequireAuthentication extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isAuthorizing: true,
      isAuthorized: false,
    }
  }

  async componentDidMount() {
    await this.authorize()
  }

  async authorize() {
    this.setState({
      isAuthorizing: true,
      isAuthorized: false,
    })

    try {
      // Check if logged in (has session)
      const me = await fetchMe()

      // Assign user state
      Object.assign(user, me)

      this.setState({
        isAuthorizing: false,
        isAuthorized: true,
      })

      if (this.props.onAuthenticated) {
        this.props.onAuthenticated()
      }
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

    return (
      <>
        {isAuthorizing && <LoadingOutlined />}
        {!isAuthorizing && isAuthorized && this.props.children}
        {!isAuthorizing && !isAuthorized && this.props.onUnauthenticated()}
      </>
    )
  }
}
