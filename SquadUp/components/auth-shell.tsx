import Image from 'next/image'
import Link from 'next/link'
import { Crosshair, ShieldCheck, Users, Trophy } from 'lucide-react'

const POINTS = [
  { icon: Users, text: 'Match with teammates by rank, region and platform' },
  { icon: ShieldCheck, text: 'Verified ranks and teammate reviews you can trust' },
  { icon: Trophy, text: 'Build a consistent stack and climb every season' },
]

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      {/* Form side */}
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Crosshair className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide">
            SQUAD<span className="text-primary">UP</span>
          </span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden rounded-2xl border border-border lg:block">
        <Image
          src="/hero-operators.png"
          alt=""
          width={800}
          height={900}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Your next win starts with the right squad.
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <p.icon className="size-4" />
                </span>
                <span className="text-muted-foreground">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export function AuthField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}
