'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Crosshair, Menu, X, UserPlus, Users, LogOut, User, Check, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { apiFetch } from '@/lib/api'

const NAV_LINKS = [
  { href: '/search', label: 'Find Squad' },
  { href: '/create', label: 'Create Post' },
]

interface Notification {
  id: string
  type: 'JOIN_REQUEST' | 'JOIN_ACCEPTED' | 'JOIN_DECLINED'
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  read: boolean
  createdAt: string
  actor: { username: string; avatar: string | null; ubisoftId: string | null }
  squadPost: { id: string } | null
}

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [respondingId, setRespondingId] = useState<string | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const loadNotifications = useCallback(() => {
    if (!user) return
    apiFetch('/notifications')
      .then((data: { notifications: Notification[]; unreadCount: number }) => {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleToggleNotif() {
    const next = !notifOpen
    setNotifOpen(next)
    if (next && unreadCount > 0) {
      try {
        await apiFetch('/notifications/read-all', { method: 'PATCH' })
        setUnreadCount(0)
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } catch {}
    }
  }

  async function handleRespond(id: string, action: 'accept' | 'decline') {
    setRespondingId(id)
    try {
      await apiFetch(`/notifications/${id}/respond`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' } : n,
        ),
      )
    } catch {
      // silencioso: o pedido pode já ter sido respondido entretanto
    } finally {
      setRespondingId(null)
    }
  }

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
                onClick={handleToggleNotif}
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
                  </div>
                  <ul className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 && (
                      <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Sem notificações por agora.
                      </li>
                    )}
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="flex flex-col gap-2 border-b border-border/60 px-4 py-3 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <span className="relative mt-0.5 size-8 shrink-0 overflow-hidden rounded-full bg-secondary">
                            {n.actor.avatar && (
                              <Image
                                src={n.actor.avatar}
                                alt={n.actor.username}
                                fill
                                className="object-cover"
                              />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug text-foreground">
                              {n.type === 'JOIN_REQUEST' && (
                                <>
                                  <Link href={`/profile/${n.actor.username}`} className="font-semibold hover:text-primary hover:underline" onClick={() => setNotifOpen(false)}>
                                    {n.actor.username}
                                  </Link>{' '} 
                                  quer juntar-se ao teu squad
                                </>
                              )}
                              {n.type === 'JOIN_ACCEPTED' && (
                                <>
                                  <Link href={`/profile/${n.actor.username}`} className="font-semibold hover:text-primary hover:underline" onClick={() => setNotifOpen(false)}>
                                    {n.actor.username}
                                  </Link>{' '} 
                                  aceitou o teu pedido para entrar no squad
                                </>
                              )}
                              {n.type === 'JOIN_DECLINED' && (
                                <>
                                  <Link href={`/profile/${n.actor.username}`} className="font-semibold hover:text-primary hover:underline" onClick={() => setNotifOpen(false)}>
                                    {n.actor.username}
                                  </Link>{' '} 
                                  recusou o teu pedido para entrar no squad
                                </>
                              )}
                            </p>
                            {n.actor.ubisoftId && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Ubisoft ID: <span className="font-medium text-foreground">{n.actor.ubisoftId}</span>
                              </p>
                            )}
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {new Date(n.createdAt).toLocaleString('pt-PT', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        {n.type === 'JOIN_REQUEST' && n.status === 'PENDING' && (
                          <div className="flex gap-2 pl-11">
                            <Button
                              size="sm"
                              className="flex-1"
                              disabled={respondingId === n.id}
                              onClick={() => handleRespond(n.id, 'accept')}
                            >
                              <Check className="size-3.5" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              disabled={respondingId === n.id}
                              onClick={() => handleRespond(n.id, 'decline')}
                            >
                              <XCircle className="size-3.5" />
                              Decline
                            </Button>
                          </div>
                        )}

                        {n.type === 'JOIN_REQUEST' && n.status !== 'PENDING' && (
                          <span
                            className={cn(
                              'ml-11 w-fit rounded-md px-2 py-0.5 text-xs font-medium',
                              n.status === 'ACCEPTED'
                                ? 'bg-primary/15 text-primary'
                                : 'bg-secondary text-muted-foreground',
                            )}
                          >
                            {n.status === 'ACCEPTED' ? 'Accepted' : 'Declined'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

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