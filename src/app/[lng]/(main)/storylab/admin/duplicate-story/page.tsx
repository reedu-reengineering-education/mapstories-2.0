import AdminDuplicateStory from '@/src/components/Studio/Admin/AdminDuplicateStory'

export const metadata = {
  title: 'Duplicate Story | Mapstories Admin',
}

export default function AdminDuplicateStoryPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Duplicate Story
        </h1>
        <p className="text-slate-600 mt-2">
          Create a copy of an existing story with all its steps and content
        </p>
      </div>

      <AdminDuplicateStory />
    </>
  )
}
