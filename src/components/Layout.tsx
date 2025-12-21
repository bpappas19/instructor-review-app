import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { user, profile, signOut, loading } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light-primary dark:text-text-dark-primary">
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-10 py-3">
                <Link to="/" className="text-primary font-bold text-5xl tracking-tight -ml-4">
                  Flex
                </Link>
                <div className="flex items-center gap-4">
                  {loading && !user ? (
                    <div className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Loading...</div>
                  ) : (
                    <>
                      {/* Text links - always visible */}
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Blog clicked')
                        }}
                        className="text-sm text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:underline transition-colors"
                      >
                        Blog
                      </Link>
                      {/* Write a review - only on home page */}
                      {isHomePage && (
                        <Link
                          to="/instructors"
                          className="text-sm text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:underline transition-colors"
                        >
                          Write a review
                        </Link>
                      )}
                      
                      {/* Right-aligned account action */}
                      {user ? (
                        /* User email with dropdown */
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-0.5 text-sm text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                            aria-label="User menu"
                          >
                            <span>{profile?.email || user.email}</span>
                            <span className="text-xs opacity-60">▾</span>
                          </button>
                          {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark overflow-hidden z-50">
                              <div className="py-1">
                                {profile?.role === 'instructor' && (
                                  <Link
                                    to="/admin"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                                  >
                                    Edit Profile
                                  </Link>
                                )}
                                {profile?.role === 'user' && (
                                  <Link
                                    to="/instructor/onboarding"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                                  >
                                    For instructors
                                  </Link>
                                )}
                                <button
                                  onClick={async () => {
                                    setDropdownOpen(false)
                                    await signOut()
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                                >
                                  Log out
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Log in text link */
                        <Link
                          to="/login"
                          className="text-sm text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary hover:underline transition-colors"
                        >
                          Log in
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </header>
              <main className="flex-grow">{children}</main>
              <footer className="mt-10 border-t border-solid border-border-light dark:border-border-dark px-10 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-text-light-secondary dark:text-text-dark-secondary">
                    <p className="text-sm">© 2024 Flex. All rights reserved.</p>
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

