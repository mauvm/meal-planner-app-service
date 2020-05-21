import { listUnfinishedItems } from './api/list-unfinished-items'
import { listItemsLabels } from './api/list-items-labels'
import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'

function IndexPage({ items, itemsLabels }) {
  return (
    <MainLayout>
      <ShoppingList initialItems={items} initialItemsLabels={itemsLabels} />
    </MainLayout>
  )
}

export async function getServerSideProps() {
  const items = await listUnfinishedItems()
  const itemsLabels = await listItemsLabels()

  return { props: { items, itemsLabels } }
}

export default IndexPage
