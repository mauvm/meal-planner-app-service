import { Component, createRef } from 'react'
import { Button, Modal, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import autobind from 'autobind-decorator'
import createList from '../api/lists/createList'
import { notifyError } from '../util/notify'

type Props = {
  onListCreated?: () => void | Promise<void>
}
type State = {
  isShowingModal: boolean
}

export default class CreateListButton extends Component<Props, State> {
  private formRef = createRef<FormInstance>()

  constructor(props: Props) {
    super(props)

    this.state = {
      isShowingModal: false,
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
  async createList({ title }) {
    this.hideModal()
    this.setState({ isShowingModal: true })
    const data = { title }

    try {
      await createList(data)
    } catch (err) {
      console.error('Failed to create list', data, err)
      notifyError('Toevoegen mislukt!', err)
      return
    } finally {
      this.setState({ isShowingModal: false })
    }

    if (this.props.onListCreated) {
      this.props.onListCreated()
    }
  }

  render() {
    return (
      <>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          loading={this.state.isShowingModal}
          onClick={this.showModal}
        >
          Nieuwe lijst
        </Button>

        <Modal
          title="Nieuwe lijst"
          visible={this.state.isShowingModal}
          onCancel={this.hideModal}
          onOk={() => this.formRef.current.submit()}
          cancelText="Terug"
          okText="Aanmaken"
        >
          <Form
            ref={this.formRef}
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
      </>
    )
  }
}
