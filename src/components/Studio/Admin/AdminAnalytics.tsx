'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/src/app/i18n/client'
import { useBoundStore } from '@/src/lib/store/store'
import useAdminAnalytics from '@/src/lib/api/admin/useAdminAnalytics'
import {
  BookOpenIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  PhotoIcon,
  RectangleStackIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

type LabelCount = { label: string; count: number }
type TimeBucket = { month: string; count: number }

const barPalette = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-teal-500',
  'bg-orange-500',
]

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: number | string
  hint?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="truncate text-sm text-slate-500">{label}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  )
}

function TimeSeriesChart({
  title,
  data,
  color,
}: {
  title: string
  data: TimeBucket[]
  color: string
}) {
  const max = Math.max(1, ...data.map(d => d.count))
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="flex h-48 items-end justify-between gap-1">
        {data.map(bucket => (
          <div
            className="group flex flex-1 flex-col items-center justify-end gap-1"
            key={bucket.month}
          >
            <span className="text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100">
              {bucket.count}
            </span>
            <div
              className={`w-full rounded-t ${color} transition-all`}
              style={{
                height: `${Math.max((bucket.count / max) * 100, 2)}%`,
              }}
              title={`${bucket.month}: ${bucket.count}`}
            />
            <span className="whitespace-nowrap text-[10px] text-slate-400">
              {bucket.month.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DistributionChart({
  title,
  data,
}: {
  title: string
  data: LabelCount[]
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      {data.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">–</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
            return (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>
                  <span className="text-slate-500">
                    {item.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      barPalette[index % barPalette.length]
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminAnalytics() {
  const lng = useBoundStore(state => state.language)
  // @ts-ignore i18next's t return type exceeds the instantiation depth limit
  // (TS2589) in this large component; cast to a simple signature.
  const { t: tRaw } = useTranslation(lng, 'admin')
  const t = tRaw as (key: string) => string
  const { analytics, loading, fetchAnalytics } = useAdminAnalytics()

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading && !analytics) {
    return (
      <div className="py-16 text-center text-slate-400">
        {t('admin:loadingAnalytics')}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="py-16 text-center text-slate-400">
        {t('admin:noAnalyticsData')}
      </div>
    )
  }

  const { totals } = analytics

  return (
    <div className="space-y-8">
      {/* Overview stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          hint={`${totals.publicStories} ${t('admin:public')} · ${
            totals.privateStories
          } ${t('admin:private')}`}
          icon={BookOpenIcon}
          label={t('admin:totalStories')}
          value={totals.stories}
        />
        <StatCard
          hint={`${totals.adminUsers} ${t('admin:admins')} · ${
            totals.regularUsers
          } ${t('admin:users')}`}
          icon={UsersIcon}
          label={t('admin:totalUsers')}
          value={totals.users}
        />
        <StatCard
          hint={`⌀ ${totals.avgStepsPerStory} ${t('admin:perStory')}`}
          icon={RectangleStackIcon}
          label={t('admin:totalSteps')}
          value={totals.steps}
        />
        <StatCard
          icon={PhotoIcon}
          label={t('admin:totalMedia')}
          value={totals.media}
        />
        <StatCard
          icon={SparklesIcon}
          label={t('admin:galleryStoriesCount')}
          value={totals.galleryStories}
        />
        <StatCard
          icon={GlobeAltIcon}
          label={t('admin:communityStories')}
          value={totals.communityStories}
        />
        <StatCard
          icon={LightBulbIcon}
          label={t('admin:stepSuggestions')}
          value={totals.stepSuggestions}
        />
        <StatCard
          icon={ChartBarIcon}
          label={t('admin:translationStories')}
          value={totals.translationStories}
        />
      </div>

      {/* Time series */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TimeSeriesChart
          color="bg-indigo-500"
          data={analytics.storiesOverTime}
          title={t('admin:storiesOverTime')}
        />
        <TimeSeriesChart
          color="bg-emerald-500"
          data={analytics.usersOverTime}
          title={t('admin:usersOverTime')}
        />
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DistributionChart
          data={analytics.storiesByVisibility}
          title={t('admin:byVisibility')}
        />
        <DistributionChart
          data={analytics.storiesByMode}
          title={t('admin:byMode')}
        />
        <DistributionChart
          data={analytics.usersByRole}
          title={t('admin:byRole')}
        />
        <DistributionChart
          data={analytics.storiesByLanguage}
          title={t('admin:byLanguage')}
        />
        <DistributionChart
          data={analytics.suggestionsByStatus}
          title={t('admin:bySuggestionStatus')}
        />
      </div>

      {/* Top authors + recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {t('admin:topAuthors')}
          </h3>
          {analytics.topAuthors.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">–</p>
          ) : (
            <ol className="space-y-3">
              {analytics.topAuthors.map((author, index) => (
                <li
                  className="flex items-center gap-3"
                  key={`${author.email}-${index}`}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {author.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {author.email}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-sm font-semibold text-indigo-600">
                    {author.count}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {t('admin:recentStories')}
          </h3>
          <ul className="space-y-3">
            {analytics.recentStories.map(story => (
              <li
                className="flex items-center justify-between gap-2"
                key={story.id}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {story.name || t('admin:untitled')}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {story.owner ?? '—'}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400">
                  {formatDate(story.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {t('admin:recentUsers')}
          </h3>
          <ul className="space-y-3">
            {analytics.recentUsers.map(u => (
              <li className="flex items-center justify-between gap-2" key={u.id}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {u.name || u.email || t('admin:untitled')}
                  </p>
                  <p className="truncate text-xs text-slate-400">{u.role}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-slate-400">
                  {formatDate(u.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
