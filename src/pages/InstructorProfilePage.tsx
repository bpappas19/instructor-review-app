import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import Layout from '../components/Layout'
import RatingStars from '../components/RatingStars'
import CategoryBadge from '../components/CategoryBadge'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchInstructorProfile,
  fetchInstructorReviews,
  calculateAverageRating,
  InstructorProfile,
  Review,
} from '../services/instructorService'

const InstructorProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
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
      console.log('Loaded instructor profile:', profileData)
      console.log('Favorite products:', profileData?.favorite_products)
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
  const reviewCount = reviews.length
  
  // Placeholder values for review-derived metrics
  const musicVibe = 8.7 // Placeholder - will be calculated from reviews
  const difficulty = 6.3 // Placeholder - will be calculated from reviews


  return (
    <>
      <style>{`
        .instructor-profile-layout > div:first-child {
          background-color: transparent !important;
        }
        .instructor-profile-layout.dark > div:first-child {
          background-color: transparent !important;
        }
      `}</style>
      <div className="min-h-screen w-full fixed inset-0 bg-[#F4F6FB] dark:bg-gray-900 -z-10"></div>
      <div className="relative instructor-profile-layout">
        <Layout>
          <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/instructors" className="text-primary hover:text-blue-600 transition-colors text-sm mb-8 inline-block">
            ← Back to Directory
          </Link>

          {/* Hero Section - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-12">
            {/* LEFT COLUMN - Large Image */}
            {instructor.image_url && (
              <img
                src={instructor.image_url}
                alt={instructor.name || 'Instructor'}
                className="w-full aspect-square rounded-lg object-cover"
              />
            )}

            {/* RIGHT COLUMN - Name, Specialty, Metrics, About, Categories */}
            <div className="flex flex-col">
              {/* Name and Button Row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-text-light-primary dark:text-text-dark-primary text-4xl font-bold mb-2">
                    {instructor.name || 'Instructor'}
                  </h1>
                  {(instructor.specialty || instructor.city || instructor.state) && (
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg">
                      {instructor.specialty}
                      {instructor.specialty && (instructor.city || instructor.state) && ' · '}
                      {(instructor.city || instructor.state) && (
                        <>
                          <span className="inline-block mr-1">📍</span>
                          {[instructor.city, instructor.state].filter(Boolean).join(', ')}
                        </>
                      )}
                    </p>
                  )}
                </div>
                {user ? (
                  <Link
                    to={`/write-review/${id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap h-fit"
                  >
                    <span className="material-symbols-outlined text-[18px]">rate_review</span>
                    <span>Write a Review</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap h-fit"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>Sign in to write a review</span>
                  </Link>
                )}
              </div>

              {/* Metrics Row */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                {/* Rating Metric */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-amber-700 dark:text-amber-300 text-lg">star</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary leading-none">
                      {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5">
                      {averageRating > 0 ? `(${reviewCount})` : 'No reviews'}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-12 w-px bg-border-light dark:bg-border-dark"></div>

                {/* Music Metric */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-indigo-700 dark:text-indigo-300 text-lg">music_note</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary leading-none">
                      {musicVibe.toFixed(1)}
                    </div>
                    <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5">
                      Music
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-12 w-px bg-border-light dark:bg-border-dark"></div>

                {/* Difficulty Metric */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-orange-700 dark:text-orange-300 text-lg">local_fire_department</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary leading-none">
                      {difficulty.toFixed(1)}
                    </div>
                    <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5">
                      Difficulty
                    </div>
                  </div>
                </div>
              </div>

              {/* About Text - Directly under metrics */}
              {instructor.bio && (
                <div className="mb-6">
                  <p className="text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">
                    {instructor.bio}
                  </p>
                </div>
              )}

              {/* Category Pills - Under About */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CategoryBadge key={category} category={category} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gear and Music Row - Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Products I Love Section - Left */}
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-light-primary dark:text-text-dark-primary text-xl font-bold">
                  Products I Love
                </h2>
              </div>
              {instructor.favorite_products && instructor.favorite_products.length > 0 ? (
                <div className="space-y-4">
                  {instructor.favorite_products.map((product, index) => (
                    <div key={index} className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="font-bold text-text-light-primary dark:text-text-dark-primary group-hover:text-primary transition-colors mb-1">
                        {product.product_name}
                      </div>
                      <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-2">
                        {product.brand}
                      </div>
                      {product.purchase_url && (
                        <a 
                          href={product.purchase_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-blue-600 font-medium inline-block"
                        >
                          Shop
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    No products added yet
                  </p>
                </div>
              )}
            </div>

            {/* Music Section - Right */}
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-light-primary dark:text-text-dark-primary text-xl font-bold">
                  Workout Playlist
                </h2>
                {instructor.spotify_playlist_url ? (
                  <a 
                    href={instructor.spotify_playlist_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-blue-600 transition-colors"
                  >
                    Listen on Spotify
                  </a>
                ) : (
                  <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    No playlist
                  </span>
                )}
              </div>
              {instructor.featured_tracks && instructor.featured_tracks.length > 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
                  <div className="space-y-4">
                    {instructor.featured_tracks.map((track, index) => (
                      <div key={index} className="flex items-center justify-between py-2 hover:bg-white dark:hover:bg-gray-700/30 rounded px-2 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">play_circle</span>
                          <div>
                            <div className="font-medium text-text-light-primary dark:text-text-dark-primary">
                              {track.song_title || 'Untitled'}
                            </div>
                            <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                              {track.artist || 'Unknown Artist'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : instructor.spotify_playlist_url ? (
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 text-center py-8">
                  <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    Click "Listen on Spotify" to view the full playlist
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center py-8">
                  <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
                    No playlist available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section - Two Column Grid */}
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-light-primary dark:text-text-dark-primary text-xl font-bold">
                Reviews {reviewCount > 0 ? `(${reviewCount})` : ''}
              </h2>
              <select className="text-sm border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary">
                <option>Sort by: Most Recent</option>
                <option>Sort by: Highest Rated</option>
                <option>Sort by: Lowest Rated</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => {
                let reviewDate = 'just now'
                if (review.created_at) {
                  const formatted = formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
                  // If the date is in the future (starts with "in"), replace with "just now"
                  reviewDate = formatted.startsWith('in') ? 'just now' : formatted
                }
                const reviewerName = review.profiles?.email?.split('@')[0] || 'Anonymous Reviewer'

                return (
                  <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text-light-primary dark:text-text-dark-primary text-sm">
                          {reviewerName}
                        </span>
                        <span className="text-text-light-secondary dark:text-text-dark-secondary">·</span>
                        <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                          {reviewDate}
                        </span>
                      </div>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm leading-relaxed">
                      {review.body}
                    </p>
                  </div>
                )
              })}
            </div>
            {reviews.length === 0 && (
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-center py-8">No reviews yet.</p>
            )}
            {reviews.length > 0 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
        </Layout>
      </div>
    </>
  )
}

export default InstructorProfilePage
