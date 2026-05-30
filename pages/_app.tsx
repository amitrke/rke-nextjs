import '../styles/globals.css'
import '../styles/main.scss'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Layout from '../components/layout'
import GoogleOneTapSignIn from '../components/auth/GoogleOneTapSignIn';
import Script from 'next/script';
import { AppProps } from 'next/app';
import { NextComponentType, NextPageContext } from 'next';

type CustomComponentType = NextComponentType<NextPageContext, unknown, object> & {
  noLayout?: boolean;
  noSSR?: boolean;
};

type CustomAppProps = AppProps & {
  Component: CustomComponentType;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  if (Component.noLayout) {
    return (
      <>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KVDNNXYM2C" />
        <GoogleOneTapSignIn />
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
        <GoogleOneTapSignIn />
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
        <GoogleOneTapSignIn />
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

}

export default MyApp
