import { fromApiEnum } from '@/lib/api'
import { type SquadPost } from '@/lib/data'

export interface ApiSquadPost {
  id: string
  userId: string
  platform: string
  region: string
  rank: string
  mode: string
  language: string
  micRequired: boolean
  playersNeeded: number
  description: string
  createdAt: string
  updatedAt: string
  requestStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | null
  user: { username: string; avatar: string | null }
  notifications: { actor: { username: string; avatar: string | null } }[]
}

export function mapApiPost(post: ApiSquadPost): SquadPost {
  const createdMinutesAgo = Math.max(
    0,
    Math.round((Date.now() - new Date(post.createdAt).getTime()) / 60000),
  )
  const updatedMinutesAgo = Math.max(
    0,
    Math.round((Date.now() - new Date(post.updatedAt).getTime()) / 60000),
  )
  const wasEdited = post.updatedAt !== post.createdAt

    return {
    id: post.id,
    userId: post.userId,
    username: post.user.username,
    avatar: post.user.avatar || '/placeholder.svg',
    platform: post.platform as SquadPost['platform'],
    region: fromApiEnum(post.region) as SquadPost['region'],
    rank: post.rank as SquadPost['rank'],
    mode: fromApiEnum(post.mode) as SquadPost['mode'],
    language: post.language as SquadPost['language'],
    micRequired: post.micRequired,
    playersNeeded: post.playersNeeded,
    description: post.description,
    postedMinutesAgo: createdMinutesAgo,
    editedMinutesAgo: wasEdited ? updatedMinutesAgo : null,
    requestStatus: post.requestStatus,
    acceptedMembers: post.notifications.map((n) => n.actor),
    }
}