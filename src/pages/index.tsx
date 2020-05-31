import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'
import listUnfinishedItems from '../api/shoppingLists/listUnfinishedItems'
import listItemsLabels from '../api/shoppingLists/listItemsLabels'

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
