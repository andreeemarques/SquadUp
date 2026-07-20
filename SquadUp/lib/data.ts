export type Platform = 'PC' | 'PlayStation' | 'Xbox'
export type Region =
  | 'North America'
  | 'Europe'
  | 'South America'
  | 'Asia'
  | 'Oceania'
export type Rank =
  | 'Copper'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Emerald'
  | 'Diamond'
  | 'Champion'
export type GameMode = 'Ranked' | 'Standard' | 'Quick Match'
export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Portuguese'

export const PLATFORMS: Platform[] = ['PC', 'PlayStation', 'Xbox']
export const REGIONS: Region[] = [
  'North America',
  'Europe',
  'South America',
  'Asia',
  'Oceania',
]
export const RANKS: Rank[] = [
  'Copper',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Diamond',
  'Champion',
]
export const GAME_MODES: GameMode[] = ['Ranked', 'Standard', 'Quick Match']
export const LANGUAGES: Language[] = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
]

/** Rank badge accent color mapped to a tailwind text/border token via inline style */
export const RANK_COLORS: Record<Rank, string> = {
  Copper: '#b06a4a',
  Bronze: '#9c6f3f',
  Silver: '#9aa6b2',
  Gold: '#e0b341',
  Platinum: '#4fd0d6',
  Emerald: '#3fce87',
  Diamond: '#6aa6ff',
  Champion: '#e0554f',
}

export interface SquadPost {
  id: string
  username: string
  avatar: string
  platform: Platform
  region: Region
  rank: Rank
  mode: GameMode
  language: Language
  micRequired: boolean
  playersNeeded: number
  description: string
  postedMinutesAgo: number
}

export const SQUAD_POSTS: SquadPost[] = [
  {
    id: '1',
    username: 'GhostRecon_47',
    avatar: '/avatars/operator-1.png',
    platform: 'PC',
    region: 'North America',
    rank: 'Diamond',
    mode: 'Ranked',
    language: 'English',
    micRequired: true,
    playersNeeded: 2,
    description:
      'Pushing for Champion this season. Looking for 2 solid entry fraggers with good comms and drone discipline.',
    postedMinutesAgo: 4,
  },
  {
    id: '2',
    username: 'ValkyrieMain',
    avatar: '/avatars/operator-2.png',
    platform: 'PlayStation',
    region: 'Europe',
    rank: 'Platinum',
    mode: 'Ranked',
    language: 'English',
    micRequired: true,
    playersNeeded: 1,
    description:
      'Support/roamer looking for a chill but competitive stack. Need one more for consistent 5-man.',
    postedMinutesAgo: 12,
  },
  {
    id: '3',
    username: 'BreachKing',
    avatar: '/avatars/operator-3.png',
    platform: 'Xbox',
    region: 'North America',
    rank: 'Gold',
    mode: 'Standard',
    language: 'English',
    micRequired: false,
    playersNeeded: 3,
    description:
      'Casual standard grind after work. Mic optional, just wanna have fun and win some rounds.',
    postedMinutesAgo: 27,
  },
  {
    id: '4',
    username: 'Sledge_Diff',
    avatar: '/avatars/operator-4.png',
    platform: 'PC',
    region: 'Europe',
    rank: 'Emerald',
    mode: 'Ranked',
    language: 'German',
    micRequired: true,
    playersNeeded: 2,
    description:
      'Hard entry main, high win rate. Want 2 disciplined players who can hold sites and trade.',
    postedMinutesAgo: 41,
  },
  {
    id: '5',
    username: 'AceClutch',
    avatar: '/avatars/operator-1.png',
    platform: 'PlayStation',
    region: 'South America',
    rank: 'Champion',
    mode: 'Ranked',
    language: 'Portuguese',
    micRequired: true,
    playersNeeded: 1,
    description:
      'Top 500 stack needs a fifth. Scrim experience preferred. Serious players only, VOD review after sessions.',
    postedMinutesAgo: 58,
  },
  {
    id: '6',
    username: 'QuietStorm',
    avatar: '/avatars/operator-2.png',
    platform: 'PC',
    region: 'Asia',
    rank: 'Silver',
    mode: 'Quick Match',
    language: 'English',
    micRequired: false,
    playersNeeded: 4,
    description:
      'New-ish player learning the ropes. Building a full squad to grind quick match and improve together.',
    postedMinutesAgo: 73,
  },
  {
    id: '7',
    username: 'ThatchDrone',
    avatar: '/avatars/operator-3.png',
    platform: 'Xbox',
    region: 'Oceania',
    rank: 'Gold',
    mode: 'Standard',
    language: 'English',
    micRequired: true,
    playersNeeded: 2,
    description:
      'OCE player looking for teammates in a similar timezone. Objective focused, no toxic attitudes.',
    postedMinutesAgo: 95,
  },
  {
    id: '8',
    username: 'IQ_Enjoyer',
    avatar: '/avatars/operator-4.png',
    platform: 'PC',
    region: 'Europe',
    rank: 'Platinum',
    mode: 'Ranked',
    language: 'French',
    micRequired: true,
    playersNeeded: 3,
    description:
      'Rebuilding my ranked squad. Looking for flexible players who can fill any role and communicate well.',
    postedMinutesAgo: 128,
  },
]

export function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  comment: string
  daysAgo: number
}

export const PROFILE = {
  username: 'GhostRecon_47',
  ubisoftId: 'GhostRecon.47',
  avatar: '/avatars/operator-1.png',
  platform: 'PC' as Platform,
  region: 'North America' as Region,
  rank: 'Diamond' as Rank,
  mainRole: 'Entry Fragger',
  bio: 'Competitive R6 player since Year 3. Shotcaller and hard entry. Grinding for Champion every season.',
  operators: ['Ash', 'Zofia', 'Sledge', 'Jäger', 'Bandit', 'Mute'],
  stats: {
    kd: '1.34',
    winRate: '58%',
    matches: 1247,
    hoursPlayed: 2140,
    headshotPct: '41%',
    currentMMR: 4180,
  },
  rankHistory: [
    { season: 'Y8S1', rank: 'Platinum' as Rank },
    { season: 'Y8S2', rank: 'Emerald' as Rank },
    { season: 'Y8S3', rank: 'Diamond' as Rank },
    { season: 'Y8S4', rank: 'Diamond' as Rank },
    { season: 'Y9S1', rank: 'Diamond' as Rank },
  ],
  reviews: [
    {
      id: 'r1',
      author: 'ValkyrieMain',
      avatar: '/avatars/operator-2.png',
      rating: 5,
      comment:
        'Great shotcaller, always positive even when we lose. Comms are clean and calls are precise.',
      daysAgo: 2,
    },
    {
      id: 'r2',
      author: 'BreachKing',
      avatar: '/avatars/operator-3.png',
      rating: 5,
      comment:
        'Carried our ranked sessions all week. Super reliable entry and never tilts. Would squad again.',
      daysAgo: 6,
    },
    {
      id: 'r3',
      author: 'Sledge_Diff',
      avatar: '/avatars/operator-4.png',
      rating: 4,
      comment:
        'Solid mechanics and game sense. Sometimes over-aggressive but usually makes it work.',
      daysAgo: 11,
    },
  ] as Review[],
}
