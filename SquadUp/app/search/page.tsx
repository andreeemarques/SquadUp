'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SquadCard } from '@/components/squad-card'
import {
  SearchFilters,
  EMPTY_FILTERS,
  type Filters,
} from '@/components/search-filters'
import { SQUAD_POSTS } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [query, setQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const results = useMemo(() => {
    return SQUAD_POSTS.filter((post) => {
      if (filters.platforms.length && !filters.platforms.includes(post.platform))
        return false
      if (filters.regions.length && !filters.regions.includes(post.region))
        return false
      if (filters.ranks.length && !filters.ranks.includes(post.rank))
        return false
      if (filters.modes.length && !filters.modes.includes(post.mode))
        return false
      if (
        filters.languages.length &&
        !filters.languages.includes(post.language)
      )
        return false
      if (filters.micOnly && !post.micRequired) return false
      if (
        query &&
        !post.username.toLowerCase().includes(query.toLowerCase()) &&
        !post.description.toLowerCase().includes(query.toLowerCase())
      )
        return false
      return true
    })
  }, [filters, query])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Find a Squad
        </h1>
        <p className="text-muted-foreground">
          Browse active squad posts and filter down to teammates that match your
          setup.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Filters sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <SearchFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by username or keyword..."
                className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              {results.length}
            </span>{' '}
            {results.length === 1 ? 'squad' : 'squads'} found
          </div>

          {results.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((post) => (
                <SquadCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Search className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                No squads match your filters
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try loosening a few filters or clearing your search to see more
                results.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setFilters(EMPTY_FILTERS)
                  setQuery('')
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity',
            mobileFiltersOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto border-r border-border bg-card p-5 transition-transform',
            mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-lg font-semibold">Filters</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close filters"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
          <SearchFilters filters={filters} onChange={setFilters} />
          <Button
            className="mt-6 w-full"
            onClick={() => setMobileFiltersOpen(false)}
          >
            Show {results.length} results
          </Button>
        </div>
      </div>
    </main>
  )
}
