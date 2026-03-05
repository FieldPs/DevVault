import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ComponentFormPage from '@/pages/ComponentFormPage'

export default function App() {
  // Rehydrate auth state from the server once on mount (replaces AuthProvider useEffect)
  useEffect(() => {
    useAuthStore.getState().fetchMe()
  }, [])

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/components/new" element={<ComponentFormPage />} />
        <Route path="/components/:id/edit" element={<ComponentFormPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
