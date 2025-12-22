import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InstructorDirectoryPage from './pages/InstructorDirectoryPage'
import InstructorProfilePage from './pages/InstructorProfilePage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import InstructorAdminPage from './pages/InstructorAdminPage'
import InstructorOnboardingPage from './pages/InstructorOnboardingPage'
import WriteReviewPage from './pages/WriteReviewPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/instructors" element={<InstructorDirectoryPage />} />
        <Route path="/instructors/:id" element={<InstructorProfilePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/instructor/onboarding" element={<InstructorOnboardingPage />} />
        <Route
          path="/write-review/:instructorId"
          element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="instructor">
              <InstructorAdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

