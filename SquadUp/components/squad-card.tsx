'use client'

import Image from 'next/image'
import { Clock, Users, Mic, MicOff, Globe, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RankBadge } from '@/components/rank-badge'
import { PlatformIcon } from '@/components/platform-icon'
import { timeAgo, type SquadPost } from '@/lib/data'
import { useAuth } from '@/lib/auth'

export function SquadCard({ post }: { post: SquadPost }) {
  const { user } = useAuth()
  const isOwnPost = !!user && !!post.userId && user.id === post.userId

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
            <h3 className="truncate font-display text-lg font-semibold leading-tight">
              {post.username}
            </h3>
            {isOwnPost && (
              <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Your post
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

      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              {post.playersNeeded}
            </span>{' '}
            needed
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {timeAgo(post.postedMinutesAgo)}
          </span>
        </div>
        {!isOwnPost && <Button size="sm">Join</Button>}
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