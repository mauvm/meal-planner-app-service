import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Button } from 'antd'
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons'
import ListComponent from './List'
import { notifyError } from '../util/notify'
import { List } from '../util/types'
import fetchLists from '../api/lists/fetchLists'
import createList from '../api/lists/createList'

type Props = {}

type State = {
  isLoading: boolean
  isCreatingList: boolean

  lists: List[]
}

export default class Lists extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: true,
      isCreatingList: false,

      lists: [],
    }
  }

  async componentDidMount() {
    await this.refreshLists()
  }

  async refreshLists(): Promise<void> {
    this.setState({ isLoading: true })

    const lists = await fetchLists()
    this.setState({ isLoading: false, lists })
  }

  @autobind
  async createList() {
    this.setState({ isCreatingList: true })
    const data = { title: 'Boodschappen' }

    try {
      await createList(data)
      await this.refreshLists()
    } catch (err) {
      console.error('Failed to create item', data, err)
      notifyError('Toevoegen mislukt!', err)
    } finally {
      this.setState({ isCreatingList: false })
    }
  }

  render() {
    const isLoading = this.state.isLoading
    const lists = this.state.lists

    return (
      <>
        {isLoading && <LoadingOutlined />}

        {lists.length === 0 && (
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={this.createList}
          >
            Nieuwe lijst
          </Button>
        )}

        {lists.map((list) => (
          <ListComponent key={list.id} {...list} />
        ))}
      </>
    )
  }
}
