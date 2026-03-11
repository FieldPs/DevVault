import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import StatsStrip from '@/components/dashboard/StatsStrip'
import ComponentEmptyState from '@/components/dashboard/ComponentEmptyState'
import ComponentList from '@/components/dashboard/ComponentList'
import FolderSidebar from '@/components/dashboard/FolderSidebar'
import FolderBreadcrumb from '@/components/dashboard/FolderBreadcrumb'
import { useComponentStore } from '@/store/componentStore'
import { useFolderStore } from '@/store/folderStore'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { components, loading, fetchComponents } = useComponentStore()
  const { selectedFolderId, fetchFolders, loading: foldersLoading, getSelectedFolderIds } = useFolderStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchComponents()
    fetchFolders()
  }, [fetchComponents, fetchFolders])

  const selectedFolderIds = getSelectedFolderIds()

  const folderFilteredComponents = selectedFolderId
    ? components.filter((component) => component.folderId && selectedFolderIds.includes(component.folderId))
    : components

  const filteredComponents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return folderFilteredComponents

    return folderFilteredComponents.filter((component) =>
      component.title.toLowerCase().includes(query) ||
      component.language.toLowerCase().includes(query)
    )
  }, [folderFilteredComponents, searchTerm])

  return (
    <div className="relative min-h-screen overflow-clip bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0f1a]">

      {/* Ambient background */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <div
          className="blob-1 absolute rounded-full"
          style={{ top: '-8%', left: '-6%', width: '550px', height: '550px', background: 'radial-gradient(circle at center, rgba(59,130,246,0.22) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="blob-2 absolute rounded-full"
          style={{ bottom: '-5%', right: '-4%', width: '500px', height: '500px', background: 'radial-gradient(circle at center, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(75px)' }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">

        {/* Page header */}
        <div className="animate-fade-in-up mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">My Components</h2>
            <p className="mt-1 text-sm text-gray-500">Manage and organise your React component library</p>
          </div>
          <button
            onClick={() => navigate(selectedFolderId ? `/components/new?folderId=${selectedFolderId}` : '/components/new')}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_0_24px_rgba(139,92,246,0.45),0_4px_16px_rgba(59,130,246,0.3)] active:translate-y-0"
          >
            {/* Darker gradient overlay on hover — hidden below content */}
            <span
              className="absolute inset-0 bg-gradient-to-br from-blue-700 to-violet-800 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden="true"
            />
            {/* Content always on top */}
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Component
            </span>
          </button>
        </div>

        <StatsStrip total={filteredComponents.length} components={filteredComponents.filter(c => c.template === 'react').length} favorites={0} />

        <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <FolderSidebar />
          <div>
            <FolderBreadcrumb />
            {(loading || foldersLoading) && (
              <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                Loading…
              </div>
            )}

            <div className="mb-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or language..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-violet-400/40 focus:outline-none"
              />
            </div>

            {!loading && !foldersLoading && filteredComponents.length === 0 && !searchTerm.trim() && <ComponentEmptyState />}
            {!loading && !foldersLoading && filteredComponents.length === 0 && searchTerm.trim() && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-gray-400">
                No components matched &quot;{searchTerm.trim()}&quot;.
              </div>
            )}
            {!loading && !foldersLoading && filteredComponents.length > 0 && <ComponentList components={filteredComponents} />}
          </div>
        </div>

      </main>
    </div>
  )
}
