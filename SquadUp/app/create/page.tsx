'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mic, Minus, Plus, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  PLATFORMS,
  REGIONS,
  RANKS,
  GAME_MODES,
  LANGUAGES,
} from '@/lib/data'
import { apiFetch, toApiEnum } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()

  const [platform, setPlatform] = useState<string>('PC')
  const [region, setRegion] = useState<string>('North America')
  const [rank, setRank] = useState<string>('Gold')
  const [mode, setMode] = useState<string>('Ranked')
  const [language, setLanguage] = useState<string>('English')
  const [micRequired, setMicRequired] = useState(true)
  const [playersNeeded, setPlayersNeeded] = useState(2)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (description.trim().length === 0) {
      setError('Escreve uma descrição para o teu squad post.')
      return
    }

    setSubmitting(true)
    try {
      await apiFetch('/squads', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          region: toApiEnum(region),
          rank,
          mode: toApiEnum(mode),
          language,
          micRequired,
          playersNeeded,
          description: description.trim(),
        }),
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar o post')
    } finally {
      setSubmitting(false)
    }
  }

  // Ainda a carregar info de sessão -> evita "flash" de conteúdo errado
  if (authLoading) return null

  // Sem sessão -> não faz sentido publicar sem conta
  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Precisas de ter sessão iniciada
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cria uma conta ou faz login para publicar um squad post.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
            Log In
          </Button>
          <Button nativeButton={false} render={<Link href="/register" />}>
            Sign Up
          </Button>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Squad post published
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your request is now live. Players matching your criteria can request to
          join, and you&apos;ll get a notification when they do.
        </p>
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/create" onClick={() => setSubmitted(false)} />
            }
          >
            Create another
          </Button>
          <Button nativeButton={false} render={<Link href="/search" />}>
            Browse squads
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Create a Squad Post
        </h1>
        <p className="text-muted-foreground">
          Tell players what you&apos;re looking for. The more specific you are,
          the better your matches.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <Field label="Platform">
          <OptionRow options={PLATFORMS} value={platform} onChange={setPlatform} />
        </Field>

        <Field label="Region">
          <OptionRow options={REGIONS} value={region} onChange={setRegion} />
        </Field>

        <Field label="Rank">
          <OptionRow options={RANKS} value={rank} onChange={setRank} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Game Mode">
            <SelectBox options={GAME_MODES} value={mode} onChange={setMode} />
          </Field>
          <Field label="Language">
            <SelectBox options={LANGUAGES} value={language} onChange={setLanguage} />
          </Field>
        </div>

        <Field label="Players needed">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease"
              onClick={() => setPlayersNeeded((n) => Math.max(1, n - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-12 text-center font-display text-2xl font-bold">
              {playersNeeded}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase"
              onClick={() => setPlayersNeeded((n) => Math.min(4, n + 1))}
            >
              <Plus className="size-4" />
            </Button>
            <span className="ml-1 text-sm text-muted-foreground">
              open {playersNeeded === 1 ? 'slot' : 'slots'}
            </span>
          </div>
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            maxLength={280}
            placeholder="Describe your playstyle, goals, and what you're looking for in teammates..."
            className="w-full resize-none rounded-lg border border-border bg-background/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <span className="mt-1 block text-right text-xs text-muted-foreground">
            {description.length}/280
          </span>
        </Field>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Mic className="size-4 text-primary" />
            Microphone required
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={micRequired}
            onClick={() => setMicRequired((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
              micRequired ? 'bg-primary' : 'bg-input',
            )}
          >
            <span
              className="inline-block size-5 rounded-full bg-background transition-transform"
              style={{ transform: micRequired ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </button>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/search" />}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" className="sm:px-8" disabled={submitting}>
            <Send className="size-4" />
            {submitting ? 'A publicar...' : 'Publish squad post'}
          </Button>
        </div>
      </form>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  )
}

function OptionRow({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
            value === opt
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SelectBox({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-card">
          {opt}
        </option>
      ))}
    </select>
  )
}