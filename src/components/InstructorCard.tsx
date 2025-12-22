import { Link } from 'react-router-dom'
import RatingStars from './RatingStars'

interface InstructorCardProps {
  instructor: {
    id: string
    name: string
    specialty: string
    rating: number
    imageUrl: string
  }
}

const InstructorCard = ({ instructor }: InstructorCardProps) => {
  return (
    <Link
      to={`/instructors/${instructor.id}`}
      className="flex flex-col gap-4 md:gap-4 rounded-lg bg-white dark:bg-surface-dark p-5 md:p-4 shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow min-h-[44px]"
    >
      <img
        alt={`Portrait of ${instructor.name}`}
        className="aspect-square w-full rounded-lg object-cover"
        src={instructor.imageUrl}
      />
      <div className="flex flex-col gap-2 md:gap-1">
        <h3 className="text-text-light-primary dark:text-text-dark-primary font-bold text-lg">{instructor.name}</h3>
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">{instructor.specialty}</p>
        <div className="flex items-center gap-1 mt-1">
          <RatingStars rating={instructor.rating} />
          <span className="text-text-light-secondary dark:text-text-dark-secondary text-sm ml-1">{instructor.rating}</span>
        </div>
      </div>
    </Link>
  )
}

export default InstructorCard

