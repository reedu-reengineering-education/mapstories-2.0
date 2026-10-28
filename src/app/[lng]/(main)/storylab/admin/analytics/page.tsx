import AdminAnalytics from '@/src/components/Studio/Admin/AdminAnalytics'

export const metadata = {
  title: 'Analytics Dashboard | Mapstories',
}

export default function AdminAnalyticsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Überblick über Stories, Nutzer und Aktivität in der Datenbank
        </p>
      </div>

      <AdminAnalytics />
    </>
  )
}
