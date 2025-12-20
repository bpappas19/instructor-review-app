import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

const InstructorOnboardingPage = () => {
  const { user, profile, becomeInstructor, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already an instructor or not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login')
      } else if (profile?.role === 'instructor') {
        navigate('/admin')
      }
    }
  }, [user, profile?.role, authLoading, navigate])

  const handleCreateProfile = async (e?: React.MouseEvent) => {
    console.log('[DEBUG] handleCreateProfile called', { e, user: user?.id })
    
    if (e) {
      e.preventDefault()
    }

    if (!user) {
      console.log('[DEBUG] No user, redirecting to login')
      navigate('/login')
      return
    }

    console.log('[DEBUG] User ID:', user.id)
    setError(null)
    setLoading(true)

    console.log('[DEBUG] Calling becomeInstructor...')
    const { error } = await becomeInstructor()

    console.log('[DEBUG] becomeInstructor result:', { error })

    if (error) {
      console.error('[DEBUG] Error from becomeInstructor:', error)
      const errorMessage = error.message || error.toString() || 'Failed to create instructor profile'
      console.error('[DEBUG] Setting error message:', errorMessage)
      setError(errorMessage)
      setLoading(false)
    } else {
      console.log('[DEBUG] Success! Redirecting to /admin')
      // Redirect to admin page after successful role change
      navigate('/admin')
    }
  }

  return (
    <Layout>
      <section className="my-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-8 sm:p-12 mb-10">
            <div className="text-center mb-8">
              <h1 className="text-text-light-primary dark:text-text-dark-primary text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
                Become an Instructor
              </h1>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg sm:text-xl max-w-2xl mx-auto">
                Share your expertise and connect with fitness enthusiasts looking for quality instruction.
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <ul className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-1">
                      Build Your Professional Profile
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                      Showcase your specialties, experience, and teaching style to attract the right students.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mt-0.5">star</span>
                  <div>
                    <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-1">
                      Get Discovered by Students
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                      Appear in search results and category listings where students are actively looking for instructors.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mt-0.5">rate_review</span>
                  <div>
                    <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-1">
                      Collect Reviews & Build Reputation
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                      Let your students share their experiences and help you grow your teaching practice.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={(e) => {
                  console.log('[DEBUG] Button clicked!')
                  e.preventDefault()
                  handleCreateProfile(e)
                }}
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">{loading ? 'Creating Profile...' : 'Create Instructor Profile'}</span>
              </button>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-8 sm:p-12">
            <h2 className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold leading-tight tracking-[-0.015em] mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
                </div>
                <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-2">
                  Create Your Profile
                </h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                  Set up your instructor profile with your bio, specialties, and profile photo.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">search</span>
                </div>
                <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-2">
                  Get Discovered
                </h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                  Students can find you through search, categories, and recommendations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
                </div>
                <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-base mb-2">
                  Grow Your Practice
                </h3>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                  Build your reputation through reviews and keep your profile updated.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-primary hover:text-blue-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorOnboardingPage

