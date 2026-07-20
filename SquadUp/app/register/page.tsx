'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthShell, AuthField } from '@/components/auth-shell'
import { PLATFORMS } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [platform, setPlatform] = useState<string>('PC')

  return (
    <AuthShell
      title="Join the operation"
      subtitle="Create your account and start building your squad in minutes."
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <AuthField
          label="Username"
          type="text"
          placeholder="Your in-game name"
          autoComplete="username"
          required
        />
        <AuthField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          label="Ubisoft ID"
          type="text"
          placeholder="YourUbisoft.ID"
          required
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

        <AuthField
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <Button type="submit" size="lg" className="mt-2 w-full">
          <UserPlus className="size-4" />
          Create Account
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
