import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from '../components/layout'
import { SSRProvider } from '@react-aria/ssr';

function MyApp({ Component, pageProps }) {
  if (Component.noLayout) {
    return (
      <>
          <Component {...pageProps} />
      </>
    )
  } else {
    return (
      <SSRProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SSRProvider>
    )
  }
  
}

export default MyApp
