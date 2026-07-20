import { Shield } from 'lucide-react'
import { RANK_COLORS, type Rank } from '@/lib/data'
import { cn } from '@/lib/utils'

export function RankBadge({
  rank,
  className,
  showIcon = true,
}: {
  rank: Rank
  className?: string
  showIcon?: boolean
}) {
  const color = RANK_COLORS[rank]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold',
        className,
      )}
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1a`,
      }}
    >
      {showIcon && <Shield className="size-3.5" aria-hidden="true" />}
      {rank}
    </span>
  )
}
