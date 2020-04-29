import ShoppingList from '../components/ShoppingList'
import { fetchUnfinishedItems } from './api/fetch-unfinished-items'

// @todo Add head
// @todo Add meta robots noindex
// @todo Add no caching

function IndexPage({ items }) {
  return (
    <>
      <h1>Boodschappenlijstje</h1>
      <ShoppingList initialItems={items} />
    </>
  )
}

export async function getServerSideProps() {
  const items = await fetchUnfinishedItems()
  return { props: { items } }
}

export default IndexPage
