import AdminGalleryManagement from '@/src/components/Studio/Admin/AdminGalleryManagement'
import { useTranslation } from '@/src/app/i18n'

export const metadata = {
  title: 'BFDW Gallery Management | Mapstories',
}

export default async function BfdwAdminGalleryPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, 'admin')

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {t('bfdwGalleryManagement')}
        </h1>
        <p className="text-slate-600 mt-2">
          {t('manageBfdwGallery')}
        </p>
      </div>

      <AdminGalleryManagement site="BFDW" />
    </>
  )
}
