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
        <section className="my-10 px-4">
          <div className="text-center py-12">
            <div className="text-text-light-secondary dark:text-text-dark-secondary">Loading...</div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="my-10 px-4">
        <Link to="/" className="text-primary hover:text-blue-600 transition-colors text-sm mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8 max-w-4xl mx-auto">
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-[28px] font-bold leading-tight tracking-[-0.015em] mb-8">
            Instructor Admin Dashboard
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

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
                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., Yoga Teacher, HIIT Specialist"
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Profile Image URL
              </label>
              <div className="flex items-center gap-4">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                )}
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL (file upload coming soon)"
                  className="flex-1 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Specialties / Categories
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
                        : 'bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary border-border-light dark:border-border-dark hover:border-primary'
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

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t border-border-light dark:border-border-dark">
              <button
                type="button"
                onClick={() => {
                  setBio('')
                  setSelectedCategories([])
                  setImageUrl('')
                  setName('')
                  setSpecialty('')
                }}
                className="px-6 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-text-light-primary dark:text-text-dark-primary bg-white dark:bg-surface-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorAdminPage
