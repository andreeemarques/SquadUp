import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Rajdhani, Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import './globals.css'
import { ToastProvider } from '@/lib/toast'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SquadUp — Rainbow Six Siege Team Finder',
  description:
    'Find your squad for Rainbow Six Siege. Match with teammates by platform, region, rank, and playstyle.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12161f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${rajdhani.variable} ${inter.variable}`}>
      <body className="bg-background font-sans antialiased">
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
