import { Component } from 'react'
import { Button, Modal, Typography, Image, Divider } from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import autobind from 'autobind-decorator'

const { Title, Paragraph } = Typography

type Props = {}
type State = {
  isShowingModal: boolean
}

export default class GettingStartedButton extends Component<Props, State> {
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

  render() {
    return (
      <>
        <Button
          type="default"
          icon={<QuestionCircleOutlined />}
          onClick={this.showModal}
        >
          Hoe werkt het?
        </Button>

        <Modal
          title="Hoe werkt het?"
          visible={this.state.isShowingModal}
          onCancel={this.hideModal}
          footer={[
            <Button key="submit" type="primary" onClick={this.hideModal}>
              Sluiten
            </Button>,
          ]}
        >
          <Title level={3}>Lijst toevoegen</Title>
          <Paragraph>
            Klik op "Nieuwe lijst", vul een titel in voor de lijst en klik tot
            slot op "Aanmaken".
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image
              src="/tutorial/create-list.gif"
              alt="Create list tutorial GIF"
            />
          </Paragraph>

          <Divider />

          <Title level={3}>Nieuw item toevoegen</Title>
          <Paragraph>
            Klik op het invoerveld waar "Voeg item toe.." staat. Vul de naam van
            het item in, bijvoorbeeld "Eieren" en druk op "Enter" of "Return".
            Het item verschijnt nu in de lijst.
          </Paragraph>
          <Paragraph>
            <b>iOS:</b> Als je op "Gereed" klikt sluit alleen het toetsenbord.
            Je moet rechtsonderin op "Enter" drukken.
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image
              src="/tutorial/create-item.gif"
              alt="Create item tutorial GIF"
            />
          </Paragraph>

          <Divider />

          <Title level={3}>Bestaand item toevoegen (zoeken)</Title>
          <Paragraph>
            Vul (een deel van) de titel in, bijvoorbeeld "Ei" en klik op een
            bestaand item uit de lijst met gevonden items.
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image
              src="/tutorial/recreate-item.gif"
              alt="Recreate item tutorial GIF"
            />
          </Paragraph>

          <Divider />

          <Title level={3}>Labels</Title>
          <Paragraph>Je kunt labels naar keuze toevoegen.</Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image src="/tutorial/labels.gif" alt="Label tutorial GIF" />
          </Paragraph>
          <Paragraph>
            De lijst wordt standaard op de volgende manier gesorteerd:
            <ul>
              <li>&lt;Geen labels&gt;</li>
              <li>Groente &amp; Fruit</li>
              <li>Vega &amp; Vlees</li>
              <li>Deli</li>
              <li>Brood</li>
              <li>Zuivel</li>
              <li>Houdbaar</li>
              <li>Drinken</li>
              <li>Diepvries</li>
              <li>Non-Food</li>
              <li>&lt;Overige labels&gt;</li>
            </ul>
          </Paragraph>

          <Divider />

          <Title level={3}>Lijst delen</Title>
          <Paragraph>
            <b>Uitnodigen:</b> Klik op het <InfoCircleOutlined /> icoon naast de
            titel van de lijst. Kopieer de uitnodigingscode en deel deze met
            degene die je wilt toevoegen aan de lijst.
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image src="/tutorial/invite.gif" alt="Invite tutorial GIF" />
          </Paragraph>
          <Paragraph>
            <b>Uitnodiging accepteren:</b> Klik bovenaan op "Uitnodiging
            accepteren", vul de uitnodigingscode in en klik op "Accepteer".
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
            <Image
              src="/tutorial/accept-invite.gif"
              alt="Accept invite tutorial GIF"
            />
          </Paragraph>
        </Modal>
      </>
    )
  }
}
