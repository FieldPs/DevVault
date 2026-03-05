import { Plus } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import StatsStrip from '@/components/dashboard/StatsStrip'
import ComponentEmptyState from '@/components/dashboard/ComponentEmptyState'

export default function DashboardPage() {
  return (
    <div className="page-bg min-h-screen">

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
            disabled
            className="gradient-btn flex cursor-not-allowed items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white opacity-50"
            title="Coming soon"
          >
            <Plus className="h-4 w-4" />
            New Component
          </button>
        </div>

        <StatsStrip total={0} components={0} favorites={0} />
        <ComponentEmptyState />
      </main>
    </div>
  )
}
