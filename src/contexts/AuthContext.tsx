import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

interface Profile {
  id: string
  email: string
  role: 'user' | 'instructor'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  becomeInstructor: () => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      console.log('[DEBUG] fetchProfile called for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[DEBUG] Error fetching profile:', error)
        setProfile(null)
        return
      }
      
      console.log('[DEBUG] Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('[DEBUG] Error in fetchProfile, setting profile to null:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      // Don't set loading - this is a background refresh
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true
    
    // Get initial session - loading represents auth resolution, not profile fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      
      console.log('[DEBUG] Initial session check:', session?.user?.id)
      setUser(session?.user ?? null)
      
      // Auth is resolved - set loading to false immediately
      // Profile fetch happens in background and doesn't block
      setLoading(false)
      
      // Fetch profile in background (non-blocking)
      if (session?.user) {
        fetchProfile(session.user.id).catch((error) => {
          console.error('[DEBUG] Background profile fetch failed:', error)
        })
      }
    }).catch((error) => {
      console.error('[DEBUG] Error getting initial session:', error)
      if (mounted) {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[DEBUG] Auth state changed:', _event, session?.user?.id)
      setUser(session?.user ?? null)
      
      // Auth is resolved - set loading to false immediately
      setLoading(false)
      
      // Fetch profile in background (non-blocking)
      if (session?.user) {
        fetchProfile(session.user.id).catch((error) => {
          console.error('[DEBUG] Background profile fetch failed:', error)
        })
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) return { error }

      if (data.user) {
        // Create profile with role = 'user' (default)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            role: 'user',
          })

        if (profileError) {
          // If profile creation fails, we should handle it
          console.error('Error creating profile:', profileError)
          return { error: profileError }
        }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const becomeInstructor = async () => {
    console.log('[DEBUG] becomeInstructor called, user:', user?.id)
    
    if (!user) {
      console.error('[DEBUG] becomeInstructor: No user')
      return { error: new Error('Not authenticated') }
    }

    try {
      console.log('[DEBUG] Calling Supabase RPC request_instructor for user:', user.id)
      const { data, error: rpcError } = await supabase.rpc('request_instructor')

      console.log('[DEBUG] RPC response:', { data, error: rpcError })

      if (rpcError) {
        console.error('[DEBUG] RPC error:', rpcError)
        return { error: rpcError }
      }

      console.log('[DEBUG] RPC successful, ensuring instructor_profiles entry exists...')
      
      // Ensure instructor_profiles entry exists (upsert with minimal data)
      const { error: profileError } = await supabase
        .from('instructor_profiles')
        .upsert({
          id: user.id,
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('[DEBUG] Error creating instructor_profiles entry:', profileError)
        // Don't fail the whole operation if profile creation fails
        // The user can still access /admin and create it there
        console.warn('[DEBUG] Continuing despite instructor_profiles error')
      } else {
        console.log('[DEBUG] instructor_profiles entry created/updated')
      }

      console.log('[DEBUG] Refreshing profile...')
      // Refresh profile - don't block on loading state
      try {
        await fetchProfile(user.id)
        console.log('[DEBUG] Profile refreshed successfully')
      } catch (error) {
        console.error('[DEBUG] Error refreshing profile:', error)
      }
      return { error: null }
    } catch (error) {
      console.error('[DEBUG] Exception in becomeInstructor:', error)
      return { error: error as Error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    becomeInstructor,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

