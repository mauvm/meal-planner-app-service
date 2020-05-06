import Head from 'next/head'
import ShoppingList from '../components/ShoppingList'
import { fetchUnfinishedItems } from './api/fetch-unfinished-items'

function IndexPage({ items }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Boodschappenlijstje</title>
        <meta name="robots" content="noimageindex, nofollow, nosnippet" />
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
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
