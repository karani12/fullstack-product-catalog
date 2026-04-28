'use client'

import AuthGuard from '@/app/components/AuthGuard'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { removeToken } from '@/app/lib/api/auth'
import { useQueryClient } from '@tanstack/react-query'
import ThemeToggle from '@/app/components/ThemeToggle'
import { Button } from '@/app/components/ui/button/Button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  function handleLogout() {
    removeToken()
    queryClient.removeQueries({ queryKey: ['me'] })
    router.push('/login')
  }

  return (
    <AuthGuard>
      <div className="flex h-screen">
        {open && (
          <div
            className="fixed inset-0 bg-black/20 z-10 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-52 bg-card  border-r flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
          <div className="p-4 font-bold text-lg border-b flex items-center">
            Admin
            <ThemeToggle />
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {[
              { label: 'Products', href: '/admin' },
              { label: 'Reviews', href: '/admin/reviews' },
            ].map(({ label, href }) => {
              const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded text-sm ${
                    isActive ? 'font-medium bg-primary text-secondary' : ''
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
          <div className="p-3 border-t"></div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="lg:hidden flex items-center px-4 py-3 border-b">
            <button onClick={() => setOpen(true)} className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
