'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthShell, AuthField } from '@/components/auth-shell'
import { apiFetch } from '@/lib/api'
import { checkPassword } from '@/lib/password'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordCheck = checkPassword(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!passwordCheck.valid) {
      setError('A password precisa de pelo menos 8 caracteres, uma letra e um número.')
      return
    }
    if (password !== confirmPassword) {
      setError('As passwords não coincidem.')
      return
    }

    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: params.token, password }),
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao repor password')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Password updated
        </h1>
        <p className="mt-3 text-muted-foreground">
          A tua password foi alterada com sucesso. Já podes fazer login com a nova password.
        </p>
        <Button className="mt-8" onClick={() => router.push('/login')}>
          Go to login
        </Button>
      </main>
    )
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong new password for your account.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
            <AuthField
                label="New password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />

            {password.length > 0 && (
                <>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                        'h-1 flex-1 rounded-full transition-colors',
                        passwordCheck.strength === 'weak' && i === 0
                            ? 'bg-destructive'
                            : passwordCheck.strength === 'medium' && i <= 1
                            ? 'bg-yellow-500'
                            : passwordCheck.strength === 'strong'
                                ? 'bg-primary'
                                : 'bg-border',
                        )}
                    />
                    ))}
                </div>

                <ul className="flex flex-col gap-0.5 text-xs">
                    <li className={passwordCheck.minLength ? 'text-primary' : 'text-muted-foreground'}>
                    {passwordCheck.minLength ? '✓' : '·'} Pelo menos 8 caracteres
                    </li>
                    <li className={passwordCheck.hasLetter ? 'text-primary' : 'text-muted-foreground'}>
                    {passwordCheck.hasLetter ? '✓' : '·'} Pelo menos uma letra
                    </li>
                    <li className={passwordCheck.hasNumber ? 'text-primary' : 'text-muted-foreground'}>
                    {passwordCheck.hasNumber ? '✓' : '·'} Pelo menos um número
                    </li>
                </ul>
            </>
            )}
        </div>

        <AuthField
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          <KeyRound className="size-4" />
          {loading ? 'A guardar...' : 'Reset password'}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Back to login
      </Link>
    </AuthShell>
  )
}