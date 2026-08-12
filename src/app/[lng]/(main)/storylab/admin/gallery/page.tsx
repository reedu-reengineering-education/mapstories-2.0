import AdminGalleryManagement from '@/src/components/Studio/Admin/AdminGalleryManagement'

export const metadata = {
  title: 'Admin Gallery Management | Mapstories',
}

export default function AdminGalleryPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Gallery Management
        </h1>
        <p className="text-slate-600 mt-2">
          Manage which stories appear in the public gallery
        </p>
      </div>

      <AdminGalleryManagement />
    </>
  )
}
