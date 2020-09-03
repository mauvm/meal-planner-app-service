import { Component, createRef } from 'react'
import autobind from 'autobind-decorator'
import { Button, Typography, Modal, Input, Form, Space } from 'antd'
import {
  LoadingOutlined,
  PlusCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import ListComponent from './List'
import GettingStartedButton from './GettingStartedButton'
import { notifyError } from '../util/notify'
import { List } from '../util/types'
import fetchLists from '../api/lists/fetchLists'
import createList from '../api/lists/createList'
import joinList from '../api/lists/joinList'

const Paragraph = Typography.Paragraph

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
  hideCreateListModal() {
    this.setState({ createListModalVisible: false })
  }

  @autobind
  async createList({ title }) {
    this.hideCreateListModal()
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
  hideJoinListModal() {
    this.setState({ joinListModalVisible: false })
  }

  @autobind
  async joinList({ inviteCode }) {
    this.hideJoinListModal()
    this.setState({ isJoiningList: true })
    const data = { code: inviteCode }

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
        <Paragraph>
          <Space>
            <GettingStartedButton />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              loading={this.state.isCreatingList}
              onClick={this.showCreateListModal}
            >
              Nieuwe lijst
            </Button>
            <Button
              icon={<LinkOutlined />}
              loading={this.state.isJoiningList}
              onClick={this.showJoinListModal}
            >
              Uitnodiging accepteren
            </Button>
          </Space>
        </Paragraph>

        {isLoading && <LoadingOutlined />}

        {!isLoading &&
          lists.length > 0 &&
          lists.map((list) => <ListComponent key={list.id} {...list} />)}

        <Modal
          title="Nieuwe lijst"
          visible={this.state.createListModalVisible}
          onCancel={this.hideCreateListModal}
          onOk={() => this.createFormRef.current.submit()}
          cancelText="Terug"
          okText="Aanmaken"
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
                  message: 'Vul hier een titel in',
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
          onCancel={this.hideJoinListModal}
          onOk={() => this.inviteFormRef.current.submit()}
          cancelText="Terug"
          okText="Accepteer"
        >
          <Form
            ref={this.inviteFormRef}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.joinList}
          >
            <Form.Item
              name="inviteCode"
              label="Uitnodigingscode:"
              rules={[
                {
                  required: true,
                  message: 'Vul hier de uitnodigingscode in',
                },
              ]}
              style={{ margin: 0 }}
            >
              <Input maxLength={512} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}
