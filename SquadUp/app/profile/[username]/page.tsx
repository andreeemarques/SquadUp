'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PlatformIcon } from '@/components/platform-icon'
import { apiFetch } from '@/lib/api'
import { RankBadge } from '@/components/rank-badge'

interface PublicProfile {
  id: string
  username: string
  avatar: string | null
  platform: string | null
  bio: string | null
  ubisoftId: string | null
  preferredOperators: string[]
  createdAt: string
  rank: string | null
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch(`/users/${params.username}`)
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error loading profile'))
      .finally(() => setLoading(false))
  }, [params.username])

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {error ?? 'Profile not found.'}
        </p>
      </main>
    )
  }

  const trackerUrl = profile.ubisoftId
    ? `https://r6.tracker.network/r6siege/profile/ubi/${encodeURIComponent(profile.ubisoftId)}/overview`
    : null

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/25 via-primary/10 to-accent/15 sm:h-40" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="-mt-12 size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-card sm:size-28">
              <Image
                src={profile.avatar || '/placeholder-user.jpg'}
                alt={`${profile.username} avatar`}
                width={112}
                height={112}
                className="size-full object-cover"
              />
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {profile.username}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {profile.platform && (
                  <span className="flex items-center gap-1.5">
                    <PlatformIcon platform={profile.platform as any} />
                    {profile.platform}
                  </span>
                )}
                {profile.rank && <RankBadge rank={profile.rank as any} />}
              </div>
              {trackerUrl && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Ubisoft ID:</span>
                  <span className="font-medium">{profile.ubisoftId}</span>
                  <a
                    href={trackerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View stats
                  </a>
                </div>
              )}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {profile.bio || 'This user has not written a bio yet.'}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-wide">
          Preferred Operators
        </h2>
        {profile.preferredOperators.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.preferredOperators.map((op) => (
              <span
                key={op}
                className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm font-medium"
              >
                {op}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">He hasn't chosen preferred operators yet.</p>
        )}
      </section>
    </main>
  )
}