import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'

export default function IndexPage({ items, itemsLabels }) {
  return (
    <MainLayout>
      <ShoppingList />
    </MainLayout>
  )
}
