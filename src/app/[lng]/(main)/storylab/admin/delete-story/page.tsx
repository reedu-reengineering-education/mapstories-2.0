import AdminDeleteStory from '@/src/components/Studio/Admin/AdminDeleteStory'

export const metadata = {
  title: 'Delete Story | Mapstories Admin',
}

export default function AdminDeleteStoryPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Delete Story
        </h1>
        <p className="text-slate-600 mt-2">
          Permanently delete a story and all its content
        </p>
      </div>

      <AdminDeleteStory />
    </>
  )
}
