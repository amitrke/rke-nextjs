import TopNavigationBar from '../components/nav/TopNavigationBar'
import styles from '../styles/Home.module.css'

export default function Layout({ children }) {
  return (
    <>
      <div className={styles.container}>
        <TopNavigationBar/>
        <main className={styles.main}>{children}</main>
        <Footer/>
      </div>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
  )
}