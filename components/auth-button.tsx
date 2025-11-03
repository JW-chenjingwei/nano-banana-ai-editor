"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in')
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      })
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-gray-900">
            {user.user_metadata?.name || user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
      Sign in with GitHub
    </button>
  )
}
