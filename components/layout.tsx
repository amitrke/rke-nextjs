import TopNavigationBar from './nav/TopNavigationBar'
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
      Version 0.0.2
    </footer>
  )
}