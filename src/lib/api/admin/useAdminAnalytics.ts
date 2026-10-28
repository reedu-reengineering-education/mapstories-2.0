import { useCallback, useState } from 'react'
import { toast } from '@/src/lib/toast'

type TimeBucket = { month: string; count: number }
type LabelCount = { label: string; count: number }

export interface AdminAnalytics {
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
    createdAt: string
    owner: string | null
  }[]
  recentUsers: {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: string
  }[]
}

interface UseAdminAnalyticsReturn {
  analytics: AdminAnalytics | null
  loading: boolean
  fetchAnalytics: () => Promise<void>
}

export default function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: 'Error',
        message: 'Failed to fetch analytics',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  return { analytics, loading, fetchAnalytics }
}
