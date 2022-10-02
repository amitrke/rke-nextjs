import TopNavigationBar from './nav/TopNavigationBar'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

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
      Version 1.0.0 | &copy; 2022 &nbsp; | &nbsp; <Link href="/disclaimer">Disclaimer</Link>&nbsp;|&nbsp;  <Link href="/privacy">Privacy Policy</Link> &nbsp; |&nbsp;  <Link href="/contact">Contact</Link>
    </footer>
  )
}