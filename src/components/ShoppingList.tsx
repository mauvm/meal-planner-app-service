import axios from 'axios'
import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import { List, Input, Divider, ConfigProvider, Empty } from 'antd'
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import ShoppingListItem from './ShoppingListItem'
import { Item, ItemLabel } from './ShoppingListItem'

type Props = {
  initialItems: Item[]
}

type State = {
  items: Item[]
  newItemTitle: string
  creatingItem: boolean
  updatingItems: string[]
}

export default class ShoppingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: props.initialItems,
      newItemTitle: '',
      creatingItem: false,
      updatingItems: [],
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

      const data = { title: this.state.newItemTitle }

      try {
        await axios.post('/api/create-item', {
          body: data,
        })
        this.setState({ newItemTitle: '' })
        await this.refreshItems()
      } catch (err) {
        // @todo Show notification
        console.error('Failed to create item', data, err)
      } finally {
        this.setState({ creatingItem: false })
      }
    }
  }

  @autobind
  async handleItemFinish(item: Item) {
    this.setState({
      updatingItems: this.state.updatingItems.concat([item.id]),
    })

    try {
      // @todo Change to ID in URL
      await axios.post('/api/finish-item', {
        body: { id: item.id },
      })
      await this.refreshItems()
    } catch (err) {
      // @todo Show notification
      console.error('Failed to finish item', item, err)
    } finally {
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  @autobind
  async handleItemLabelsChange(item: Item, labels: ItemLabel[]) {
    try {
      // @todo Change to ID in URL
      await axios.post('/api/set-item-labels', {
        body: { id: item.id, labels },
      })
      await this.refreshItems()
    } catch (err) {
      // @todo Show notification
      console.error('Failed to update item labels', item, labels, err)
    } finally {
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
    // item.labels = labels
    // this.setState({ items: this.state.items })
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
    const updatingItems = this.state.updatingItems

    return (
      <ShoppingListItem
        item={item}
        isUpdating={updatingItems.includes(item.id)}
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
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Geen producten"
            />
          )}
        >
          <List
            size="small"
            header={this.renderAddForm()}
            bordered
            dataSource={items}
            renderItem={this.renderItem}
          />
        </ConfigProvider>
      </>
    )
  }
}
