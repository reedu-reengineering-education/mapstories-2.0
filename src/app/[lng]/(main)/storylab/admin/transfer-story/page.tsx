import AdminTransferStory from '@/src/components/Studio/Admin/AdminTransferStory'
import { useTranslation } from '@/src/app/i18n'

export const metadata = {
  title: 'Transfer Story | Mapstories Admin',
}

export default async function AdminTransferStoryPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'admin')

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t('transferStoryTitle')}
        </h1>
        <p className="text-slate-600 mt-2">
          {t('transferStoryPageDescription')}
        </p>
      </div>

      <AdminTransferStory />
    </>
  )
}
