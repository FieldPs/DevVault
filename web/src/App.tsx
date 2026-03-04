import { Routes, Route } from 'react-router-dom'
import { Button } from '@heroui/react'

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-4">
      <h1 className="text-4xl font-bold">🗄️ DevVault</h1>
      <p className="text-gray-400">The Developer's Second Brain</p>
      <Button color="primary">Get Started</Button>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}
