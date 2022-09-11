import Head from 'next/head'
import styles from '../styles/Home.module.css'


export default function Home() {

  return (
    <>

      <h1 className={styles.title}>
        Welcome to Roorkee.org!
      </h1>

      <p className={styles.description}>
        Get started by posting some pictures{' '}
        <code className={styles.code}>/myaccount</code>
      </p>

      <div className={styles.grid}>
        <a href="/albums" className={styles.card}>
          <h3>Photos &rarr;</h3>
          <p>Town pictures, Lions, Canal, Memories !</p>
        </a>

        <a href="https://nextjs.org/learn" className={styles.card}>
          <h3>About &rarr;</h3>
          <p>About Roorkee, history, how to reach and where to stay!</p>
        </a>

        <a
          href="https://github.com/vercel/next.js/tree/master/examples"
          className={styles.card}
        >
          <h3>Social &rarr;</h3>
          <p>Post pictures, Blog, Business listing.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
        >
          <h3>Contribute &rarr;</h3>
          <p>
            Contribute to website as a developer, content or Sales.
          </p>
        </a>
      </div>
    </>
  )
}
