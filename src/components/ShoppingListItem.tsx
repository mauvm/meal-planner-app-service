import { Component } from 'react'
import autobind from 'autobind-decorator'
import { List, Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'
import { Item } from './ShoppingList'

type Props = {
  item: Item
  isFinishing?: boolean
  onFinish: (item: Item) => Promise<void>
  onLabelsChange: (item: Item) => Promise<void>
}

type State = {
  isEditing: boolean
}

export default class ShoppingListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isEditing: false,
    }
  }

  @autobind
  handleFinish(event: CheckboxChangeEvent) {
    this.props.onFinish(this.props.item)
  }

  @autobind
  handleEdit() {
    this.setState({ isEditing: true })
  }

  @autobind
  handleSave() {
    this.setState({ isEditing: false })
  }

  render() {
    const item = this.props.item
    const isFinishing = this.props.isFinishing
    const isEditing = this.state.isEditing

    return (
      <List.Item key={item.id}>
        <Checkbox
          value={item.id}
          checked={isFinishing}
          disabled={isFinishing}
          onChange={this.handleFinish}
        >
          {item.title}
        </Checkbox>
        {isEditing ? (
          <CheckOutlined onClick={this.handleSave} />
        ) : (
          <EditOutlined onClick={this.handleEdit} />
        )}
      </List.Item>
    )
  }
}
