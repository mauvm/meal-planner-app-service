import { Component, createRef, ChangeEvent } from 'react'
import autobind from 'autobind-decorator'
import { Button, Space, Modal, Input, Form } from 'antd'
import {
  LoadingOutlined,
  PlusCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import ListComponent from './List'
import { notifyError } from '../util/notify'
import { List } from '../util/types'
import fetchLists from '../api/lists/fetchLists'
import createList from '../api/lists/createList'
import joinList from '../api/lists/joinList'
import { FormInstance } from 'antd/lib/form'

type Props = {}

type State = {
  isLoading: boolean

  createListModalVisible: boolean
  isCreatingList: boolean

  joinListModalVisible: boolean
  isJoiningList: boolean

  lists: List[]
}

export default class Lists extends Component<Props, State> {
  private createFormRef = createRef<FormInstance>()
  private inviteFormRef = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: true,

      createListModalVisible: false,
      isCreatingList: false,

      joinListModalVisible: false,
      isJoiningList: false,

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

  @autobind
  showCreateListModal() {
    this.setState({ createListModalVisible: true })
  }

  @autobind
  closeCreateListModal() {
    this.setState({ createListModalVisible: false })
  }

  @autobind
  async createList({ title }) {
    this.closeCreateListModal()
    this.setState({ isCreatingList: true })
    const data = { title }

    try {
      await createList(data)
    } catch (err) {
      console.error('Failed to create list', data, err)
      notifyError('Toevoegen mislukt!', err)
      return
    } finally {
      this.setState({ isCreatingList: false })
    }

    await this.refreshLists()
  }

  @autobind
  showJoinListModal() {
    this.setState({ joinListModalVisible: true })
  }

  @autobind
  closeJoinListModal() {
    this.setState({ joinListModalVisible: false })
  }

  @autobind
  async joinList({ code }) {
    this.closeJoinListModal()
    this.setState({ isJoiningList: true })
    const data = { code }

    try {
      await joinList(data)
    } catch (err) {
      console.error('Failed to join list', data, err)
      notifyError('Uitnodiging accepteren mislukt!', err)
      return
    } finally {
      this.setState({ isJoiningList: false })
    }

    await this.refreshLists()
  }

  render() {
    const isLoading = this.state.isLoading
    const lists = this.state.lists

    return (
      <>
        {isLoading && <LoadingOutlined />}

        <Space>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            loading={this.state.isCreatingList}
            onClick={this.showCreateListModal}
          >
            Nieuwe lijst
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            loading={this.state.isJoiningList}
            onClick={this.showJoinListModal}
          >
            Uitnodiging accepteren
          </Button>
        </Space>

        <Modal
          title="Uitnodiging accepteren"
          visible={this.state.createListModalVisible}
          onCancel={this.closeCreateListModal}
          onOk={() => this.createFormRef.current.submit()}
        >
          <Form
            ref={this.createFormRef}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.createList}
          >
            <Form.Item
              name="title"
              label="Titel:"
              rules={[
                {
                  required: true,
                  message: 'Vul hier een titel in!',
                },
              ]}
              style={{ margin: 0 }}
            >
              <Input maxLength={512} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Uitnodiging accepteren"
          visible={this.state.joinListModalVisible}
          onCancel={this.closeJoinListModal}
          onOk={() => this.inviteFormRef.current.submit()}
        >
          <Form
            ref={this.inviteFormRef}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.joinList}
          >
            <Form.Item
              name="code"
              label="Uitnodigingscode:"
              rules={[
                {
                  required: true,
                  message: 'Vul hier de uitnodigingscode in!',
                },
              ]}
              style={{ margin: 0 }}
            >
              <Input maxLength={512} />
            </Form.Item>
          </Form>
        </Modal>

        {!isLoading &&
          lists.length > 0 &&
          lists.map((list) => <ListComponent key={list.id} {...list} />)}
      </>
    )
  }
}
