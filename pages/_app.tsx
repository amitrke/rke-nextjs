import '../styles/globals.css'
import '../styles/main.scss'
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
  } else if (Component.noSSR) {
    return (
      <>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    )
  } 
  else {
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
