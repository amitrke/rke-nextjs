import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SSRProvider } from '@react-aria/ssr'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>
  )
}

export default MyApp
