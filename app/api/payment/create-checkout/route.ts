import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId, billingCycle } = body

    console.log('📦 Received priceId:', priceId)
    console.log('💳 Billing cycle:', billingCycle)

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Create Creem checkout session
    const creemApiKey = process.env.CREEM_API_KEY
    if (!creemApiKey) {
      console.error('CREEM_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create checkout session with Creem API
    // Try simpler request body format
    const requestBody = {
      product_id: priceId,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      customer: {
        email: user.email,
      },
    }

    console.log('🔍 Request body:', JSON.stringify(requestBody, null, 2))

    const creemResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': creemApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!creemResponse.ok) {
      const errorData = await creemResponse.json()
      console.error('Creem API error:', errorData)

      let errorMessage = 'Failed to create checkout session'

      if (creemResponse.status === 403) {
        errorMessage = 'Product not found. Please create products in Creem Dashboard first.'
      } else if (creemResponse.status === 401) {
        errorMessage = 'Invalid API key. Please check your Creem API key.'
      }

      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: creemResponse.status }
      )
    }

    const checkoutSession = await creemResponse.json()

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
