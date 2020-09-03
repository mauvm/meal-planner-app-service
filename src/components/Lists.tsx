import { Component, createRef } from 'react'
import { Typography, Space } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import ListComponent from './List'
import GettingStartedButton from './GettingStartedButton'
import CreateListButton from './CreateListButton'
import JoinListButton from './JoinListButton'
import { List } from '../util/types'
import fetchLists from '../api/lists/fetchLists'

const Paragraph = Typography.Paragraph

type Props = {}

type State = {
  isLoading: boolean

  lists: List[]
}

export default class Lists extends Component<Props, State> {
  private inviteFormRef = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: true,

      lists: [],
    }
  }

  async componentDidMount() {
    await this.refreshLists()
  }

  async refreshLists(): Promise<void> {
    this.setState({ isLoading: true, lists: [] })

    const lists = await fetchLists()
    this.setState({ isLoading: false, lists })
  }

  render() {
    const isLoading = this.state.isLoading
    const lists = this.state.lists

    return (
      <>
        <Paragraph>
          <Space>
            <GettingStartedButton />
            <CreateListButton
              onListCreated={async () => await this.refreshLists()}
            />
            <JoinListButton
              onListJoined={async () => await this.refreshLists()}
            />
          </Space>
        </Paragraph>

        {isLoading && <LoadingOutlined />}

        {!isLoading &&
          lists.length > 0 &&
          lists.map((list) => <ListComponent key={list.id} {...list} />)}
      </>
    )
  }
}
