interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
}

const RatingStars = ({ rating, maxRating = 5, size = 'md' }: RatingStarsProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClasses = {
    sm: '!text-[16px]',
    md: '!text-[18px]',
    lg: '!text-[24px]',
  }

  return (
    <div className="flex items-center gap-1 text-primary">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className={`material-symbols-outlined ${sizeClasses[size]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
      {hasHalfStar && (
        <span className={`material-symbols-outlined ${sizeClasses[size]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          star_half
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className={`material-symbols-outlined ${sizeClasses[size]}`}>
          star
        </span>
      ))}
    </div>
  )
}

export default RatingStars

