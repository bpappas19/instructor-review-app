import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import InstructorCard from '../components/InstructorCard'
import { categories } from '../data/mockData'
import { fetchInstructorsWithRatings, InstructorWithRating } from '../services/instructorService'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [instructors, setInstructors] = useState<InstructorWithRating[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadInstructors = async () => {
      setLoading(true)
      const data = await fetchInstructorsWithRatings()
      // Sort by rating descending and take top 4
      const sorted = data.sort((a, b) => b.rating - a.rating).slice(0, 4)
      setInstructors(sorted)
      setLoading(false)
    }

    loadInstructors()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/instructors?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/instructors')
    }
  }

  // Category-specific icon colors (muted, tasteful)
  const getCategoryIconColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Yoga': 'text-teal-500 dark:text-teal-300',
      'HIIT': 'text-pink-500 dark:text-pink-400',
      'Pilates': 'text-amber-500 dark:text-amber-400',
      'Cycling': 'text-indigo-500 dark:text-indigo-400',
      'Strength': 'text-orange-500 dark:text-orange-400',
      'Dance': 'text-blue-500 dark:text-blue-400',
      'Boxing': 'text-red-500 dark:text-red-400',
    }
    return colors[categoryName] || 'text-text-light-secondary dark:text-text-dark-secondary'
  }

  return (
    <>
      <style>{`
        .homepage-layout > div:first-child {
          background-color: transparent !important;
        }
        .homepage-layout.dark > div:first-child {
          background-color: transparent !important;
        }
      `}</style>
      <div className="min-h-screen w-full fixed inset-0 bg-[#F4F6FB] dark:bg-gray-900 -z-10"></div>
      <div className="relative homepage-layout">
        <Layout>
          <section className="my-10 @container">
        <div className="@[480px]:p-4">
          <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4" data-alt="Person doing a high-energy workout pose" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.9) 100%), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop")' }}>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                Find Your Perfect Instructor
              </h1>
              <h2 className="text-white/80 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                Search reviews for thousands of fitness instructors and classes.
              </h2>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-lg">
                <div className="text-white/70 flex border border-white/20 bg-black/40 items-center justify-center pl-[15px] rounded-l-lg border-r-0 backdrop-blur-sm">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-white/20 bg-black/40 focus:border-primary h-full placeholder:text-white/70 px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal backdrop-blur-sm"
                  placeholder="Search by instructor, studio, or workout type"
                />
                <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-white/20 bg-black/40 pr-[7px] backdrop-blur-sm">
                  <button
                    type="submit"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-blue-600 transition-colors"
                  >
                    <span className="truncate">Search</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 px-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/instructors?category=${category.name}`}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-surface-light dark:bg-surface-dark hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-transparent hover:border-border-light dark:hover:border-border-dark cursor-pointer group"
            >
              <span className={`material-symbols-outlined ${getCategoryIconColor(category.name)} group-hover:opacity-80 transition-colors text-3xl`} style={category.name === 'Strength' ? { fontVariationSettings: "'wght' 600" } : {}}>
                {category.icon}
              </span>
              <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium text-center">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-10">
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular Instructors</h2>
        {loading ? (
          <div className="text-center py-12 text-text-light-secondary dark:text-text-dark-secondary px-4">
            Loading instructors...
          </div>
        ) : instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {instructors.map((instructor) => (
              <InstructorCard
                key={instructor.id}
                instructor={{
                  id: instructor.id,
                  name: instructor.name || 'Instructor',
                  specialty: instructor.specialty || '',
                  rating: instructor.rating,
                  imageUrl: instructor.imageUrl,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-light-secondary dark:text-text-dark-secondary px-4">
            No instructors found. Be the first to become an instructor!
          </div>
        )}
      </section>
        </Layout>
      </div>
    </>
  )
}

export default HomePage
