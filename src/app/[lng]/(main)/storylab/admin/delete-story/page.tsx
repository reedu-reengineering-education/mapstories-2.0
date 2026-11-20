import AdminDeleteStory from '@/src/components/Studio/Admin/AdminDeleteStory'
import { useTranslation } from '@/src/app/i18n'

export const metadata = {
  title: 'Delete Story | Mapstories Admin',
}

export default async function AdminDeleteStoryPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'admin')

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t('deleteStoryTitle')}
        </h1>
        <p className="text-slate-600 mt-2">
          {t('deleteStoryPageDescription')}
        </p>
      </div>

      <AdminDeleteStory />
    </>
  )
}
