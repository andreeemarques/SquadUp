'use client'

import { Mic, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  PLATFORMS,
  REGIONS,
  RANKS,
  GAME_MODES,
  LANGUAGES,
  type Platform,
  type Region,
  type Rank,
  type GameMode,
  type Language,
} from '@/lib/data'

export interface Filters {
  platforms: Platform[]
  regions: Region[]
  ranks: Rank[]
  modes: GameMode[]
  languages: Language[]
  micOnly: boolean
}

export const EMPTY_FILTERS: Filters = {
  platforms: [],
  regions: [],
  ranks: [],
  modes: [],
  languages: [],
  micOnly: false,
}

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  function toggle<T>(key: keyof Filters, value: T) {
    const list = filters[key] as T[]
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value]
    onChange({ ...filters, [key]: next })
  }

  const activeCount =
    filters.platforms.length +
    filters.regions.length +
    filters.ranks.length +
    filters.modes.length +
    filters.languages.length +
    (filters.micOnly ? 1 : 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-wide">
          FILTERS
        </h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      <FilterGroup title="Platform">
        {PLATFORMS.map((p) => (
          <FilterCheck
            key={p}
            label={p}
            checked={filters.platforms.includes(p)}
            onToggle={() => toggle('platforms', p)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Region">
        {REGIONS.map((r) => (
          <FilterCheck
            key={r}
            label={r}
            checked={filters.regions.includes(r)}
            onToggle={() => toggle('regions', r)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rank">
        <div className="flex flex-wrap gap-2">
          {RANKS.map((rank) => {
            const active = filters.ranks.includes(rank)
            return (
              <button
                key={rank}
                type="button"
                onClick={() => toggle('ranks', rank)}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {rank}
              </button>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Game Mode">
        {GAME_MODES.map((m) => (
          <FilterCheck
            key={m}
            label={m}
            checked={filters.modes.includes(m)}
            onToggle={() => toggle('modes', m)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Language">
        {LANGUAGES.map((l) => (
          <FilterCheck
            key={l}
            label={l}
            checked={filters.languages.includes(l)}
            onToggle={() => toggle('languages', l)}
          />
        ))}
      </FilterGroup>

      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Mic className="size-4 text-primary" />
            Microphone required
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.micOnly}
            onClick={() => onChange({ ...filters, micOnly: !filters.micOnly })}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
              filters.micOnly ? 'bg-primary' : 'bg-input',
            )}
          >
            <span
              className="inline-block size-5 rounded-full bg-background transition-transform"
              style={{ transform: filters.micOnly ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </button>
        </label>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-border pt-4 first:border-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function FilterCheck({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label
      onClick={onToggle}
      className="flex cursor-pointer items-center gap-2.5 text-sm"
    >
      <span
        role="checkbox"
        aria-checked={checked}
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
          checked ? 'border-primary bg-primary' : 'border-border bg-transparent',
        )}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            className="size-3 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M2.5 6.5L5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        className={cn(
          checked ? 'text-foreground' : 'text-muted-foreground',
          'transition-colors',
        )}
      >
        {label}
      </span>
    </label>
  )
}
