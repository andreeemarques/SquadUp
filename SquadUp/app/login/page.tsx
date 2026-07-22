'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthShell, AuthField } from '@/components/auth-shell'
import { apiFetch } from '@/lib/api'
import { setAuthSession } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      setAuthSession(data.token, data.user)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar sessão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back, operator"
      subtitle="Log in to find your squad and jump back into the action."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="size-4 rounded border-border accent-primary" />
          Keep me signed in
        </label>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          <LogIn className="size-4" />
          {loading ? 'A entrar...' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  )
}