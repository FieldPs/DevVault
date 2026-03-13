import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from '@heroui/react'
import Navbar from '@/components/layout/Navbar'
import { FriendsFeedSection } from '@/components/social/FriendsFeedSection'
import type { PublicComponent } from '@/types/component'
import { useComponentStore } from '@/store/componentStore'
import { parseError } from '@/utils/errorUtils'

function getOwnerName(component: PublicComponent): string {
  if (typeof component.ownerId === 'string') return 'Unknown'
  return component.ownerId.username
}

export default function ExplorePage() {
  const { fetchExploreComponents } = useComponentStore()
  const [components, setComponents] = useState<PublicComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [includeMine, setIncludeMine] = useState(true)
  const [selectedTab, setSelectedTab] = useState<string>('public')

  useEffect(() => {
    if (selectedTab !== 'public') return
    
    let active = true

    fetchExploreComponents(includeMine)
      .then((items) => {
        if (!active) return
        setComponents(items)
      })
      .catch((err) => {
        if (!active) return
        setError(parseError(err, 'Failed to load explore components'))
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchExploreComponents, includeMine, selectedTab])

  return (
    <div className="relative min-h-screen overflow-clip bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0f1a]">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Explore Components</h2>
          <p className="mt-1 text-sm text-gray-500">Discover public snippets and components from your friends.</p>
        </div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList: 'gap-2 bg-white/5 p-1 rounded-lg',
            tab: 'px-4 py-2 text-sm',
            cursor: 'bg-purple-500/20 text-purple-300',
            panel: 'mt-4',
          }}
        >
          <Tab key="public" title="Public">
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={includeMine}
                  onChange={(e) => setIncludeMine(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                />
                Include my public components
              </label>
            </div>

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
                Loading explore feed…
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            {!loading && !error && components.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
                No public components found for this filter.
              </div>
            )}

            {!loading && !error && components.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {components.map((component) => (
                  <article key={component._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="truncate text-base font-semibold text-white">{component.title}</h3>
                    <p className="mt-1 text-xs text-gray-400">
                      By{' '}
                      <Link
                        to={`/u/${getOwnerName(component)}`}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {getOwnerName(component)}
                      </Link>
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-blue-300">
                        {component.language}
                      </span>
                      <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-violet-300">
                        Public
                      </span>
                    </div>
                    <Link
                      to={`/c/${component._id}`}
                      className="mt-4 inline-flex rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                    >
                      Open Public View
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </Tab>

          <Tab key="friends" title="Friends">
            <FriendsFeedSection />
          </Tab>
        </Tabs>
      </main>
    </div>
  )
}
