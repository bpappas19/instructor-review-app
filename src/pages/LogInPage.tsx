import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

const LogInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'Failed to sign in')
      setLoading(false)
    } else {
      // Navigate to home after successful login
      navigate('/')
    }
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError(null)
    setResetSuccess(false)
    setResetLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setResetLoading(false)

    if (error) {
      setResetError(error.message || 'Failed to send reset email')
    } else {
      setResetSuccess(true)
      setResetEmail('')
    }
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setResetEmail('')
    setResetError(null)
    setResetSuccess(false)
  }

  return (
    <Layout>
      <section className="my-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-text-light-primary dark:text-text-dark-primary text-[28px] font-bold leading-tight tracking-[-0.015em] text-center">
                {showForgotPassword ? 'Reset your password' : 'Sign in to your account'}
              </h2>
              {!showForgotPassword && (
                <p className="mt-2 text-center text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  Or{' '}
                  <Link to="/signup" className="font-medium text-primary hover:text-blue-600 transition-colors">
                    create a new account
                  </Link>
                </p>
              )}
            </div>
            {showForgotPassword ? (
              <>
                {resetSuccess ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-600 dark:text-green-400 text-center">
                        If an account exists for this email, a password reset link has been sent.
                      </p>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-sm text-primary hover:text-blue-600 transition-colors font-medium"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                        Email address
                      </label>
                      <input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={resetLoading}
                        className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {resetError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{resetError}</p>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resetLoading ? 'Sending...' : 'Send reset link'}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        disabled={resetLoading}
                        className="text-sm text-primary hover:text-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Password"
                  />
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-blue-600 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            )}
            {!showForgotPassword && (
              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-primary hover:text-blue-600 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default LogInPage
