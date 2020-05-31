import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import { List, Input, Divider, ConfigProvider, Empty, notification } from 'antd'
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import ShoppingListItem from './ShoppingListItem'
import { Item, ItemLabel } from './ShoppingListItem'
import createItem from '../api/shoppingLists/createItem'
import finishItem from '../api/shoppingLists/finishItem'
import setItemTitle from '../api/shoppingLists/setItemTitle'
import setItemLabels from '../api/shoppingLists/setItemLabels'
import listUnfinishedItems from '../api/shoppingLists/listUnfinishedItems'
import listItemsLabels from '../api/shoppingLists/listItemsLabels'

type Props = {}

type State = {
  isLoading: boolean
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
      isLoading: true,
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
    this.setState({ isLoading: false })
  }

  async refreshItems() {
    const items = await listUnfinishedItems()
    this.setState({ items })
  }

  async refreshItemsLabels() {
    const labels = await listItemsLabels()
    this.setState({ labels })
  }

  @autobind
  handleNewItemTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItemTitle: event.currentTarget.value })
  }

  @autobind
  async handleNewItemTitleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
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
        this.notifyError('Toevoegen mislukt!', err)
      } finally {
        await this.refreshItems()
        this.setState({ creatingItem: false })
      }
    }
  }

  @autobind
  async handleItemFinish(item: Item) {
    await this.updateItem(
      item,
      async () => {
        try {
          await finishItem(item.id)
        } catch (err) {
          console.error('Failed to finish item', item, err)
          throw err
        }
      },
      { failedMessage: 'Afronden mislukt!' },
    )
  }

  @autobind
  async handleItemTitleChange(item: Item, title: string) {
    await this.updateItem(
      item,
      async () => {
        try {
          await setItemTitle(item.id, title)
        } catch (err) {
          console.error('Failed to set item title', item, title, err)
          throw err
        }
      },
      { failedMessage: 'Omschrijving bijwerken mislukt!' },
    )
  }

  @autobind
  async handleItemLabelsChange(item: Item, labels: ItemLabel[]) {
    await this.updateItem(
      item,
      async () => {
        try {
          await setItemLabels(item.id, labels)
        } catch (err) {
          console.error('Failed to update item labels', item, labels, err)
          throw err
        } finally {
          await this.refreshItemsLabels()
        }
      },
      { failedMessage: 'Labels bijwerken mislukt!' },
    )
  }

  async updateItem(
    item: Item,
    updateFunction: () => Promise<void>,
    options: { failedMessage?: string } = {},
  ) {
    // Disable item
    this.setState({
      updatingItems: this.state.updatingItems.concat([item.id]),
    })

    try {
      await updateFunction()
    } catch (err) {
      this.notifyError(options.failedMessage || 'Aanpassing niet gelukt!', err)
    } finally {
      await this.refreshItems()

      // Enable item
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  notifyError(message: string, err: Error) {
    notification.error({
      message,
      description: err.message,
      placement: 'topRight',
    })
  }

  renderNewItemForm() {
    const isLoading = this.state.isLoading

    return (
      <Input
        value={this.state.newItemTitle}
        disabled={isLoading || this.state.creatingItem}
        prefix={
          this.state.creatingItem ? <LoadingOutlined /> : <PlusCircleOutlined />
        }
        placeholder="Voeg product toe.."
        autoComplete="on"
        onChange={this.handleNewItemTitleChange}
        onKeyUp={this.handleNewItemTitleKeyUp}
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
        onTitleChange={this.handleItemTitleChange}
        onLabelsChange={this.handleItemLabelsChange}
      />
    )
  }

  render() {
    const isLoading = this.state.isLoading
    const items = this.state.items

    return (
      <>
        <Divider orientation="left">Boodschappen</Divider>
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={isLoading ? 'Laden..' : 'Geen producten'}
            />
          )}
        >
          <List
            size="small"
            header={this.renderNewItemForm()}
            bordered
            dataSource={items}
            renderItem={this.renderItem}
          />
        </ConfigProvider>
      </>
    )
  }
}
