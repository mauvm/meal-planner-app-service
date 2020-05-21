import App, { AppProps } from 'next/app'
import 'antd/dist/antd.css'

export default function CustomApp(props: AppProps) {
  return <App {...props} />
}
