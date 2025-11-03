import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const origin = request.headers.get('origin')

  console.log('🔐 Sign in request from:', origin)
  console.log('🔄 Redirect will be to:', `${origin}/auth/callback`)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('❌ OAuth error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  console.log('✅ OAuth URL generated:', data.url)
  return NextResponse.json({ url: data.url })
}
