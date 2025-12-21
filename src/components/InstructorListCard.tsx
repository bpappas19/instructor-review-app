import { Link } from 'react-router-dom'
import RatingStars from './RatingStars'
import CategoryBadge from './CategoryBadge'

interface InstructorListCardProps {
  instructor: {
    id: string
    name: string
    specialty: string
    rating: number
    imageUrl: string
    bio: string
    categories: string[]
    reviewCount?: number
  }
}

const InstructorListCard = ({ instructor }: InstructorListCardProps) => {
  // Truncate bio to 1-2 lines (approximately 120 characters)
  const bioPreview = instructor.bio.length > 120 
    ? instructor.bio.substring(0, 120).trim() + '...'
    : instructor.bio

  // Use actual review count, default to 0 if not provided
  const reviewCount = instructor.reviewCount ?? 0

  return (
    <Link
      to={`/instructors/${instructor.id}`}
      className="flex gap-4 rounded-lg bg-white dark:bg-surface-dark p-4 shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow"
    >
      {/* Photo on left */}
      <img
        alt={`Portrait of ${instructor.name}`}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0"
        src={instructor.imageUrl}
      />
      
      {/* Content on right */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Name and Specialty */}
        <div>
          <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-lg mb-1">
            {instructor.name}
          </h3>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
            {instructor.specialty}
          </p>
        </div>

        {/* Rating and Review Count */}
        <div className="flex items-center gap-2">
          <RatingStars rating={instructor.rating} size="sm" />
          <span className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium">
            {instructor.rating}
          </span>
          <span className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
            {reviewCount === 0 ? '(No reviews)' : `(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`}
          </span>
        </div>

        {/* Bio Preview */}
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm leading-relaxed">
          {bioPreview}
        </p>

        {/* Categories as pills */}
        <div className="flex flex-wrap gap-2 mt-1">
          {instructor.categories.map((category) => (
            <CategoryBadge key={category} category={category} variant="card" />
          ))}
        </div>
      </div>
    </Link>
  )
}

export default InstructorListCard

