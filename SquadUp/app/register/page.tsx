'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthShell, AuthField } from '@/components/auth-shell'
import { PLATFORMS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/api'
import { checkPassword } from '@/lib/password'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const router = useRouter()

  const [platform, setPlatform] = useState<string>('PC')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [ubisoftId, setUbisoftId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const usernameError =
    username.length > 0 && username.length < 3
      ? 'Mínimo de 3 caracteres'
      : username.length > 20
        ? 'Máximo de 20 caracteres'
        : null

  const emailError =
    email.length > 0 && !EMAIL_REGEX.test(email)
      ? 'Email inválido'
      : null

  const passwordCheck = checkPassword(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (username.length < 3 || username.length > 20) {
      setError('O username precisa de ter entre 3 e 20 caracteres.')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Introduz um email válido.')
      return
    }
    if (!passwordCheck.valid) {
      setError('A password precisa de pelo menos 8 caracteres, uma letra e um número.')
      return
    }

    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, ubisoftId, platform }),
      })

      setRegistered(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="Falta só um passo para ativares a tua conta."
      >
        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            Enviámos um link de confirmação para <strong>{email}</strong>. Clica
            nele para ativares a tua conta. Verifica também a pasta de spam.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-6 block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to login
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Join the operation"
      subtitle="Create your account and start building your squad in minutes."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <AuthField
            label="Username"
            type="text"
            placeholder="Your in-game name"
            autoComplete="username"
            maxLength={20}
            required
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          {usernameError && <p className="text-xs text-destructive">{usernameError}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <AuthField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-xs text-destructive">{emailError}</p>}
        </div>

        <AuthField
          label="Ubisoft ID"
          type="text"
          placeholder="YourUbisoft.ID"
          required
          value={ubisoftId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUbisoftId(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Main platform</label>
          <div className="flex gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                  platform === p
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <AuthField
            label="Password"
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          <UserPlus className="size-4" />
          {loading ? 'A criar conta...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}