import TopNavigationBar from './nav/TopNavigationBar'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopNavigationBar />
      <main className="w-full pt-20">{children}</main>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 py-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4">
        <div className="whitespace-nowrap text-sm text-slate-600">
          &copy; 2023 &nbsp;|&nbsp; <Link href="/disclaimer">Disclaimer</Link>&nbsp;|&nbsp;  <Link href="/privacy">Privacy Policy</Link> &nbsp; |&nbsp;  <Link href="/contact">Contact</Link>
        </div>
        <div className="flex items-center">
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