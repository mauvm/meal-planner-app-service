import { fetchUnfinishedItems } from './api/fetch-unfinished-items'
import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'

function IndexPage({ items }) {
  return (
    <MainLayout>
      <ShoppingList initialItems={items} />
    </MainLayout>
  )
}

export async function getServerSideProps() {
  const items = await fetchUnfinishedItems()
  return { props: { items } }
}

export default IndexPage
