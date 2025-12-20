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
                <Link to="/" className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M8 20L16 12L24 20" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8L13.5 12L18 12L14.5 14.5L16 18L12 15.5L8 18L9.5 14.5L6 12L10.5 12L12 8Z" fill="#3b82f6"/>
                  </svg>
                  <span className="text-text-light-primary dark:text-text-dark-primary font-bold text-lg">RateUp</span>
                </Link>
                <div className="flex items-center gap-1.5">
                  {loading && !user ? (
                    <div className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Loading...</div>
                  ) : user ? (
                    <>
                      {profile?.role === 'instructor' && (
                        <Link
                          to="/admin"
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="truncate">Edit Profile</span>
                        </Link>
                      )}
                      {profile?.role === 'user' && (
                        <Link
                          to="/instructor/onboarding"
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-3 bg-primary text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
                        >
                          <span className="truncate">For Instructors</span>
                        </Link>
                      )}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="flex items-center gap-0.5 text-[11px] text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary transition-colors"
                          aria-label="User menu"
                        >
                          <span>{profile?.email || user.email}</span>
                          <span className="text-[9px] opacity-60">▾</span>
                        </button>
                        {dropdownOpen && (
                          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark overflow-hidden z-50">
                            <div className="py-1">
                              <button
                                onClick={async () => {
                                  setDropdownOpen(false)
                                  await signOut()
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                              >
                                Log Out
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
                    <p className="text-sm">© 2024 RateUp. All rights reserved.</p>
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

