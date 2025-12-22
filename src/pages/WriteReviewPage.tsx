import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { fetchInstructorProfile, fetchUserReview, upsertReview, UserReview } from '../services/instructorService'

const WriteReviewPage = () => {
  const { instructorId } = useParams<{ instructorId: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [instructorName, setInstructorName] = useState('')
  
  const [rating, setRating] = useState(5)
  const [musicScore, setMusicScore] = useState(5)
  const [difficultyScore, setDifficultyScore] = useState(5)
  const [body, setBody] = useState('')
  const [existingReviewId, setExistingReviewId] = useState<string | undefined>()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      navigate('/login')
      return
    }

    const loadData = async () => {
      if (!instructorId || !user) return

      setLoading(true)
      
      // Fetch instructor name for display
      const instructor = await fetchInstructorProfile(instructorId)
      if (instructor) {
        setInstructorName(instructor.name || 'Instructor')
      }

      // Fetch existing review if it exists
      const existingReview = await fetchUserReview(instructorId, user.id)
      if (existingReview) {
        setRating(existingReview.rating || 5)
        setMusicScore(existingReview.music_score || 5)
        setDifficultyScore(existingReview.difficulty_score || 5)
        setBody(existingReview.body || '')
        setExistingReviewId(existingReview.id)
      }

      setLoading(false)
    }

    loadData()
  }, [instructorId, user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !instructorId) return

    setSubmitting(true)

    const review: UserReview = {
      id: existingReviewId,
      instructor_id: instructorId,
      reviewer_id: user.id,
      rating,
      body: body.trim(),
      music_score: musicScore,
      difficulty_score: difficultyScore,
    }

    const { error } = await upsertReview(review)

    setSubmitting(false)

    if (error) {
      alert('Error saving review. Please try again.')
      console.error('Error saving review:', error)
      return
    }

    // Navigate back to instructor profile
    navigate(`/instructors/${instructorId}`)
  }

  if (authLoading || loading) {
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
        <div className="max-w-2xl mx-auto">
          <Link
            to={`/instructors/${instructorId}`}
            className="text-primary hover:text-blue-600 transition-colors text-sm mb-8 inline-block"
          >
            ← Back to {instructorName}
          </Link>

          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold mb-2">
              Write a Review
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-8">
              Share your experience with {instructorName}
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div>
                <label className="block text-text-light-primary dark:text-text-dark-primary font-medium mb-3">
                  Overall Rating
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <span
                          className={`material-symbols-outlined text-4xl ${
                            star <= rating
                              ? 'text-primary'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          style={
                            star <= rating
                              ? { fontVariationSettings: "'FILL' 1" }
                              : undefined
                          }
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-text-light-primary dark:text-text-dark-primary font-medium text-lg">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Music Score Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-text-light-primary dark:text-text-dark-primary font-medium">
                    Music Vibe
                  </label>
                  <span className="text-primary font-bold text-xl">
                    {musicScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={musicScore}
                  onChange={(e) => setMusicScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((musicScore - 1) / 9) * 100}%, #e5e7eb ${((musicScore - 1) / 9) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Difficulty Score Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-text-light-primary dark:text-text-dark-primary font-medium">
                    Difficulty Level
                  </label>
                  <span className="text-primary font-bold text-xl">
                    {difficultyScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={difficultyScore}
                  onChange={(e) => setDifficultyScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((difficultyScore - 1) / 9) * 100}%, #e5e7eb ${((difficultyScore - 1) / 9) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="body"
                  className="block text-text-light-primary dark:text-text-dark-primary font-medium mb-3"
                >
                  Your Review (Optional)
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Share your thoughts about this instructor..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : existingReviewId ? 'Update Review' : 'Submit Review'}
                </button>
                <Link
                  to={`/instructors/${instructorId}`}
                  className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default WriteReviewPage

