import { Component, createRef } from 'react'
import autobind from 'autobind-decorator'
import { Button, Typography, Modal, Input, Form, Space } from 'antd'
import { LoadingOutlined, LinkOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import ListComponent from './List'
import GettingStartedButton from './GettingStartedButton'
import CreateListButton from './CreateListButton'
import { notifyError } from '../util/notify'
import { List } from '../util/types'
import fetchLists from '../api/lists/fetchLists'
import joinList from '../api/lists/joinList'

const Paragraph = Typography.Paragraph

type Props = {}

type State = {
  isLoading: boolean

  joinListModalVisible: boolean
  isJoiningList: boolean

  lists: List[]
}

export default class Lists extends Component<Props, State> {
  private inviteFormRef = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: true,

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
            <CreateListButton
              onListCreated={async () => await this.refreshLists()}
            />

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
