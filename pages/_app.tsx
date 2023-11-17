import '../styles/globals.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from '../components/layout'
import { SSRProvider } from '@react-aria/ssr';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  if (Component.noLayout) {
    return (
      <>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KVDNNXYM2C" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-KVDNNXYM2C');
        `}
        </Script>
        <Component {...pageProps} />
      </>
    )
  } else if (Component.noSSR) {
    return (
      <>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KVDNNXYM2C" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-KVDNNXYM2C');
        `}
        </Script>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    )
  }
  else {
    return (
      <>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KVDNNXYM2C" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-KVDNNXYM2C');
        `}
        </Script>
        <SSRProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SSRProvider>
      </>

    )
  }

}

export default MyApp
