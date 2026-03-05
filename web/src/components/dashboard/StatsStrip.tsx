import { FileCode2, Component, Star } from 'lucide-react'

interface Props {
  total: number
  components: number
  favorites: number
}

export default function StatsStrip({ total, components, favorites }: Props) {
  const stats = [
    { label: 'Total Components', value: String(total),    icon: <FileCode2 className="w-5 h-5 text-blue-400" /> },
    { label: 'React Components', value: String(components), icon: <Component className="w-5 h-5 text-purple-400" /> },
    { label: 'Favorites',        value: String(favorites), icon: <Star className="w-5 h-5 text-yellow-400" /> },
  ]

  return (
    <div className="animate-fade-in-up-delay mb-8 grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
