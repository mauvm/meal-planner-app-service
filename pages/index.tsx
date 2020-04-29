import axios from 'axios'

function IndexPage({ items }) {
  return (
    <>
      <h1>Boodschappenlijstje</h1>
      <ul>
        {items.map((item) => (
          <li>{item.title}</li>
        ))}
      </ul>
    </>
  )
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
