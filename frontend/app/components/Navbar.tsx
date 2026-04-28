'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/app/components/ui/button/Button'
import ThemeToggle from '@/app/components/ThemeToggle'

const links = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="border-b  py-3 flex items-center justify-between relative">
      <Link href={'/'}>
        <div className="font-semibold">Duka</div>
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'font-medium' : ''}
          >
            {link.label}
          </Link>
        ))}

        <ThemeToggle />
      </nav>

      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
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
      </Button>

      {open && (
        <div className="absolute top-full left-0 w-full border-b bg-card md:hidden">
          <nav className="flex flex-col p-4 gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={pathname === link.href ? 'font-medium' : ''}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />
          </nav>
        </div>
      )}
    </header>
  )
}
