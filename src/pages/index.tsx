import { Component } from 'react'
import { Divider } from 'antd'
import MainLayout from '../components/MainLayout'
import RequireAuthentication from '../components/RequireAuthentication'
import Homescreen from '../components/Homescreen'
import Lists from '../components/Lists'
import user from '../util/user'

type Props = {}
type State = {}

export default class IndexPage extends Component<Props, State> {
  render () {
    return (
      <MainLayout>
        <RequireAuthentication onUnauthenticated={() => <Homescreen />} onAuthenticated={() => this.forceUpdate()}>
          <Lists />
          <Divider orientation="right" plain>
            Hoi {user.username}!
            <Divider type="vertical" plain />
            <a href="/api/v1/auth/logout">Uitloggen</a>
          </Divider>
        </RequireAuthentication>
      </MainLayout>
    )
  }
}
