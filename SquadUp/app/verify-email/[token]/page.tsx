'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import { setAuthSession } from '@/lib/auth'

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token: params.token }),
    })
      .then((data) => {
        setAuthSession(data.token, data.user)
        setStatus('success')
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error verifying email')
        setStatus('error')
      })
  }, [params.token])

  if (status === 'loading') {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <XCircle className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
          Verification failed
        </h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Link href="/login" className="mt-8 text-sm font-medium text-primary hover:underline">
          Back to login
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
        Email verified successfully
      </h1>
      <p className="mt-3 text-muted-foreground">
        Your account is now active. You can start using SquadUp.
      </p>
      <Button className="mt-8" onClick={() => router.push('/')}>
        Go to SquadUp
      </Button>
    </main>
  )
}