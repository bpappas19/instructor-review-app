import { supabase } from './supabase'

export interface InstructorProfile {
  id: string
  name?: string
  bio?: string
  categories?: string[]
  image_url?: string
  specialty?: string
}

export interface Review {
  id: string
  instructor_id: string
  reviewer_id: string
  rating: number
  body: string
  created_at?: string
  profiles?: {
    email: string
  }
}

export const fetchInstructorProfile = async (instructorId: string): Promise<InstructorProfile | null> => {
  try {
    // Public query - no auth required
    const { data, error } = await supabase
      .from('instructor_profiles')
      .select('*')
      .eq('id', instructorId)
      .single()

    if (error) {
      console.error('Error fetching instructor profile:', error)
      // Don't throw - return null for graceful handling
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching instructor profile:', error)
    return null
  }
}

export const fetchInstructorReviews = async (instructorId: string): Promise<Review[]> => {
  try {
    // Public query - no auth required
    // Try to fetch with profile email, but fallback to basic review data if RLS blocks profile access
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        instructor_id,
        reviewer_id,
        rating,
        body,
        created_at
      `)
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    // Map the data to Review format (email will be null/undefined for public users)
    const reviews: Review[] = (data || []).map((review) => ({
      id: review.id,
      instructor_id: review.instructor_id,
      reviewer_id: review.reviewer_id,
      rating: review.rating,
      body: review.body,
      created_at: review.created_at,
      profiles: undefined, // Don't expose reviewer email to public
    }))

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export const calculateAverageRating = (reviews: Review[] | { rating: number }[]): number => {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export const fetchAllInstructors = async (): Promise<InstructorProfile[]> => {
  try {
    // Public query - no auth required
    const { data, error } = await supabase
      .from('instructor_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching instructors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching instructors:', error)
    return []
  }
}

export interface InstructorWithRating extends InstructorProfile {
  rating: number
  reviewCount: number
  imageUrl: string
}

export const fetchInstructorsWithRatings = async (): Promise<InstructorWithRating[]> => {
  try {
    // Public query - no auth required
    const instructors = await fetchAllInstructors()
    
    // Fetch all reviews to calculate ratings (public query)
    const { data: allReviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('instructor_id, rating')

    if (reviewsError) {
      console.error('Error fetching reviews for ratings:', reviewsError)
      // Continue with empty reviews array - don't fail the whole operation
    }

    // Calculate ratings and review counts for each instructor
    const instructorsWithRatings: InstructorWithRating[] = instructors.map((instructor) => {
      const instructorReviews = (allReviews || []).filter(
        (review) => review.instructor_id === instructor.id
      )
      const rating = calculateAverageRating(instructorReviews as Review[])
      const reviewCount = instructorReviews.length

      return {
        ...instructor,
        rating: rating || 0,
        reviewCount,
        imageUrl: instructor.image_url || '',
        categories: instructor.categories || [],
      }
    })

    return instructorsWithRatings
  } catch (error) {
    console.error('Error fetching instructors with ratings:', error)
    return []
  }
}

