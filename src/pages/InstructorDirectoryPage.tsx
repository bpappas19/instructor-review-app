import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import InstructorListCard from '../components/InstructorListCard'
import { categories } from '../data/mockData'
import { fetchInstructorsWithRatings, InstructorWithRating } from '../services/instructorService'

const InstructorDirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [minRating, setMinRating] = useState<number>(0)
  const [instructors, setInstructors] = useState<InstructorWithRating[]>([])
  const [loading, setLoading] = useState(true)
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    const loadInstructors = async () => {
      setLoading(true)
      const data = await fetchInstructorsWithRatings()
      setInstructors(data)
      setLoading(false)
    }

    loadInstructors()
  }, [])

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesCategory = !selectedCategory || (instructor.categories || []).includes(selectedCategory)
    const matchesRating = instructor.rating >= minRating
    const matchesSearch = !searchQuery || 
      (instructor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instructor.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instructor.categories || []).some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesRating && matchesSearch
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const newParams = new URLSearchParams(searchParams)
    if (category) {
      newParams.set('category', category)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  return (
    <Layout>
      <section className="my-10">
        <div className="px-4 pb-4">
          <Link to="/" className="text-primary hover:text-blue-600 transition-colors text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-[28px] font-bold leading-tight tracking-[-0.015em]">Instructor Directory</h1>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="px-4 mb-4">
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
              Search results for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span>Rating</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Category</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span>Location</span>
            </button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-6 px-4">
          {/* Main Content Area */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-text-light-secondary dark:text-text-dark-secondary">
                Loading instructors...
              </div>
            ) : (
              <>
                {/* Instructor List */}
                <div className="space-y-4">
                  {filteredInstructors.map((instructor) => (
                    <InstructorListCard
                      key={instructor.id}
                      instructor={{
                        id: instructor.id,
                        name: instructor.name || 'Instructor',
                        specialty: instructor.specialty || '',
                        rating: instructor.rating,
                        imageUrl: instructor.imageUrl,
                        bio: instructor.bio || '',
                        categories: instructor.categories || [],
                        reviewCount: instructor.reviewCount,
                      }}
                    />
                  ))}
                </div>

                {filteredInstructors.length === 0 && (
                  <div className="text-center py-12 text-text-light-secondary dark:text-text-dark-secondary">
                    No instructors found matching your filters.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Categories */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark p-4 sticky top-0">
              <h2 className="text-text-light-primary dark:text-text-dark-primary text-sm font-bold mb-3">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary text-white'
                        : 'text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${
                      selectedCategory === category.name
                        ? 'text-white'
                        : 'text-text-light-secondary dark:text-text-dark-secondary'
                    }`} style={category.name === 'Strength' ? { fontVariationSettings: "'wght' 600" } : {}}>
                      {category.icon}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}

export default InstructorDirectoryPage
