'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, Users, Mic, MicOff, Globe, MapPin, Check, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RankBadge } from '@/components/rank-badge'
import { PlatformIcon } from '@/components/platform-icon'
import { timeAgo, type SquadPost } from '@/lib/data'
import { useAuth } from '@/lib/auth'
import { apiFetch } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function SquadCard({ post }: { post: SquadPost }) {
  const { user } = useAuth()
  const isOwnPost = !!user && !!post.userId && user.id === post.userId

  const initialStatus =
    post.requestStatus === 'PENDING' || post.requestStatus === 'ACCEPTED' ? 'sent' : 'idle'
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>(initialStatus)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [removingUsername, setRemovingUsername] = useState<string | null>(null)

  async function handleJoin() {
    if (!user) return
    setStatus('loading')
    setError(null)
    try {
      await apiFetch(`/squads/${post.id}/join`, { method: 'POST' })
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar pedido')
      setStatus('error')
    }
  }

  async function handleDelete() {
    if (!confirm('Tens a certeza que queres apagar este squad post?')) return
    setDeleting(true)
    try {
      await apiFetch(`/squads/${post.id}`, { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao apagar')
      setDeleting(false)
    }
  }

  async function handleRemoveMember(username: string) {
    if (!confirm(`Remover ${username} deste squad?`)) return
    setRemovingUsername(username)
    try {
      await apiFetch(`/squads/${post.id}/members/${username}`, { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover membro')
      setRemovingUsername(null)
    }
  }

  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
          <Image
            src={post.avatar || '/placeholder.svg'}
            alt={`${post.username} avatar`}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={isOwnPost ? '/profile' : `/profile/${post.username}`}
              className="truncate font-display text-lg font-semibold leading-tight hover:text-primary hover:underline"
            >
              {post.username}
            </Link>
            {isOwnPost && (
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Your post
              </span>
            )}
            {post.playersNeeded === 0 && (
              <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Full
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <PlatformIcon platform={post.platform} className="size-3.5" />
              {post.platform}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {post.region}
            </span>
          </div>
        </div>
        <RankBadge rank={post.rank} />
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {post.description}
      </p>

      <div className="flex flex-wrap gap-2">
        <Chip>{post.mode}</Chip>
        <Chip>
          <Globe className="size-3" />
          {post.language}
        </Chip>
        <Chip>
          {post.micRequired ? (
            <>
              <Mic className="size-3" /> Mic required
            </>
          ) : (
            <>
              <MicOff className="size-3" /> Mic optional
            </>
          )}
        </Chip>
      </div>
      <div className="flex min-h-6 items-center gap-2">
        {post.acceptedMembers && post.acceptedMembers.length > 0 ? (
          <>
            <div className="flex -space-x-2">
              {post.acceptedMembers.slice(0, 4).map((member) => (
                <div key={member.username} className="relative">
                  <Link
                    href={`/profile/${member.username}`}
                    title={member.username}
                    className="relative block size-6 overflow-hidden rounded-full border-2 border-card bg-secondary"
                  >
                    <Image
                      src={member.avatar || '/placeholder-user.jpg'}
                      alt={member.username}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  {isOwnPost && (
                    <button
                      type="button"
                      aria-label={`Remove ${member.username}`}
                      disabled={removingUsername === member.username}
                      onClick={() => handleRemoveMember(member.username)}
                      className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110"
                    >
                      <X className="size-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {post.acceptedMembers.length === 1
                ? `${post.acceptedMembers[0].username} joined`
                : `${post.acceptedMembers.length} players joined`}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground/60">No one has joined yet</span>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border/60 pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-primary" />
            {post.playersNeeded > 0 ? (
              <>
                <span className="font-semibold text-foreground">{post.playersNeeded}</span> needed
              </>
            ) : (
              <span className="font-semibold text-foreground">Squad complete</span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {timeAgo(post.postedMinutesAgo)}
            {post.editedMinutesAgo != null && (
              <span className="text-muted-foreground/70"> · edited {timeAgo(post.editedMinutesAgo)}</span>
            )}
          </span>
        </div>
        {isOwnPost ? (
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="px-2.5"
              aria-label="Edit post"
              onClick={() => router.push(`/create?edit=${post.id}`)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="px-2.5 text-destructive hover:text-destructive"
              aria-label="Delete post"
              disabled={deleting}
              onClick={handleDelete}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ) : post.playersNeeded === 0 ? (
          <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            Squad complete
          </span>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <Button
              size="sm"
              disabled={status === 'loading' || status === 'sent'}
              onClick={handleJoin}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Sending...
                </>
              ) : status === 'sent' ? (
                <>
                  <Check className="size-3.5" />
                  {post.requestStatus === 'ACCEPTED' ? 'Accepted' : 'Requested'}
                </>
              ) : (
                'Join'
              )}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </article>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  )
}