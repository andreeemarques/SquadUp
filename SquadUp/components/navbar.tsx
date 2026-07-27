'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Crosshair, Menu, X, UserPlus, Users, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/search', label: 'Find Squad' },
  { href: '/create', label: 'Create Post' },
]

const NOTIFICATIONS = [
  { id: 1, title: 'ValkyrieMain invited you to a squad', time: '2m ago', unread: true },
  { id: 2, title: 'New reply on your ranked post', time: '18m ago', unread: true },
  { id: 3, title: 'BreachKing left you a 5-star review', time: '1h ago', unread: false },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Crosshair className="size-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-wide">
              SQUAD<span className="text-primary">UP</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!loading && user && (
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="font-display text-sm font-semibold tracking-wide">
                    NOTIFICATIONS
                  </span>
                  <span className="text-xs text-muted-foreground">{unreadCount} new</span>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <li
                      key={n.id}
                      className="flex items-start gap-3 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-secondary/40"
                    >
                      <span
                        className={cn(
                          'mt-1.5 size-2 shrink-0 rounded-full',
                          n.unread ? 'bg-accent' : 'bg-muted-foreground/40',
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm leading-snug text-foreground">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

          {/* Desktop: utilizador logado OU botões de login/signup */}
          <div className="hidden items-center gap-2 sm:flex">
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/60"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.username} width={28} height={28} className="size-full object-cover" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                  {user.username}
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="size-4" />
                  Log Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
                  Log In
                </Button>
                <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
                  <UserPlus className="size-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Users className="size-4" />
                {link.label}
              </Link>
            ))}

            {/* Mobile: utilizador logado OU botões de login/signup */}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              {loading ? null : user ? (
                <div className="flex flex-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    nativeButton={false}
                    render={<Link href="/profile" onClick={() => setMobileOpen(false)} />}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.username} width={20} height={20} className="size-full object-cover" />
                      ) : (
                        <User className="size-3.5" />
                      )}
                    </span>
                    {user.username}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="size-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" nativeButton={false} render={<Link href="/login" />}>
                    Log In
                  </Button>
                  <Button size="sm" className="flex-1" nativeButton={false} render={<Link href="/register" />}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}