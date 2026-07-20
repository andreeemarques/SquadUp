import Image from 'next/image'
import Link from 'next/link'
import { Search, PlusCircle, Users, ShieldCheck, Zap, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SquadCard } from '@/components/squad-card'
import { SQUAD_POSTS } from '@/lib/data'

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Matchmaking',
    description:
      'Filter by platform, region, rank, game mode and language to find teammates who fit your playstyle.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Ranks',
    description:
      'Rank badges and match history help you build a squad at the right skill level, every time.',
  },
  {
    icon: Zap,
    title: 'Instant Squads',
    description:
      'Post a request or jump into an active squad in seconds. No waiting, no dead lobbies.',
  },
]

const STATS = [
  { value: '48K+', label: 'Active players' },
  { value: '12K', label: 'Squads formed daily' },
  { value: '5', label: 'Platforms & regions' },
  { value: '4.8', label: 'Avg. teammate rating' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-operators.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Crosshair className="size-3.5" />
              Rainbow Six Siege Team Finder
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Find your squad.
              <br />
              <span className="text-primary">Win the round.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Stop soloqueuing with randoms. Match with disciplined teammates by
              platform, rank, and region — then breach, clear, and climb
              together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-6 text-base"
                nativeButton={false}
                render={<Link href="/search" />}
              >
                <Search className="size-5" />
                Find Squad
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                nativeButton={false}
                render={<Link href="/create" />}
              >
                <PlusCircle className="size-5" />
                Create Post
              </Button>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-bold text-foreground">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Built for tactical players
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to assemble a coordinated fireteam and stop
            losing rounds to bad comms.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live squads */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                Live now
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                Active squad posts
              </h2>
            </div>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/search" />}
            >
              <Users className="size-4" />
              View all squads
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SQUAD_POSTS.slice(0, 3).map((post) => (
              <SquadCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center sm:p-16">
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to assemble your fireteam?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Create your profile, post a squad request, and get matched with
            players who take the objective as seriously as you do.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-6 text-base"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Get started free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
              nativeButton={false}
              render={<Link href="/search" />}
            >
              Browse squads
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Crosshair className="size-4" />
            </span>
            <span className="font-display font-bold tracking-wide">
              SQUAD<span className="text-primary">UP</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Not affiliated with or endorsed by Ubisoft. Fan-made LFG tool.
          </p>
        </div>
      </footer>
    </main>
  )
}
