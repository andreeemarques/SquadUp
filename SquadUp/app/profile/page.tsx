'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Pencil, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlatformIcon } from '@/components/platform-icon'
import { PLATFORMS, PROFILE, type Platform, type SquadPost as SquadPostType } from '@/lib/data'
import { apiFetch } from '@/lib/api'
import { useAuth, updateAuthUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ATTACKERS, DEFENDERS } from '@/lib/operators'
import { SquadCard } from '@/components/squad-card'
import { mapApiPost, type ApiSquadPost } from '@/lib/squads'

const AVATAR_OPTIONS = [
  '/avatars/operator-1.png',
  '/avatars/operator-2.png',
  '/avatars/operator-3.png',
  '/avatars/operator-4.png',
]

interface FullProfile {
  id: string
  username: string
  email: string
  avatar: string | null
  ubisoftId: string | null
  platform: Platform | null
  bio: string | null
  createdAt: string
  preferredOperators: string[]
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myPosts, setMyPosts] = useState<SquadPostType[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsPage, setPostsPage] = useState(1)
  const POSTS_PAGE_SIZE = 4

  // campos editáveis
  const [username, setUsername] = useState('')
  const [ubisoftId, setUbisoftId] = useState('')
  const [platform, setPlatform] = useState<Platform>('PC')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [preferredOperators, setPreferredOperators] = useState<string[]>([])
  const [operatorSearch, setOperatorSearch] = useState('')

  useEffect(() => {
    apiFetch('/users/me')
      .then((data: FullProfile) => {
        setProfile(data)
        setUsername(data.username)
        setUbisoftId(data.ubisoftId ?? '')
        setPlatform(data.platform ?? 'PC')
        setBio(data.bio ?? '')
        setAvatar(data.avatar ?? '')
        setPreferredOperators(data.preferredOperators ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    apiFetch('/squads/mine')
      .then((data: ApiSquadPost[]) => setMyPosts(data.map(mapApiPost)))
      .catch(() => {})
      .finally(() => setLoadingPosts(false))
  }, [])

  const postsTotalPages = Math.max(1, Math.ceil(myPosts.length / POSTS_PAGE_SIZE))
  const paginatedPosts = myPosts.slice(
    (postsPage - 1) * POSTS_PAGE_SIZE,
    postsPage * POSTS_PAGE_SIZE,
  )

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const updated: FullProfile = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ username, ubisoftId, platform, bio, avatar, preferredOperators }),
      })
      setProfile(updated)
      updateAuthUser({
        id: updated.id,
        username: updated.username,
        email: updated.email,
        ubisoftId: updated.ubisoftId,
        platform: updated.platform,
        avatar: updated.avatar,
      })
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (!profile) return
    setUsername(profile.username)
    setUbisoftId(profile.ubisoftId ?? '')
    setPlatform(profile.platform ?? 'PC')
    setBio(profile.bio ?? '')
    setEditing(false)
    setError(null)
    setAvatar(profile.avatar ?? '')
    setPreferredOperators(profile.preferredOperators ?? [])
  }

  function toggleOperator(name: string) {
  setPreferredOperators((prev) =>
    prev.includes(name)
      ? prev.filter((o) => o !== name)
      : prev.length < 8
        ? [...prev, name]
        : prev, // limite de 8, alinhado com o backend
  )
}

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o perfil. Tenta fazer login novamente.
        </p>
      </main>
    )
  }

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
                  src={profile.avatar || '/placeholder-user.jpg'}
                  alt={`${profile.username} avatar`}
                  width={112}
                  height={112}
                  className="size-full object-cover"
                />
              </div>
              <div className="pb-1">
                {editing ? (
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="h-9 rounded-lg border border-border bg-background px-3 font-display text-xl font-bold outline-none focus:border-primary"
                  />
                ) : (
                  <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {profile.username}
                  </h1>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {profile.platform && <PlatformIcon platform={profile.platform} />}
                    {profile.platform ?? 'Sem plataforma definida'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    <X className="size-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="size-4" />
                    {saving ? 'A guardar...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Pencil className="size-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {editing && (
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground">Choose your avatar</label>
              <div className="mt-2 flex gap-3">
                {AVATAR_OPTIONS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAvatar(src)}
                    className={cn(
                      'size-16 overflow-hidden rounded-xl border-2 transition-colors',
                      avatar === src
                        ? 'border-primary'
                        : 'border-transparent hover:border-border',
                    )}
                  >
                    <Image
                      src={src}
                      alt="Avatar option"
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {editing && (
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground">
                Preferred operators ({preferredOperators.length}/8)
              </label>
              <input
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                placeholder="Search operators..."
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-border p-2">
                {[...ATTACKERS, ...DEFENDERS]
                  .filter((op) => op.toLowerCase().includes(operatorSearch.toLowerCase()))
                  .map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => toggleOperator(op)}
                      className={cn(
                        'm-0.5 inline-block rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                        preferredOperators.includes(op)
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {op}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {editing ? (
            <div className="mt-6 flex flex-col gap-4 sm:max-w-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Ubisoft ID</label>
                <input
                  value={ubisoftId}
                  onChange={(e) => setUbisoftId(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Main platform</label>
                <div className="flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        platform === p
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {profile.ubisoftId && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
                    Ubisoft ID: {profile.ubisoftId}
                  </span>
                )}
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {profile.bio || 'Ainda não escreveste nada sobre ti.'}
              </p>
            </>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="My Squad Posts">
            {loadingPosts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : myPosts.length > 0 ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {paginatedPosts.map((post) => (
                    <SquadCard key={post.id} post={post} />
                  ))}
                </div>

                {postsTotalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={postsPage === 1}
                      onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: postsTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPostsPage(p)}
                          className={cn(
                            'flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                            p === postsPage
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-secondary',
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={postsPage === postsTotalPages}
                      onClick={() => setPostsPage((p) => Math.min(postsTotalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ainda não criaste nenhum squad post.
              </p>
            )}
          </Panel>
        </div>
        <div className="flex flex-col gap-6">
          <Panel title="Preferred Operators">
            {profile.preferredOperators && profile.preferredOperators.length > 0 ? (
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
              <p className="text-sm text-muted-foreground">Ainda não escolheste operadores preferidos.</p>
            )}
          </Panel>
        </div>
      </div>
    </main>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-display text-lg font-semibold tracking-wide">{title}</h2>
      {children}
    </section>
  )
}