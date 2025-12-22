import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import InstructorListCard from '../components/InstructorListCard'
import { fetchInstructorsWithRatings, InstructorWithRating } from '../services/instructorService'

const InstructorDirectoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [instructors, setInstructors] = useState<InstructorWithRating[]>([])
  const [loading, setLoading] = useState(true)
  const searchQuery = searchParams.get('search') || ''
  const categoryFromUrl = searchParams.get('category') || ''
  
  // Filter states
  const [minRating, setMinRating] = useState<number>(0)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }

    if (categoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [categoryDropdownOpen])

  useEffect(() => {
    const loadInstructors = async () => {
      setLoading(true)
      const data = await fetchInstructorsWithRatings()
      setInstructors(data)
      setLoading(false)
    }

    loadInstructors()
  }, [])

  // Initialize category filter from URL params
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl])
    }
  }, [categoryFromUrl])

  // Extract available data-driven options
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>()
    instructors.forEach(instructor => {
      (instructor.categories || []).forEach(cat => categorySet.add(cat))
    })
    return Array.from(categorySet).sort()
  }, [instructors])

  const availableLocations = useMemo(() => {
    const locationMap = new Map<string, { city: string; state: string }>()
    instructors.forEach(instructor => {
      if (instructor.city || instructor.state) {
        const locationKey = `${instructor.city || ''}, ${instructor.state || ''}`.trim()
        if (locationKey && locationKey !== ',') {
          locationMap.set(locationKey, {
            city: instructor.city || '',
            state: instructor.state || '',
          })
        }
      }
    })
    return Array.from(locationMap.entries()).map(([key, value]) => ({ key, ...value })).sort((a, b) => {
      if (a.state !== b.state) return a.state.localeCompare(b.state)
      return a.city.localeCompare(b.city)
    })
  }, [instructors])

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      // Rating filter
    const matchesRating = instructor.rating >= minRating
      
      // Location filter
      const instructorLocation = `${instructor.city || ''}, ${instructor.state || ''}`.trim()
      const matchesLocation = !selectedLocation || instructorLocation === selectedLocation
      
      // Category filter (multi-select)
      const matchesCategory = selectedCategories.length === 0 || 
        (instructor.categories || []).some(cat => selectedCategories.includes(cat))
      
      // Search filter
    const matchesSearch = !searchQuery || 
      (instructor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instructor.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instructor.categories || []).some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesRating && matchesLocation && matchesCategory && matchesSearch
    })
  }, [instructors, minRating, selectedLocation, selectedCategories, searchQuery])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleClearFilters = () => {
    setMinRating(0)
    setSelectedLocation('')
    setSelectedCategories([])
    setCategoryDropdownOpen(false)
    setMobileFiltersOpen(false)
    // Clear category from URL if present
    if (categoryFromUrl) {
    const newParams = new URLSearchParams(searchParams)
      newParams.delete('category')
      setSearchParams(newParams, { replace: true })
    }
  }

  const hasActiveFilters = minRating > 0 || selectedLocation !== '' || selectedCategories.length > 0

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 3.0, label: '3.0+' },
    { value: 3.5, label: '3.5+' },
    { value: 4.0, label: '4.0+' },
    { value: 4.5, label: '4.5+' },
  ]

  return (
    <>
      <style>{`
        .directory-layout > div:first-child {
          background-color: transparent !important;
        }
        .directory-layout.dark > div:first-child {
          background-color: transparent !important;
        }
      `}</style>
      <div className="min-h-screen w-full fixed inset-0 bg-[#F4F6FB] dark:bg-gray-900 -z-10"></div>
      <div className="relative directory-layout">
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

            {/* Mobile Filters Button */}
            <div className="px-4 mb-6 md:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors w-full h-[44px] ${
                  hasActiveFilters
                    ? 'bg-primary text-white border-primary hover:bg-blue-600'
                    : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1">({selectedCategories.length + (minRating > 0 ? 1 : 0) + (selectedLocation ? 1 : 0)})</span>
                )}
              </button>
            </div>

            {/* Mobile Filters Modal/Sheet */}
            {mobileFiltersOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                {/* Modal Content */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark rounded-t-2xl shadow-2xl z-50 md:hidden max-h-[85vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">Filters</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 rounded-full hover:bg-surface-light dark:hover:bg-slate-700 transition-colors"
                      aria-label="Close filters"
                    >
                      <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">close</span>
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-6">
                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                        Rating
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm"
                        aria-label="Rating filter"
                      >
                        {ratingOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    {availableCategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                          Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableCategories.map(category => {
                            const isSelected = selectedCategories.includes(category)
                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors min-h-[44px] ${
                                  isSelected
                                    ? 'bg-primary text-white border-primary hover:bg-blue-600'
                                    : 'bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700'
                                }`}
                              >
                                {category}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                        Location
                      </label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        disabled={availableLocations.length === 0}
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Location filter"
                      >
                        <option value="">All Locations</option>
                        {availableLocations.map(location => (
                          <option key={location.key} value={location.key}>
                            {location.key}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium min-h-[44px]"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        <span>Clear filters</span>
                      </button>
                    )}

                    {/* Apply Button */}
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full px-4 py-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors min-h-[44px]"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Desktop Filter Pills */}
            <div className="hidden md:block px-4 mb-6">
              <div className="flex gap-3 flex-wrap">
                {/* Rating Filter Pill */}
                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">star</span>
                    <span>Rating</span>
                  </button>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Rating filter"
                  >
                    {ratingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter Pill with Dropdown */}
                {availableCategories.length > 0 && (
                  <div className="relative" ref={categoryDropdownRef}>
                    <button
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                        categoryDropdownOpen || selectedCategories.length > 0
                          ? 'bg-primary text-white border-primary hover:bg-blue-600'
                          : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700'
                      }`}
                    >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Category</span>
                      {selectedCategories.length > 0 && (
                        <span className="ml-1">({selectedCategories.length})</span>
                      )}
                    </button>
                    
                    {/* Category Dropdown */}
                    {categoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg p-3 z-50 min-w-[200px] max-w-[400px]">
                        <div className="flex flex-wrap gap-2">
                          {availableCategories.map(category => {
                            const isSelected = selectedCategories.includes(category)
                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                  isSelected
                                    ? 'bg-primary text-white border-primary hover:bg-blue-600'
                                    : 'bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-slate-700'
                                }`}
                              >
                                {category}
            </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Location Filter Pill - always shown */}
                <div className="relative">
                  <button 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      selectedLocation
                        ? 'bg-primary text-white border-primary hover:bg-blue-600'
                        : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700'
                    } ${availableLocations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={availableLocations.length === 0}
                  >
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Location</span>
                  </button>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    disabled={availableLocations.length === 0}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Location filter"
                  >
                    <option value="">All Locations</option>
                    {availableLocations.map(location => (
                      <option key={location.key} value={location.key}>
                        {location.key}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button - only show when filters are active */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-surface-light dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span>Clear filters</span>
                  </button>
                )}
          </div>
        </div>

            {/* Main Content */}
            <div className="px-4">
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
      </section>
        </Layout>
      </div>
    </>
  )
}

export default InstructorDirectoryPage
