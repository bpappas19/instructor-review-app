import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'instructor'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth()

  // While auth is loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-light-secondary dark:text-text-dark-secondary">Loading...</div>
      </div>
    )
  }

  // Once auth is resolved, check access
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // For instructor routes, check role
  // If profile is still loading (null) but user exists, wait a moment then redirect
  // This handles the case where profile fetch is slow
  if (requiredRole === 'instructor') {
    if (profile === null) {
      // Profile hasn't loaded yet - give it a moment, but don't wait forever
      // If user exists but profile is null after auth is resolved, likely not an instructor
      return <Navigate to="/" replace />
    }
    if (profile.role !== 'instructor') {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute

