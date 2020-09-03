import { Component, createRef } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import autobind from 'autobind-decorator'
import joinList from '../api/lists/joinList'
import { notifyError } from '../util/notify'

type Props = {
  onListJoined?: () => void | Promise<void>
}
type State = {
  isShowingModal: boolean
  isLoading: boolean
}

export default class CreateListButton extends Component<Props, State> {
  private formRef = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)

    this.state = {
      isShowingModal: false,
      isLoading: false,
    }
  }

  @autobind
  showModal() {
    this.setState({ isShowingModal: true })
  }

  @autobind
  hideModal() {
    this.setState({ isShowingModal: false })
  }

  @autobind
  async joinList({ inviteCode }) {
    this.hideModal()
    this.setState({ isLoading: true })
    const data = { code: inviteCode }

    try {
      await joinList(data)
    } catch (err) {
      console.error('Failed to join list', data, err)
      notifyError('Uitnodiging accepteren mislukt!', err)
      return
    } finally {
      this.setState({ isLoading: false })
    }

    if (this.props.onListJoined) {
      this.props.onListJoined()
    }
  }

  render() {
    return (
      <>
        <Button
          icon={<LinkOutlined />}
          loading={this.state.isLoading}
          onClick={this.showModal}
        >
          Uitnodiging accepteren
        </Button>

        <Modal
          title="Uitnodiging accepteren"
          visible={this.state.isShowingModal}
          onCancel={this.hideModal}
          onOk={() => this.formRef.current.submit()}
          cancelText="Terug"
          okText="Accepteer"
        >
          <Form
            ref={this.formRef}
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
