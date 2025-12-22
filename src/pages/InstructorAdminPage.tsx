import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CategoryBadge from '../components/CategoryBadge'
import { categories } from '../data/mockData'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { fetchInstructorProfile, InstructorProfile } from '../services/instructorService'

const InstructorAdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bio, setBio] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState('')
  const [featuredTracks, setFeaturedTracks] = useState<Array<{ song_title: string; artist: string }>>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Array<{ product_name: string; brand: string; purchase_url: string }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Save form state to sessionStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (!user || !initialLoadComplete) return
    
    const formState = {
      bio,
      selectedCategories,
      imageUrl,
      name,
      specialty,
      city,
      state,
      spotifyPlaylistUrl,
      featuredTracks,
      favoriteProducts,
    }
    sessionStorage.setItem(`instructor_form_${user.id}`, JSON.stringify(formState))
  }, [bio, selectedCategories, imageUrl, name, specialty, city, state, spotifyPlaylistUrl, featuredTracks, favoriteProducts, user, initialLoadComplete])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      setLoading(true)
      setInitialLoadComplete(false)
      
      // Clear sessionStorage before loading to avoid stale empty state
      const savedStateKey = `instructor_form_${user.id}`
      sessionStorage.removeItem(savedStateKey)
      
      // Load from database
      const profile = await fetchInstructorProfile(user.id)
      
      if (profile) {
        // Load all data from database
        setBio(profile.bio || '')
        setSelectedCategories(profile.categories || [])
        setImageUrl(profile.image_url || '')
        setName(profile.name || '')
        setSpecialty(profile.specialty || '')
        setCity(profile.city || '')
        setState(profile.state || '')
        setSpotifyPlaylistUrl(profile.spotify_playlist_url || '')
        
        // Ensure featured_tracks is always an array
        const tracks = profile.featured_tracks || []
        const tracksArray = Array.isArray(tracks) ? tracks : []
        // Don't filter out tracks - show all that exist, even if some fields are empty
        setFeaturedTracks(tracksArray.length > 0 ? tracksArray : [])
        
        // Ensure favorite_products is always an array
        const products = profile.favorite_products || []
        const productsArray = Array.isArray(products) ? products : []
        // Don't filter out products - show all that exist, even if some fields are empty
        setFavoriteProducts(productsArray.length > 0 ? productsArray : [])
      }

      setLoading(false)
      setInitialLoadComplete(true)
    }

    loadProfile()
  }, [user, navigate])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Get the current display image (preview if selected, otherwise existing image URL, otherwise null)
  const displayImageUrl = previewUrl || imageUrl || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError(null)
    setSaving(true)
    setUploading(false)

    try {
      // Upload image to Supabase Storage if a file is selected
      let uploadedImageUrl = imageUrl
      
      if (selectedFile) {
        setUploading(true)
        const filePath = `${user.id}.jpg`
        
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('instructor-headshots')
          .upload(filePath, selectedFile, {
            upsert: true,
            contentType: selectedFile.type,
          })

        if (uploadError) {
          setUploading(false)
          setSaving(false)
          setError(`Failed to upload image: ${uploadError.message}`)
          return
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('instructor-headshots')
          .getPublicUrl(filePath)

        if (!urlData?.publicUrl) {
          setUploading(false)
          setSaving(false)
          setError('Failed to get image URL after upload')
          return
        }

        uploadedImageUrl = urlData.publicUrl
        setImageUrl(uploadedImageUrl)
        setUploading(false)
      }
      // Filter out empty tracks and products before saving
      const validTracks = featuredTracks.filter(track => 
        (track.song_title && track.song_title.trim() !== '') || 
        (track.artist && track.artist.trim() !== '')
      )
      const validProducts = favoriteProducts.filter(product => 
        (product.product_name && product.product_name.trim() !== '') || 
        (product.brand && product.brand.trim() !== '') || 
        (product.purchase_url && product.purchase_url.trim() !== '')
      )

      // Validate favorite products if any are added
      if (validProducts.length > 0) {
        for (let i = 0; i < validProducts.length; i++) {
          const product = validProducts[i]
          if (!product.product_name || product.product_name.trim() === '') {
            throw new Error(`Product ${i + 1}: Product name is required`)
          }
          if (!product.brand || product.brand.trim() === '') {
            throw new Error(`Product ${i + 1}: Brand is required`)
          }
          if (!product.purchase_url || product.purchase_url.trim() === '') {
            throw new Error(`Product ${i + 1}: Purchase URL is required`)
          }
          // Validate URL format
          try {
            new URL(product.purchase_url)
          } catch {
            throw new Error(`Product ${i + 1}: Purchase URL must be a valid URL (e.g., https://example.com)`)
          }
        }
      }

      // Fetch existing profile to preserve all existing data
      const existingProfile = await fetchInstructorProfile(user.id)

      // Merge form state with existing profile data
      // Use form values if they exist, otherwise preserve existing database values
      const updatedProfile = {
        id: user.id,
        // Use form state if it has a value, otherwise preserve existing value
        name: (name && name.trim() !== '') ? name : (existingProfile?.name || null),
        bio: (bio && bio.trim() !== '') ? bio : (existingProfile?.bio || null),
        categories: selectedCategories.length > 0 ? selectedCategories : (existingProfile?.categories || null),
        image_url: uploadedImageUrl || (existingProfile?.image_url || null),
        specialty: (specialty && specialty.trim() !== '') ? specialty : (existingProfile?.specialty || null),
        // Update location fields from form state (preserve existing if form is empty)
        city: (city && city.trim() !== '') ? city : (existingProfile?.city || null),
        state: (state && state.trim() !== '') ? state : (existingProfile?.state || null),
        // Update Spotify fields from form state (preserve existing if form is empty)
        spotify_playlist_url: (spotifyPlaylistUrl && spotifyPlaylistUrl.trim() !== '') ? spotifyPlaylistUrl : (existingProfile?.spotify_playlist_url || null),
        featured_tracks: validTracks.length > 0 ? validTracks : (existingProfile?.featured_tracks || null),
        // Update favorite products from form state (preserve existing if form is empty)
        favorite_products: validProducts.length > 0 ? validProducts : (existingProfile?.favorite_products || null),
      }

      console.log('Saving profile with data:', updatedProfile)
      console.log('Spotify URL being saved:', updatedProfile.spotify_playlist_url)
      console.log('Favorite products being saved:', updatedProfile.favorite_products)
      console.log('Number of products being saved:', validProducts.length)
      console.log('Number of tracks being saved:', validTracks.length)

      // Upsert instructor profile with merged data
      const { data, error: upsertError } = await supabase
        .from('instructor_profiles')
        .upsert(updatedProfile)
        .select()

      if (upsertError) {
        console.error('Supabase error:', upsertError)
        throw upsertError
      }

      console.log('Save successful, response:', data)

      // Clear sessionStorage after successful save
      if (user) {
        sessionStorage.removeItem(`instructor_form_${user.id}`)
      }
      
      // Show success and refresh
      alert('Profile saved successfully!')
      window.location.reload()
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setError(err.message || 'Failed to save profile')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen w-full fixed inset-0 bg-[#F4F6FB] dark:bg-gray-900 -z-10"></div>
        <div className="relative instructor-admin-layout">
          <Layout>
            <section className="min-h-screen py-10 px-4">
              <div className="text-center py-12">
                <div className="text-text-light-secondary dark:text-text-dark-secondary">Loading...</div>
              </div>
            </section>
          </Layout>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .instructor-admin-layout > div:first-child {
          background-color: transparent !important;
        }
        .instructor-admin-layout.dark > div:first-child {
          background-color: transparent !important;
        }
      `}</style>
      <div className="min-h-screen w-full fixed inset-0 bg-[#F4F6FB] dark:bg-gray-900 -z-10"></div>
      <div className="relative instructor-admin-layout">
        <Layout>
          <section className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-primary hover:text-blue-600 transition-colors text-sm mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md border border-gray-200 dark:border-border-dark p-6 sm:p-8">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-[28px] font-bold leading-tight tracking-[-0.015em] mb-8">
              Instructor Admin Dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error saving profile:</p>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                  Check the browser console for more details. Make sure you've added the spotify_playlist_url and featured_tracks columns to the instructor_profiles table in Supabase.
                </p>
              </div>
            )}

            {/* Profile Photo Section */}
            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Profile photo
              </h2>
              
              <div className="flex flex-col items-start gap-4">
                {/* Image Display */}
                <div className="flex items-center gap-4">
                  {displayImageUrl ? (
                    <img
                      src={displayImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                      <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                        person
                      </span>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <div>
                  <label
                    htmlFor="profile-photo"
                    className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2"
                  >
                    Upload photo
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={uploading || saving}
                    className="block w-full text-sm text-text-light-secondary dark:text-text-dark-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-blue-600 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-text-light-secondary dark:text-text-dark-secondary">
                    Accepted formats: JPEG, PNG, WebP
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Basic Info
              </h2>
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Specialty */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Specialty
                </label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  placeholder="e.g., Yoga Teacher, HIIT Specialist"
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Location
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                    placeholder="City"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Bio
              </h2>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Tell us about yourself
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Specialties / Categories
              </h2>
              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                  Select your specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                        selectedCategories.includes(category.name)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <CategoryBadge key={category} category={category} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Workout Music Section */}
            <div>
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Workout Music
              </h2>
              
              {/* Spotify Playlist URL */}
              <div className="mb-6">
                <label htmlFor="spotify_playlist_url" className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                  Spotify Playlist URL
                </label>
                <input
                  id="spotify_playlist_url"
                  type="text"
                  value={spotifyPlaylistUrl}
                  onChange={(e) => setSpotifyPlaylistUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                  placeholder="https://open.spotify.com/playlist/..."
                />
                <p className="mt-2 text-xs text-text-light-secondary dark:text-text-dark-secondary">
                  Paste a Spotify playlist link. We'll display featured tracks and link listeners to Spotify.
                </p>
              </div>

              {/* Featured Tracks */}
              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                  Featured Tracks (max 4)
                </label>
                <div className="space-y-3">
                  {featuredTracks.map((track, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={track.song_title}
                            onChange={(e) => {
                              const updated = [...featuredTracks]
                              updated[index] = { ...track, song_title: e.target.value }
                              setFeaturedTracks(updated)
                            }}
                            placeholder="Song title"
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={track.artist}
                            onChange={(e) => {
                              const updated = [...featuredTracks]
                              updated[index] = { ...track, artist: e.target.value }
                              setFeaturedTracks(updated)
                            }}
                            placeholder="Artist"
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-gray-700 transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedTracks(featuredTracks.filter((_, i) => i !== index))
                        }}
                        className="px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {featuredTracks.length < 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedTracks([...featuredTracks, { song_title: '', artist: '' }])
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-text-light-primary dark:text-text-dark-primary bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      + Add Track
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Products I Love Section */}
            <div>
              <h2 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                Products I Love
              </h2>
              <div>
                <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-3">
                  Add up to 3 products you recommend (max 3)
                </label>
                <div className="space-y-4">
                  {favoriteProducts.map((product, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                          Product {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFavoriteProducts(favoriteProducts.filter((_, i) => i !== index))
                          }}
                          className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-text-light-primary dark:text-text-dark-primary mb-1.5">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            value={product.product_name}
                            onChange={(e) => {
                              const updated = [...favoriteProducts]
                              updated[index] = { ...product, product_name: e.target.value }
                              setFavoriteProducts(updated)
                            }}
                            placeholder="e.g., Align High-Rise Pant"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-light-primary dark:text-text-dark-primary mb-1.5">
                            Brand *
                          </label>
                          <input
                            type="text"
                            value={product.brand}
                            onChange={(e) => {
                              const updated = [...favoriteProducts]
                              updated[index] = { ...product, brand: e.target.value }
                              setFavoriteProducts(updated)
                            }}
                            placeholder="e.g., Lululemon"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-light-primary dark:text-text-dark-primary mb-1.5">
                            Purchase URL *
                          </label>
                          <input
                            type="url"
                            value={product.purchase_url}
                            onChange={(e) => {
                              const updated = [...favoriteProducts]
                              updated[index] = { ...product, purchase_url: e.target.value }
                              setFavoriteProducts(updated)
                            }}
                            placeholder="https://..."
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {favoriteProducts.length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFavoriteProducts([...favoriteProducts, { product_name: '', brand: '', purchase_url: '' }])
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-text-light-primary dark:text-text-dark-primary bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      + Add Product
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setBio('')
                  setSelectedCategories([])
                  setImageUrl('')
                  setName('')
                  setSpecialty('')
                  setCity('')
                  setState('')
                  setSpotifyPlaylistUrl('')
                  setFeaturedTracks([])
                  setFavoriteProducts([])
                }}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-text-light-primary dark:text-text-dark-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
          </div>
        </div>
      </section>
        </Layout>
      </div>
    </>
  )
}

export default InstructorAdminPage
