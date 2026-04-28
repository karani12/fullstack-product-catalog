import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/app/providers/ReactQueryProvider'
import { Toaster } from 'sonner'
import ThemeToggle from '@/app/components/ThemeToggle'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Full Stack Product Catalog',
  description: 'A Full Stack product catalog as a technical test',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const stored = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (stored === 'dark' || (!stored && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })()
          `,
          }}
        />
      </head>
      <body className="min-h-screen w-full mx-auto">
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
