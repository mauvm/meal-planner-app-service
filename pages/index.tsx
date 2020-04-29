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
  newItemTitle: string
  creatingItem: boolean
  createdItems: Item[]
}

class IndexPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      newItemTitle: '',
      creatingItem: false,
      createdItems: [],
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
        const response = await axios.post('/api/create-item', {
          body: { title: this.state.newItemTitle },
        })
        this.setState({
          createdItems: [response.data].concat(this.state.createdItems),
        })
      } finally {
        this.setState({ creatingItem: false })
      }
    }
  }

  render() {
    const items = this.props.items

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
          {this.state.createdItems.map((item) => (
            <li key={item.uuid}>{item.title}</li>
          ))}
          {items.map((item) => (
            <li key={item.uuid}>{item.title}</li>
          ))}
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
