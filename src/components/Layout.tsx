import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { user, profile, signOut, becomeInstructor, loading } = useAuth()

  const handleBecomeInstructor = async () => {
    const { error } = await becomeInstructor()
    if (error) {
      alert('Failed to become instructor: ' + (error.message || 'Unknown error'))
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light-primary dark:text-text-dark-primary">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-10 py-3">
                <Link to="/" className="text-text-light-primary dark:text-text-dark-primary font-bold text-lg">
                  FitFinder
                </Link>
                <div className="flex gap-2">
                  {loading ? (
                    <div className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Loading...</div>
                  ) : user ? (
                    <>
                      {profile?.role === 'instructor' && (
                        <Link
                          to="/admin"
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="truncate">Admin</span>
                        </Link>
                      )}
                      {profile?.role === 'user' && (
                        <button
                          onClick={handleBecomeInstructor}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="truncate">Become Instructor</span>
                        </button>
                      )}
                      <span className="flex items-center px-3 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        {profile?.email || user.email}
                      </span>
                      <button
                        onClick={signOut}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="truncate">Log Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {isHomePage ? (
                        <>
                          <Link
                            to="/signup"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
                          >
                            <span className="truncate">Sign Up</span>
                          </Link>
                          <Link
                            to="/login"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-bold leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="truncate">Log In</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/signup"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                          >
                            <span className="truncate">Sign Up</span>
                          </Link>
                          <Link
                            to="/login"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                          >
                            <span className="truncate">Log In</span>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </header>
              <main className="flex-grow">{children}</main>
              <footer className="mt-10 border-t border-solid border-border-light dark:border-border-dark px-10 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-text-light-secondary dark:text-text-dark-secondary">
                    <div className="size-4 text-primary">
                      <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <p className="text-sm">© 2024 FitFinder. All rights reserved.</p>
                  </div>
                  <div className="flex gap-6 text-text-light-secondary dark:text-text-dark-secondary">
                    <a className="text-sm hover:text-primary transition-colors" href="#">About Us</a>
                    <a className="text-sm hover:text-primary transition-colors" href="#">Contact</a>
                    <a className="text-sm hover:text-primary transition-colors" href="#">Privacy Policy</a>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout

