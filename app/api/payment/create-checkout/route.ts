import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import axios from 'axios'

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
    const { product_id, preview_only, test_mode } = body

    console.log('📦 Received product_id:', product_id)
    console.log('📧 User email:', user.email)
    console.log('👀 Preview only:', preview_only)
    console.log('🧪 Test mode:', test_mode)

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // TEST MODE: Skip Creem API and return mock checkout URL
    if (test_mode) {
      console.log('🧪 TEST MODE: Returning mock checkout session')
      const mockCheckoutUrl = `https://checkout.creem.io/test-session-${Date.now()}`

      return NextResponse.json({
        checkoutUrl: mockCheckoutUrl,
        sessionId: `test_session_${Date.now()}`,
        testMode: true,
        backendRequest: {
          url: 'https://api.creem.io/v1/checkouts',
          method: 'POST',
          headers: {
            'x-api-key': 'TEST_MODE_ENABLED'
          },
          body: { product_id }
        },
        backendResponse: {
          status: 200,
          data: {
            id: `test_session_${Date.now()}`,
            checkout_url: mockCheckoutUrl,
            product_id: product_id
          }
        }
      })
    }

    // Create Creem checkout session
    const creemApiKey = "creem_6ukMYM5SkJaeI2PnOHHChw"
    console.log('🔑 CREEM_API_KEY (Production):', creemApiKey)

    if (!creemApiKey) {
      console.error('CREEM_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    // If preview_only mode, return request details without sending
    if (preview_only) {
      console.log('👀 Preview mode - returning API key:', creemApiKey)
      return NextResponse.json({
        preview: true,
        backendRequest: {
          url: 'https://api.creem.io/v1/checkouts',
          method: 'POST',
          headers: {
            'x-api-key': creemApiKey, // Masked for security
          },
          body: { product_id },
        }
      })
    }

    // Log detailed request information
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔍 CREEM API REQUEST DETAILS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📍 URL: https://api.creem.io/v1/checkouts')
    console.log('📋 Method: POST')
    console.log('\n🔐 Headers:')
    console.log(JSON.stringify({
      'x-api-key': creemApiKey,
    }, null, 2))
    console.log('\n📦 Request Body:')
    console.log(JSON.stringify({ product_id }, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    try {
      const subscriptionCheckout = await axios.post(
        'https://api.creem.io/v1/checkouts',
        {
          product_id: product_id,
        },
        {
          headers: { 'x-api-key': creemApiKey },
        }
      )

      // Log response
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📥 CREEM API RESPONSE')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📊 Status Code:', subscriptionCheckout.status)
      console.log('\n✅ Success Response Body:')
      console.log(JSON.stringify(subscriptionCheckout.data, null, 2))
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      const checkoutSession = subscriptionCheckout.data

      // Redirect to checkout URL
      return NextResponse.json({
        checkoutUrl: checkoutSession.checkout_url,
        sessionId: checkoutSession.id,
        // Backend request details for debugging (API key masked for security)
        backendRequest: {
          url: 'https://api.creem.io/v1/checkouts',
          method: 'POST',
          headers: {
            'x-api-key':creemApiKey,
          },
          body: { product_id },
        },
        backendResponse: {
          status: subscriptionCheckout.status,
          data: checkoutSession,
        }
      })
    } catch (axiosError: any) {
      // Handle axios errors
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📥 CREEM API RESPONSE')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      if (axiosError.response) {
        console.log('📊 Status Code:', axiosError.response.status)
        console.log('📊 Status Text:', axiosError.response.statusText)
        console.error('\n❌ Error Response Body:')
        console.error(JSON.stringify(axiosError.response.data, null, 2))
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        let errorMessage = 'Failed to create checkout session'

        if (axiosError.response.status === 403) {
          errorMessage = 'Product not found. Please create products in Creem Dashboard first.'
        } else if (axiosError.response.status === 401) {
          errorMessage = 'Invalid API key. Please check your Creem API key.'
        }

        return NextResponse.json(
          {
            error: errorMessage,
            details: axiosError.response.data,
            debug: {
              requestUrl: 'https://api.creem.io/v1/checkouts',
              requestHeaders: {
                'x-api-key': creemApiKey,
              },
              requestBody: { product_id },
              responseStatus: axiosError.response.status
            }
          },
          { status: axiosError.response.status }
        )
      } else {
        console.error('❌ Network Error:', axiosError.message)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        throw axiosError
      }
    }
  } catch (error) {
    console.error('❌ Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
