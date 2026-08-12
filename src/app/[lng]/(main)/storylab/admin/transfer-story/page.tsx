import AdminTransferStory from '@/src/components/Studio/Admin/AdminTransferStory'

export const metadata = {
  title: 'Transfer Story | Mapstories Admin',
}

export default function AdminTransferStoryPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Transfer Story
        </h1>
        <p className="text-slate-600 mt-2">
          Transfer ownership of a story from one user to another
        </p>
      </div>

      <AdminTransferStory />
    </>
  )
}
