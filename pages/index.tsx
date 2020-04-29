import axios from 'axios'
import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'

// @todo Add head
// @todo Add meta robots noindex

type Item = {
  uuid: string
  title: string
  createdAt: string
  finishedAt?: string
}

type Props = {
  items: Item[]
}

type State = {
  items: Item[]
  newItemTitle: string
  creatingItem: boolean
  finishingItems: string[]
}

class IndexPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: props.items,
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
        await this.refreshItems()
      } finally {
        this.setState({ creatingItem: false })
      }
    }
  }

  @autobind
  async handleFinish(event: React.ChangeEvent<HTMLInputElement>) {
    const uuid = event.target.value
    this.setState({ finishingItems: this.state.finishingItems.concat([uuid]) })

    try {
      await axios.post('/api/finish-item', {
        body: { uuid },
      })
      await this.refreshItems()
    } finally {
      this.setState({
        finishingItems: this.state.finishingItems.filter(
          (uuidToFinish) => uuidToFinish !== uuid,
        ),
      })
    }
  }

  async refreshItems() {
    const response = await axios.get('/api/fetch-unfinished-items')
    const items = response.data.data
    this.setState({ items })
  }

  render() {
    const items = this.state.items

    return (
      <>
        <h1>Boodschappenlijstje</h1>
        <input
          type="text"
          value={this.state.newItemTitle}
          disabled={this.state.creatingItem}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          autoComplete="on"
        />
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.uuid}>
                <label>
                  <input
                    type="checkbox"
                    value={item.uuid}
                    onChange={this.handleFinish}
                    checked={this.state.finishingItems.includes(item.uuid)}
                    disabled={this.state.finishingItems.includes(item.uuid)}
                  />
                  {item.title}
                </label>
              </li>
            ))
          ) : (
            <li>Het lijstje is leeg</li>
          )}
        </ul>
      </>
    )
  }
}

export async function getServerSideProps() {
  const response = await axios.get(
    'http://localhost:3000/v1/shopping-lists/unfinished-items',
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )
  const items = response?.data?.data || []

  return { props: { items } }
}

export default IndexPage
