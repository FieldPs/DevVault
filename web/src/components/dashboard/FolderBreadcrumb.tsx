import { ChevronRight } from 'lucide-react'
import { useFolderStore } from '@/store/folderStore'

export default function FolderBreadcrumb() {
  const { getBreadcrumbs, selectFolder } = useFolderStore()
  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return (
      <p className="mb-4 text-sm text-gray-500">
        Showing: <span className="text-gray-300">All Components</span>
      </p>
    )
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500">
      <button onClick={() => selectFolder(null)} className="text-gray-400 hover:text-white">
        All Components
      </button>
      {breadcrumbs.map((folder) => (
        <div key={folder._id} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          <button onClick={() => selectFolder(folder._id)} className="text-gray-300 hover:text-white">
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  )
}
