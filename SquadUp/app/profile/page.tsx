import Image from 'next/image'
import {
  Star,
  MapPin,
  Copy,
  MessageSquare,
  UserPlus,
  Target,
  Trophy,
  Crosshair,
  Clock,
  Percent,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RankBadge } from '@/components/rank-badge'
import { PlatformIcon } from '@/components/platform-icon'
import { PROFILE } from '@/lib/data'

const STAT_CARDS = [
  { label: 'K/D Ratio', value: PROFILE.stats.kd, icon: Target },
  { label: 'Win Rate', value: PROFILE.stats.winRate, icon: TrendingUp },
  { label: 'Matches', value: PROFILE.stats.matches.toLocaleString(), icon: Trophy },
  { label: 'Headshot %', value: PROFILE.stats.headshotPct, icon: Crosshair },
  { label: 'Hours', value: PROFILE.stats.hoursPlayed.toLocaleString(), icon: Clock },
  { label: 'Current MMR', value: PROFILE.stats.currentMMR.toLocaleString(), icon: Percent },
]

export default function ProfilePage() {
  const avgRating =
    PROFILE.reviews.reduce((sum, r) => sum + r.rating, 0) /
    PROFILE.reviews.length

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/25 via-primary/10 to-accent/15 sm:h-40" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-12 size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-card sm:size-28">
                <Image
                  src={PROFILE.avatar || '/placeholder.svg'}
                  alt={`${PROFILE.username} avatar`}
                  width={112}
                  height={112}
                  className="size-full object-cover"
                />
              </div>
              <div className="pb-1">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {PROFILE.username}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <PlatformIcon platform={PROFILE.platform} />
                    {PROFILE.platform}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {PROFILE.region}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">
                      {avgRating.toFixed(1)}
                    </span>
                    ({PROFILE.reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="size-4" />
                Message
              </Button>
              <Button>
                <UserPlus className="size-4" />
                Invite to squad
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <RankBadge rank={PROFILE.rank} className="px-3 py-1 text-sm" />
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1 text-sm font-medium">
              <Target className="size-4 text-primary" />
              {PROFILE.mainRole}
            </span>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Copy className="size-3.5" />
              Ubisoft ID: {PROFILE.ubisoftId}
            </button>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {PROFILE.bio}
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Stats */}
          <Panel title="Statistics">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {STAT_CARDS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-background/40 p-4"
                >
                  <s.icon className="size-5 text-primary" />
                  <p className="mt-3 font-display text-2xl font-bold">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Rank history */}
          <Panel title="Rank History">
            <div className="flex flex-col gap-3">
              {PROFILE.rankHistory.map((h) => (
                <div
                  key={h.season}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {h.season}
                  </span>
                  <RankBadge rank={h.rank} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Preferred operators */}
          <Panel title="Preferred Operators">
            <div className="flex flex-wrap gap-2">
              {PROFILE.operators.map((op) => (
                <span
                  key={op}
                  className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm font-medium"
                >
                  {op}
                </span>
              ))}
            </div>
          </Panel>

          {/* Reviews */}
          <Panel title="Teammate Reviews">
            <div className="flex flex-col gap-4">
              {PROFILE.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-border bg-background/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.avatar || '/placeholder.svg'}
                      alt={`${review.author} avatar`}
                      width={36}
                      height={36}
                      className="size-9 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {review.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.daysAgo}d ago
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? 'size-3.5 fill-accent text-accent'
                              : 'size-3.5 text-muted-foreground/40'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  )
}
