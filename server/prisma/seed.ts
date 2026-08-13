import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const AVATARS = [
  '/avatars/operator-1.png',
  '/avatars/operator-2.png',
  '/avatars/operator-3.png',
  '/avatars/operator-4.png',
]

const RANKS = ['Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion'] as const
const PLATFORMS = ['PC', 'PlayStation', 'Xbox'] as const
const REGIONS = ['North_America', 'Europe', 'South_America', 'Asia', 'Oceania'] as const
const MODES = ['Ranked', 'Standard', 'Quick_Match'] as const
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese'] as const

const OPERATORS = [
  'Ace', 'Ash', 'Thermite', 'Thatcher', 'Sledge', 'Zofia', 'Iana', 'Jackal',
  'Bandit', 'Mute', 'Rook', 'Caveira', 'Valkyrie', 'Mira', 'Jäger', 'Vigil',
]

const USERS = [
  { username: 'ValkyrieMain', email: 'valkyriemain@example.com', ubisoftId: 'Valkyrie.Prime', bio: 'Flex player, main defender. Looking for a squad that pushes ranked seriously.' },
  { username: 'BreachKing', email: 'breachking@example.com', ubisoftId: 'BreachKing.99', bio: 'Entry fragger, always first through the door. Mic required, no exceptions.' },
  { username: 'FrostBite_', email: 'frostbite@example.com', ubisoftId: 'FrostBite.EU', bio: 'Casual player, mostly quick match. Chill vibes only.' },
  { username: 'TachankaGOD', email: 'tachankagod@example.com', ubisoftId: 'Tachanka.Turret', bio: 'Anchor main. If you need someone to hold a site, I got you.' },
  { username: 'SilentOps', email: 'silentops@example.com', ubisoftId: 'SilentOps.LATAM', bio: 'Support player, callouts and utility management.' },
  { username: 'RookieRaven', email: 'rookieraven@example.com', ubisoftId: 'RookieRaven.X', bio: 'Newer to ranked, learning the maps. Looking for a patient squad.' },
  { username: 'Frag_Machine', email: 'fragmachine@example.com', ubisoftId: 'FragMachine.OCE', bio: 'High sensitivity, high aggression. Not for the faint of heart.' },
  { username: 'CalmUnderFire', email: 'calmunderfire@example.com', ubisoftId: 'Calm.Under.Fire', bio: 'IGL, shot caller. Looking for a coordinated 5-stack.' },
]

const DESCRIPTIONS = [
  'Grinding ranked tonight, need a solid comp. Good comms and map knowledge preferred.',
  'Casual quick match squad, just here to have fun and try new operators.',
  'Pushing for Diamond this season, looking for consistent teammates.',
  'New to the game, would love a friendly squad to learn with.',
  'Running standard matches to practice site executes before ranked.',
  'Late night squad forming, EU timezone. Mic strongly preferred.',
  'Looking for one more anchor main to round out the comp.',
  'Weekend warriors welcome, no toxicity please.',
]

async function main() {
  console.log('Cleaning up old data...')
  await prisma.notification.deleteMany()
  await prisma.squadPost.deleteMany()
  await prisma.user.deleteMany({ where: { email: { in: USERS.map((u) => u.email) } } })

  console.log('Creating users...')
  const passwordHash = await bcrypt.hash('Password123', 10)

  const createdUsers = []
  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i]
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        password: passwordHash,
        ubisoftId: u.ubisoftId,
        bio: u.bio,
        avatar: AVATARS[i % AVATARS.length],
        platform: PLATFORMS[i % PLATFORMS.length],
        rank: RANKS[i % RANKS.length],
        preferredOperators: OPERATORS.sort(() => 0.5 - Math.random()).slice(0, 4),
        emailVerified: true,
      },
    })
    createdUsers.push(user)
  }

  console.log('Creating squad posts...')
  const createdPosts = []
  for (let i = 0; i < 15; i++) {
    const owner = createdUsers[i % createdUsers.length]
    const post = await prisma.squadPost.create({
      data: {
        userId: owner.id,
        platform: PLATFORMS[i % PLATFORMS.length],
        region: REGIONS[i % REGIONS.length],
        rank: RANKS[i % RANKS.length],
        mode: MODES[i % MODES.length],
        language: LANGUAGES[i % LANGUAGES.length],
        micRequired: i % 3 !== 0,
        playersNeeded: (i % 3) + 1,
        description: DESCRIPTIONS[i % DESCRIPTIONS.length],
        createdAt: new Date(Date.now() - i * 6 * 60 * 1000), // spread out over the last ~90 min
      },
    })
    createdPosts.push(post)
  }

  console.log('Creating some accepted join requests...')
  for (let i = 0; i < 5; i++) {
    const post = createdPosts[i]
    const actor = createdUsers[(i + 3) % createdUsers.length]
    if (actor.id === post.userId) continue

    await prisma.notification.create({
      data: {
        recipientId: post.userId,
        actorId: actor.id,
        squadPostId: post.id,
        type: 'JOIN_REQUEST',
        status: 'ACCEPTED',
        read: true,
      },
    })
  }

  console.log(`Seed completed: ${createdUsers.length} users, ${createdPosts.length} posts.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })