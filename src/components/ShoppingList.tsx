import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import { List, Input, Divider, ConfigProvider, Empty, notification } from 'antd'
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import ShoppingListItem from './ShoppingListItem'
import { Item, ItemLabel } from './ShoppingListItem'
import createItem from '../api/shoppingLists/createItem'
import finishItem from '../api/shoppingLists/finishItem'
import setItemLabels from '../api/shoppingLists/setItemLabels'
import listUnfinishedItems from '../api/shoppingLists/listUnfinishedItems'
import listItemsLabels from '../api/shoppingLists/listItemsLabels'

type Props = {}

type State = {
  items: Item[]
  labels: ItemLabel[]
  newItemTitle: string
  creatingItem: boolean
  updatingItems: string[]
}

export default class ShoppingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: [],
      labels: [],
      newItemTitle: '',
      creatingItem: false,
      updatingItems: [],
    }
  }

  async componentDidMount() {
    await this.refreshItems()
    await this.refreshItemsLabels()
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
        await createItem(data)
        this.setState({ newItemTitle: '' })
      } catch (err) {
        console.error('Failed to create item', data, err)

        notification.error({
          message: 'Toevoegen mislukt!',
          description: err.message,
          placement: 'topRight',
        })
      } finally {
        await this.refreshItems()
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
      await finishItem(item.id)
    } catch (err) {
      console.error('Failed to finish item', item, err)

      notification.error({
        message: 'Afronden mislukt!',
        description: err.message,
        placement: 'topRight',
      })
    } finally {
      await this.refreshItems()
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  @autobind
  async handleItemLabelsChange(item: Item, labels: ItemLabel[]) {
    try {
      await setItemLabels(item.id, labels)
    } catch (err) {
      console.error('Failed to update item labels', item, labels, err)

      notification.error({
        message: 'Labels bijwerken mislukt!',
        description: err.message,
        placement: 'topRight',
      })
    } finally {
      await this.refreshItems()
      await this.refreshItemsLabels()
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  async refreshItems() {
    const items = await listUnfinishedItems()
    this.setState({ items })
  }

  async refreshItemsLabels() {
    const labels = await listItemsLabels()
    this.setState({ labels })
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
    const labels = this.state.labels

    return (
      <ShoppingListItem
        item={item}
        existingLabels={labels}
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
