import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/src/lib/auth'
import { db } from '@/src/lib/db'

type TimeBucket = { month: string; count: number }
type LabelCount = { label: string; count: number }

type AnalyticsData = {
  totals: {
    stories: number
    publicStories: number
    privateStories: number
    communityStories: number
    translationStories: number
    users: number
    adminUsers: number
    regularUsers: number
    steps: number
    media: number
    galleryStories: number
    stepSuggestions: number
    avgStepsPerStory: number
  }
  storiesByVisibility: LabelCount[]
  storiesByMode: LabelCount[]
  storiesByLanguage: LabelCount[]
  usersByRole: LabelCount[]
  suggestionsByStatus: LabelCount[]
  storiesOverTime: TimeBucket[]
  usersOverTime: TimeBucket[]
  topAuthors: { name: string; email: string; count: number }[]
  recentStories: {
    id: string
    name: string | null
    visibility: string
    createdAt: Date
    owner: string | null
  }[]
  recentUsers: {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: Date
  }[]
}

type Data = ({ success: true } & AnalyticsData) | { error: string }

// Builds an array of the last `months` month keys, e.g. "2026-08".
function buildMonthKeys(months: number): string[] {
  const keys: string[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

function bucketByMonth(dates: Date[], months: number): TimeBucket[] {
  const keys = buildMonthKeys(months)
  const counts = new Map<string, number>(keys.map(k => [k, 0]))
  for (const date of dates) {
    const d = new Date(date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return keys.map(month => ({ month, count: counts.get(month) ?? 0 }))
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' })
  }

  try {
    const MONTHS = 12

    const [
      totalStories,
      publicStories,
      privateStories,
      communityStories,
      translationStories,
      totalUsers,
      adminUsers,
      totalSteps,
      totalMedia,
      totalGalleryStories,
      totalSuggestions,
      storiesByModeRaw,
      storiesByLanguageRaw,
      suggestionsByStatusRaw,
      storyDates,
      userDates,
      topAuthorsRaw,
      recentStoriesRaw,
      recentUsersRaw,
    ] = await Promise.all([
      db.story.count(),
      db.story.count({ where: { visibility: 'PUBLIC' } }),
      db.story.count({ where: { visibility: 'PRIVATE' } }),
      db.story.count({ where: { community: true } }),
      db.story.count({ where: { isTranslation: true } }),
      db.user.count(),
      db.user.count({ where: { role: 'ADMIN' } }),
      db.storyStep.count(),
      db.media.count(),
      db.galleryStory.count(),
      db.storyStepSuggestion.count(),
      db.story.groupBy({ by: ['mode'], _count: { _all: true } }),
      db.story.groupBy({ by: ['language'], _count: { _all: true } }),
      db.storyStepSuggestion.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      db.story.findMany({ select: { createdAt: true } }),
      db.user.findMany({ select: { createdAt: true } }),
      db.story.groupBy({
        by: ['ownerId'],
        _count: { _all: true },
        where: { ownerId: { not: null } },
        orderBy: { _count: { ownerId: 'desc' } },
        take: 10,
      }),
      db.story.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          name: true,
          visibility: true,
          createdAt: true,
          owner: { select: { name: true, email: true } },
        },
      }),
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ])

    // Resolve top authors to their names/emails.
    const authorIds = topAuthorsRaw
      .map(a => a.ownerId)
      .filter((id): id is string => id !== null)
    const authorUsers = await db.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true, email: true },
    })
    const authorMap = new Map(authorUsers.map(u => [u.id, u]))
    const topAuthors = topAuthorsRaw
      .filter(a => a.ownerId)
      .map(a => {
        const u = authorMap.get(a.ownerId as string)
        return {
          name: u?.name ?? 'Unbekannt',
          email: u?.email ?? '',
          count: a._count._all,
        }
      })

    const data: Data = {
      success: true,
      totals: {
        stories: totalStories,
        publicStories,
        privateStories,
        communityStories,
        translationStories,
        users: totalUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers,
        steps: totalSteps,
        media: totalMedia,
        galleryStories: totalGalleryStories,
        stepSuggestions: totalSuggestions,
        avgStepsPerStory:
          totalStories > 0
            ? Math.round((totalSteps / totalStories) * 10) / 10
            : 0,
      },
      storiesByVisibility: [
        { label: 'PUBLIC', count: publicStories },
        { label: 'PRIVATE', count: privateStories },
      ],
      storiesByMode: storiesByModeRaw.map(m => ({
        label: m.mode,
        count: m._count._all,
      })),
      storiesByLanguage: storiesByLanguageRaw
        .map(l => ({ label: l.language, count: l._count._all }))
        .sort((a, b) => b.count - a.count),
      usersByRole: [
        { label: 'ADMIN', count: adminUsers },
        { label: 'USER', count: totalUsers - adminUsers },
      ],
      suggestionsByStatus: suggestionsByStatusRaw.map(s => ({
        label: s.status,
        count: s._count._all,
      })),
      storiesOverTime: bucketByMonth(
        storyDates.map(s => s.createdAt),
        MONTHS,
      ),
      usersOverTime: bucketByMonth(
        userDates.map(u => u.createdAt),
        MONTHS,
      ),
      topAuthors,
      recentStories: recentStoriesRaw.map(s => ({
        id: s.id,
        name: s.name,
        visibility: s.visibility,
        createdAt: s.createdAt,
        owner: s.owner?.name ?? s.owner?.email ?? null,
      })),
      recentUsers: recentUsersRaw,
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return res.status(500).json({ error: 'Failed to fetch analytics' })
  }
}
