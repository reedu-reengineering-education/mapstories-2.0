import AdminGalleryManagement from '@/src/components/Studio/Admin/AdminGalleryManagement'
import { useTranslation } from '@/src/app/i18n'

export const metadata = {
  title: 'Admin Gallery Management | Mapstories',
}

export default async function AdminGalleryPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'admin')

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t('galleryManagement')}
        </h1>
        <p className="text-slate-600 mt-2">
          {t('managePublicGallery')}
        </p>
      </div>

      <AdminGalleryManagement />
    </>
  )
}
