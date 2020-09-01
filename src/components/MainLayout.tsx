import Head from 'next/head'

export default function MainLayout({ children, title = 'Boodschappen' }) {
  return (
    <div style={{ margin: '0.5em' }}>
      <Head>
        <meta charSet="UTF-8" />
        <title>{title}</title>
        <meta name="robots" content="noimageindex, nofollow, nosnippet" />
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      {children}
    </div>
  )
}
