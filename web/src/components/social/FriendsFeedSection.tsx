import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Spinner } from '@heroui/react'
import api from '@/lib/api'
import type { PublicComponent, PublicOwner } from '@/types/component'

function getOwnerName(component: PublicComponent): string {
  if (typeof component.ownerId === 'string') return 'Unknown'
  return (component.ownerId as PublicOwner).username
}

export function FriendsFeedSection() {
  const [components, setComponents] = useState<PublicComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setLoading(true)
    api
      .get('/components/friends')
      .then((res) => {
        if (!active) return
        setComponents(res.data.components as PublicComponent[])
      })
      .catch(() => {
        if (!active) return
        setError('Failed to load friends\' components')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardBody className="flex items-center justify-center py-8">
          <Spinner size="md" color="primary" />
          <span className="ml-2 text-sm text-gray-400">Loading friends' components...</span>
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-red-500/20 bg-red-500/10">
        <CardBody className="py-4 text-center text-sm text-red-300">
          {error}
        </CardBody>
      </Card>
    )
  }

  if (components.length === 0) {
    return (
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardBody className="py-6 text-center">
          <p className="text-sm text-gray-400">
            No friends-only components yet. Follow some users and have them follow you back to see their friends-only components!
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Friends' Components</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {components.map((component) => {
          const ownerName = getOwnerName(component)
          return (
            <article
              key={component._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <h4 className="truncate text-base font-semibold text-white">
                {component.title}
              </h4>
              <p className="mt-1 text-xs text-gray-400">
                By{' '}
                <Link
                  to={`/u/${ownerName}`}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {ownerName}
                </Link>
              </p>
              {component.description && (
                <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                  {component.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-blue-300">
                  {component.language}
                </span>
                <span className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-yellow-300">
                  Friends-only
                </span>
              </div>
              <Link
                to={`/components/${component._id}`}
                className="mt-4 inline-flex rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
              >
                View Component
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
