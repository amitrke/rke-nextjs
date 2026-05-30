import TopNavigationBar from './nav/TopNavigationBar'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          &copy; 2023 &nbsp;|&nbsp; <Link href="/disclaimer">Disclaimer</Link>&nbsp;|&nbsp;  <Link href="/privacy">Privacy Policy</Link> &nbsp; |&nbsp;  <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.footerAppBadge}>
          <a
            href="https://play.google.com/store/apps/details?id=org.roorkee"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
          >
            <Image
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              width={155}
              height={60}
              unoptimized
            />
          </a>
        </div>
      </div>
    </footer>
  )
}