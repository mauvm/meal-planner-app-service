import { Component } from 'react'
import Router from 'next/router'
import axios from 'axios'
import { Divider } from 'antd'
import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'
import auth0 from '../util/auth0'

type Props = {
  accessToken?: string
  username?: string
}
type State = {}

export default class IndexPage extends Component<Props, State> {
  componentDidMount() {
    this.verifyAccessToken()
  }

  isLoggedIn(): boolean {
    return Boolean(this.props.accessToken)
  }

  verifyAccessToken() {
    if (!this.isLoggedIn()) {
      Router.push('/api/auth/login')
      return
    }

    // Use access token for all API calls
    const sameDomain = `${window.location.protocol}//${window.location.host}`

    axios.interceptors.request.use((config) => {
      if (config.url.startsWith(sameDomain)) {
        config.headers.Authorization = `Bearer ${this.props.accessToken}`
      }

      return config
    })
  }

  render() {
    const username = this.props.username

    return (
      <MainLayout>
        {this.isLoggedIn() ? (
          <>
            <ShoppingList />
            <Divider orientation="right" plain>
              Hoi {username}!
              <Divider type="vertical" plain />
              <a href="/api/auth/logout">Uitloggen</a>
            </Divider>
          </>
        ) : (
          <>Redirecting to login page..</>
        )}
      </MainLayout>
    )
  }
}

export async function getServerSideProps({
  req,
  res,
}): Promise<{ props: Props }> {
  try {
    const tokenCache = auth0.tokenCache(req, res)
    const { accessToken } = await tokenCache.getAccessToken()
    const session = await auth0.getSession(req)

    return {
      props: {
        accessToken,
        username: session.user.name,
      },
    }
  } catch (err) {
    console.error('Could not fetch access token:', err.message)
    return { props: {} }
  }
}
