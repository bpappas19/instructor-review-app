import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CategoryBadge from '../components/CategoryBadge'
import { categories } from '../data/mockData'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { fetchInstructorProfile, InstructorProfile } from '../services/instructorService'

const InstructorAdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bio, setBio] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      setLoading(true)
      const profile = await fetchInstructorProfile(user.id)

      if (profile) {
        setBio(profile.bio || '')
        setSelectedCategories(profile.categories || [])
        setImageUrl(profile.image_url || '')
        setName(profile.name || '')
        setSpecialty(profile.specialty || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [user, navigate])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError(null)
    setSaving(true)

    try {
      // Upsert instructor profile
      const { error: upsertError } = await supabase
        .from('instructor_profiles')
        .upsert({
          id: user.id,
          name: name || null,
          bio: bio || null,
          categories: selectedCategories.length > 0 ? selectedCategories : null,
          image_url: imageUrl || null,
          specialty: specialty || null,
        })

      if (upsertError) {
        throw upsertError
      }

      // Show success and refresh
      alert('Profile saved successfully!')
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
          <div className="text-center py-12">
            <div className="text-text-light-secondary dark:text-text-dark-secondary">Loading...</div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:text-blue-600 transition-colors text-sm mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md border border-gray-200 dark:border-border-dark p-6 sm:p-8">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-[28px] font-bold leading-tight tracking-[-0.015em] mb-8">
              Instructor Admin Dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Basic Info Section */}
            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Basic Info
              </h2>
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Specialty */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Specialty
                </label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  placeholder="e.g., Yoga Teacher, HIIT Specialist"
                />
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Profile Image
              </h2>
              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Profile Image URL
                </label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL (file upload coming soon)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Bio
              </h2>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Tell us about yourself
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Specialties / Categories
              </h2>
              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                  Select your specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                        selectedCategories.includes(category.name)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <CategoryBadge key={category} category={category} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setBio('')
                  setSelectedCategories([])
                  setImageUrl('')
                  setName('')
                  setSpecialty('')
                }}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-text-light-primary dark:text-text-dark-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorAdminPage
