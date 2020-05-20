import axios from 'axios'
import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import { List, Input, Divider } from 'antd'
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import ShoppingListItem from './ShoppingListItem'

export type Item = {
  id: string
  title: string
  createdAt: string
  finishedAt?: string
}

type Props = {
  initialItems: Item[]
}

type State = {
  items: Item[]
  newItemTitle: string
  creatingItem: boolean
  finishingItems: string[]
}

export default class ShoppingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: props.initialItems,
      newItemTitle: '',
      creatingItem: false,
      finishingItems: [],
    }
  }

  @autobind
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItemTitle: event.currentTarget.value })
  }

  @autobind
  async handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === Key.Enter) {
      if (!this.state.newItemTitle) {
        return
      }

      this.setState({ creatingItem: true })

      try {
        await axios.post('/api/create-item', {
          body: { title: this.state.newItemTitle },
        })
        this.setState({ newItemTitle: '' })
        await this.refreshItems()
      } finally {
        this.setState({ creatingItem: false })
      }
    }
  }

  @autobind
  async handleItemFinish(item: Item) {
    this.setState({
      finishingItems: this.state.finishingItems.concat([item.id]),
    })

    try {
      // @todo Change to ID in URL
      await axios.post('/api/finish-item', {
        body: { id: item.id },
      })
      await this.refreshItems()
    } finally {
      this.setState({
        finishingItems: this.state.finishingItems.filter(
          (idToFinish) => idToFinish !== item.id,
        ),
      })
    }
  }

  @autobind
  async handleItemLabelsChange(item: Item) {
    console.log(item)
  }

  async refreshItems() {
    const response = await axios.get('/api/fetch-unfinished-items')
    const items = response.data
    this.setState({ items })
  }

  renderAddForm() {
    return (
      <Input
        value={this.state.newItemTitle}
        disabled={this.state.creatingItem}
        prefix={
          this.state.creatingItem ? <LoadingOutlined /> : <PlusCircleOutlined />
        }
        placeholder="Voeg product toe.."
        autoComplete="on"
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    )
  }

  @autobind
  renderItem(item: Item) {
    const finishingItems = this.state.finishingItems

    return (
      <ShoppingListItem
        item={item}
        isFinishing={finishingItems.includes(item.id)}
        onFinish={this.handleItemFinish}
        onLabelsChange={this.handleItemLabelsChange}
      />
    )
  }

  render() {
    const items = this.state.items

    return (
      <>
        <Divider orientation="left">Boodschappen</Divider>
        <List
          size="small"
          header={this.renderAddForm()}
          bordered
          dataSource={items}
          renderItem={this.renderItem}
        />
      </>
    )
  }
}
