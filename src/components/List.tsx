import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import {
  List as AntList,
  Select,
  Divider,
  Tag,
  ConfigProvider,
  Empty,
  notification,
  Spin,
} from 'antd'
import { debounce } from 'helpful-decorators'
import ListItem from './ListItem'
import createItem from '../api/lists/createItem'
import searchItems from '../api/lists/searchItems'
import finishItem from '../api/lists/finishItem'
import setItemTitle from '../api/lists/setItemTitle'
import setItemLabels from '../api/lists/setItemLabels'
import listUnfinishedItems from '../api/lists/listUnfinishedItems'
import listItemsLabels from '../api/lists/listItemsLabels'
import { Item, ItemLabel } from '../util/types'
import getLabelColor from '../util/getLabelColor'
import getItemLabels from '../util/getItemLabels'

const { Option } = Select

type Props = {}

type State = {
  isLoading: boolean

  items: Item[]
  labels: ItemLabel[]

  newItemTitle: string
  isCreatingItem: boolean

  isSearching: boolean
  lastSearchQuery: string
  searchResults: Item[]

  updatingItems: string[]
}

export default class List extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isLoading: true,

      items: [],
      labels: [],

      newItemTitle: '',
      isCreatingItem: false,

      isSearching: false,
      lastSearchQuery: '',
      searchResults: [],

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
    this.sortItems(items)
    this.setState({ items })
  }

  async refreshItemsLabels() {
    const labels = await listItemsLabels()
    this.setState({ labels })
  }

  /**
   * Smart sorting by known labels
   * These labels are ordered by our store route
   *
   * 1. Items without labels
   * 2. Items with known labels (in order of known labels)
   * 3. Items with unknown labels (sorted by amount)
   * 4. On equal labels/label amounts: sort by title
   */
  sortItems(items: Item[]) {
    const knownLabels = [
      'Groente & Fruit',
      'Vega & Vlees',
      'Deli',
      'Brood',
      'Zuivel',
      'Houdbaar',
      'Drinken',
      'Diepvries',
      'Non-Food',
    ]

    function score(item: Item) {
      const labels = getItemLabels(item)

      // Find index of first known label
      let knownLabelIndex = knownLabels.findIndex((knownLabel: string) =>
        labels.includes(knownLabel),
      )

      // If labels are available, but no known label is included:
      // add high value to move to the bottom of the list
      if (labels.length && knownLabelIndex === -1) {
        knownLabelIndex = knownLabels.length
      }

      // Index starts at 0, so add 1 to ensure we don't use negative numbers
      // Multiple index by 100 to give precendence to first 99 labels
      return labels.length + (knownLabelIndex + 1) * 100
    }

    // Sort by score or by title on equal score
    items.sort(
      (a: Item, b: Item) =>
        score(a) - score(b) + a.title.localeCompare(b.title),
    )
  }

  @autobind
  @debounce(500, { leading: false })
  async handleNewItemSearch(query: string) {
    if (!query) {
      return
    }

    this.setState({ isSearching: true, lastSearchQuery: query })

    try {
      const items = (await searchItems(query)) as Item[]

      // Ignore results if query changed
      if (query !== this.state.lastSearchQuery) {
        return
      }

      this.setState({ searchResults: items })
    } catch (err) {
      console.error('Failed to search for items', query, err)
      this.notifyError(`Zoeken naar "${query}" mislukt!`, err)
    } finally {
      this.setState({ isSearching: false })
    }
  }

  @autobind
  async handleNewItemSelected(id: string) {
    const item = this.state.searchResults.find((item) => item.id === id)

    if (!item) {
      console.error(`Could create item by existing "${id}"`)
      return
    }

    // Update state and wait until resolved
    await new Promise((resolve) =>
      this.setState({ newItemTitle: item.title }, resolve),
    )

    const title = item.title
    const labels = getItemLabels(item)
    await this.createItem({ title, labels })
  }

  @autobind
  async handleNewItemTitleKeyUp(event: React.KeyboardEvent) {
    // Create item on ENTER
    if (event.keyCode === Key.Enter && this.state.newItemTitle) {
      await this.createItem({ title: this.state.newItemTitle, labels: [] })
      return
    }

    // Update new item title in state
    // The target refers to the HTMLInputElement, but is of type EventTarget
    const newItemTitle = String((event.target as any).value)
    this.setState({
      newItemTitle,
    })
  }

  async createItem(data: { title: string; labels: ItemLabel[] }) {
    this.setState({ isCreatingItem: true })

    try {
      await createItem(data)
      this.setState({ newItemTitle: '' })
      await this.refreshItems()
    } catch (err) {
      console.error('Failed to create item', data, err)
      this.notifyError('Toevoegen mislukt!', err)
    } finally {
      this.setState({ isCreatingItem: false })
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
    const newItemTitle = this.state.newItemTitle
    const isLoading = this.state.isLoading
    const isCreatingItem = this.state.isCreatingItem
    const isSearching = this.state.isSearching
    const lastSearchQuery = this.state.lastSearchQuery
    const searchResults = this.state.searchResults
    const noResultsMessage =
      lastSearchQuery && newItemTitle === lastSearchQuery
        ? 'Geen producten gevonden..'
        : null

    return (
      <Select
        showSearch
        value={newItemTitle}
        disabled={isLoading || isCreatingItem}
        placeholder="Voeg product toe.."
        onSearch={this.handleNewItemSearch}
        onSelect={this.handleNewItemSelected}
        onKeyUp={this.handleNewItemTitleKeyUp}
        showArrow={false}
        defaultActiveFirstOption={false}
        optionFilterProp="title"
        autoClearSearchValue={false}
        notFoundContent={isSearching ? <Spin size="small" /> : noResultsMessage}
        style={{ width: '100%' }}
      >
        {searchResults.map((item) => (
          <Option key={item.id} value={item.id} title={item.title}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: '1 1 auto' }}>{item.title}</div>
              <div style={{ flex: '0 1 auto' }}>
                {getItemLabels(item).map((label: string) => (
                  <Tag color={getLabelColor(label)}>{label}</Tag>
                ))}
              </div>
            </div>
          </Option>
        ))}
      </Select>
    )
  }

  @autobind
  renderItem(item: Item) {
    const updatingItems = this.state.updatingItems
    const labels = this.state.labels

    return (
      <ListItem
        key={item.id}
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
        <Divider orientation="left">
          Boodschappen
          {items.length > 0 ? <small> ({items.length})</small> : ''}
        </Divider>
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={isLoading ? 'Laden..' : 'Geen producten'}
            />
          )}
        >
          <AntList
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
