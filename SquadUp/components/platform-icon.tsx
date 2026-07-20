import { Monitor, Gamepad2 } from 'lucide-react'
import type { Platform } from '@/lib/data'
import { cn } from '@/lib/utils'

export function PlatformIcon({
  platform,
  className,
}: {
  platform: Platform
  className?: string
}) {
  const Icon = platform === 'PC' ? Monitor : Gamepad2
  return <Icon className={cn('size-4', className)} aria-hidden="true" />
}

export function platformLabel(platform: Platform): string {
  return platform
}
