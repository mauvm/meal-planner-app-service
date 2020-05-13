import App, { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { ConfigProvider } from 'antd'
import localeValues from 'antd/lib/locale/nl_NL'

// @todo Set this text in the ShoppingList component.
//       Unfortunately setting `locale={{ emptyText:'Geen producten' }}`
//       on the List component will remove the icon.
localeValues.Empty.description = 'Geen producten'

export default function CustomApp(props: AppProps) {
  return (
    <ConfigProvider locale={localeValues}>
      <App {...props} />
    </ConfigProvider>
  )
}
