import AdminDuplicateStory from '@/src/components/Studio/Admin/AdminDuplicateStory'
import { useTranslation } from '@/src/app/i18n'

export const metadata = {
  title: 'Duplicate Story | Mapstories Admin',
}

export default async function AdminDuplicateStoryPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'admin')

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t('duplicateStoryTitle')}
        </h1>
        <p className="text-slate-600 mt-2">
          {t('duplicateStoryPageDescription')}
        </p>
      </div>

      <AdminDuplicateStory />
    </>
  )
}
