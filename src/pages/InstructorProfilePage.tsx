import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import RatingStars from '../components/RatingStars'
import CategoryBadge from '../components/CategoryBadge'
import {
  fetchInstructorProfile,
  fetchInstructorReviews,
  calculateAverageRating,
  InstructorProfile,
  Review,
} from '../services/instructorService'

const InstructorProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const [profileData, reviewsData] = await Promise.all([
        fetchInstructorProfile(id),
        fetchInstructorReviews(id),
      ])

      setInstructor(profileData)
      setReviews(reviewsData)
      setLoading(false)
    }

    loadData()
  }, [id])

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

  if (!instructor) {
    return (
      <Layout>
        <section className="my-10 px-4">
          <div className="text-center py-12">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold mb-4">Instructor not found</h1>
            <Link to="/instructors" className="text-primary hover:text-blue-600 transition-colors">
              ← Back to Directory
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  const averageRating = calculateAverageRating(reviews)
  const categories = instructor.categories || []

  return (
    <Layout>
      <section className="my-10 px-4">
        <Link to="/instructors" className="text-primary hover:text-blue-600 transition-colors text-sm mb-4 inline-block">
          ← Back to Directory
        </Link>

        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {instructor.image_url && (
                <img
                  src={instructor.image_url}
                  alt={instructor.name || 'Instructor'}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-bold mb-2">
                      {instructor.name || 'Instructor'}
                    </h1>
                    {instructor.specialty && (
                      <p className="text-text-light-secondary dark:text-text-dark-secondary text-base mb-3">
                        {instructor.specialty}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">rate_review</span>
                    <span>Write a Review</span>
                  </Link>
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <RatingStars rating={averageRating} size="lg" />
                    <span className="text-text-light-secondary dark:text-text-dark-secondary text-lg">
                      {averageRating}
                    </span>
                    <span className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <CategoryBadge key={category} category={category} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {instructor.bio && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-border-light dark:border-border-dark">
              <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4 mt-6">About</h2>
              <p className="text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">{instructor.bio}</p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-border-light dark:border-border-dark">
            <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6 mt-6">Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => {
                const reviewDate = review.created_at
                  ? new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''

                return (
                  <div key={review.id} className="border-b border-border-light dark:border-border-dark pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                          {review.profiles?.email || 'Anonymous'}
                        </span>
                        <RatingStars rating={review.rating} />
                      </div>
                      {reviewDate && (
                        <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          {reviewDate}
                        </span>
                      )}
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary">{review.body}</p>
                  </div>
                )
              })}
            </div>
            {reviews.length === 0 && (
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-center py-8">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorProfilePage
