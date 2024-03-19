import { Inter } from 'next/font/google'
import { CookiesProvider } from 'next-client-cookies/server';

import Navbar from '@/components/Navbar';

import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
            <div className="max-w-5xl w-full justify-between font-mono">
              <Navbar />
              {children}
            </div>
          </main>
        </body>
      </html>
    </CookiesProvider>
  )
}
