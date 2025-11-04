"use client"

import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

type BillingCycle = 'monthly' | 'yearly'

interface PricingTier {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  credits: {
    monthly: number
    yearly: number
  }
  images: string
  popular?: boolean
  features: string[]
  priceId: {
    monthly: string
    yearly: string
  }
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: {
      monthly: 12,
      yearly: 144
    },
    credits: {
      monthly: 150,
      yearly: 1800
    },
    images: "75 high-quality images/month",
    features: [
      "All style templates",
      "Standard generation speed",
      "Basic customer support",
      "JPG/PNG downloads",
      "Commercial use license"
    ],
    priceId: {
      monthly: "prod_4qnJojSNjKtm3KwEkL3r0p",
      yearly: "prod_r6yj7Vfk0cfz9yujZphp"
    }
  },
  {
    name: "Pro",
    price: {
      monthly: 19.50,
      yearly: 234
    },
    credits: {
      monthly: 800,
      yearly: 9600
    },
    images: "400 high-quality images/month",
    popular: true,
    features: [
      "Seedream-4 and Nanobanana-Pro model",
      "Priority generation queue",
      "Priority customer support",
      "JPG/PNG/WebP downloads",
      "Batch generation",
      "Image editing tools (coming soon)",
      "Commercial use license"
    ],
    priceId: {
      monthly: "prod_65Z9K9I3Q01qH9SDcMw91I",
      yearly: "prod_3UEd1QgQ7UIzL8JexR7J1o"
    }
  },
  {
    name: "Max",
    price: {
      monthly: 80,
      yearly: 960
    },
    credits: {
      monthly: 4600,
      yearly: 55200
    },
    images: "2300 high-quality images/month",
    features: [
      "Both advanced models",
      "Fastest generation speed",
      "Dedicated account manager",
      "All format downloads",
      "Batch generation",
      "Professional editing suite (coming soon)",
      "Commercial use license"
    ],
    priceId: {
      monthly: "prod_2FkOnfFXDpmHoGx5MKTFba",
      yearly: "prod_4kpgGD1NYVpeun1SDwK7Sw"
    }
  }
]

const creditPacks = [
  { name: "Starter", credits: 200, price: 10 },
  { name: "Growth", credits: 533, price: 25 },
  { name: "Professional", credits: 1333, price: 60 },
  { name: "Enterprise", credits: 5333, price: 200 }
]

interface PaymentDetails {
  tierName: string
  price: number
  cycle: string
  productId: string
  requestUrl: string
  headers: any
  body: any
  response?: any
  error?: string
  backendRequest?: any
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [loading, setLoading] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubscribe = async (productId: string, tierName: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please sign in to subscribe. Use the GitHub or Google login buttons in the top right corner.')
      return
    }

    setLoading(tierName)

    // Find tier details
    const tier = pricingTiers.find(t => t.name === tierName)
    const price = tier ? tier.price[billingCycle] : 0

    const requestUrl = '/api/payment/create-checkout'
    const requestHeaders = {
      'Content-Type': 'application/json',
    }
    const requestBody = {
      product_id: productId,
      preview_only: true
    }

    // Initialize payment details
    const details: PaymentDetails = {
      tierName,
      price,
      cycle: billingCycle,
      productId,
      requestUrl,
      headers: requestHeaders,
      body: { product_id: productId }
    }

    try {
      // Get preview of backend request
      const previewResponse = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      })

      const previewData = await previewResponse.json()

      if (previewData.preview && previewData.backendRequest) {
        details.backendRequest = previewData.backendRequest
        setPaymentDetails(details)
        setShowConfirmModal(true)
        setLoading(null)
      } else {
        details.error = 'Failed to get request preview'
        setPaymentDetails(details)
        setShowDetailsModal(true)
        setLoading(null)
      }
    } catch (error) {
      console.error('Preview error:', error)
      details.error = error instanceof Error ? error.message : 'Unknown error'
      setPaymentDetails(details)
      setShowDetailsModal(true)
      setLoading(null)
    }
  }

  const confirmAndSend = async () => {
    if (!paymentDetails) return

    setShowConfirmModal(false)
    setLoading(paymentDetails.tierName)

    const requestUrl = '/api/payment/create-checkout'
    const requestHeaders = {
      'Content-Type': 'application/json',
    }
    const requestBody = {
      product_id: paymentDetails.productId,
      preview_only: false
    }

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      paymentDetails.response = data

      if (response.status === 401) {
        paymentDetails.error = 'Authentication required'
        setPaymentDetails({...paymentDetails})
        setShowDetailsModal(true)
        setLoading(null)
        return
      }

      if (data.error) {
        paymentDetails.error = data.error
        paymentDetails.backendRequest = data.backendRequest  // Include backend request details in error response
        setPaymentDetails({...paymentDetails})
        setShowDetailsModal(true)
      } else if (data.checkoutUrl) {
        paymentDetails.response = { ...data, status: response.status }
        setPaymentDetails({...paymentDetails})
        setShowDetailsModal(true)
        setTimeout(() => {
          window.location.href = data.checkoutUrl
        }, 3000)
      } else {
        paymentDetails.error = 'Failed to create checkout session'
        setPaymentDetails({...paymentDetails})
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      paymentDetails.error = error instanceof Error ? error.message : 'Unknown error'
      setPaymentDetails({...paymentDetails})
      setShowDetailsModal(true)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && paymentDetails?.backendRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🔍 确认支付请求</h2>
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setLoading(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">订阅信息</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">套餐:</span>
                    <span className="ml-2 font-medium">{paymentDetails.tierName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">价格:</span>
                    <span className="ml-2 font-medium">${paymentDetails.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">周期:</span>
                    <span className="ml-2 font-medium capitalize">{paymentDetails.cycle}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="ml-2 font-mono text-xs">{paymentDetails.productId}</span>
                  </div>
                </div>
              </div>

              {/* Backend Request Details */}
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">🚀 后端将发送到 Creem API 的请求详情</h3>

                <div className="mb-3">
                  <span className="text-gray-600 font-medium text-sm">URL:</span>
                  <code className="block mt-1 bg-white px-3 py-2 rounded text-xs border">
                    {paymentDetails.backendRequest.url}
                  </code>
                </div>

                <div className="mb-3">
                  <span className="text-gray-600 font-medium text-sm">Method:</span>
                  <code className="block mt-1 bg-white px-3 py-2 rounded text-xs border">
                    {paymentDetails.backendRequest.method}
                  </code>
                </div>

                <div className="mb-3">
                  <span className="text-gray-600 font-medium text-sm">Headers (包含 x-api-key):</span>
                  <pre className="mt-1 bg-white p-3 rounded text-xs overflow-x-auto border-2 border-green-400">
                    {JSON.stringify(paymentDetails.backendRequest.headers, null, 2)}
                  </pre>
                </div>

                <div>
                  <span className="text-gray-600 font-medium text-sm">Request Body:</span>
                  <pre className="mt-1 bg-white p-3 rounded text-xs overflow-x-auto border">
                    {JSON.stringify(paymentDetails.backendRequest.body, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Confirm Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={confirmAndSend}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✓ 确认并发送请求
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setLoading(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ✗ 取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetailsModal && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Plan:</span>
                    <span className="ml-2 font-medium">{paymentDetails.tierName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-medium">${paymentDetails.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Billing:</span>
                    <span className="ml-2 font-medium capitalize">{paymentDetails.cycle}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="ml-2 font-mono text-xs">{paymentDetails.productId}</span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-3">
                    <span className="text-gray-600 text-sm">URL:</span>
                    <code className="ml-2 text-xs bg-white px-2 py-1 rounded">{paymentDetails.requestUrl}</code>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-600 text-sm">Headers:</span>
                    <pre className="mt-1 bg-white p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(paymentDetails.headers, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Body:</span>
                    <pre className="mt-1 bg-white p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(paymentDetails.body, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Backend Request (if available) */}
              {paymentDetails.backendRequest && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Backend → Creem API Request</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(paymentDetails.backendRequest, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Response Details */}
              {paymentDetails.response && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Response</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto bg-white p-2 rounded">
                      {JSON.stringify(paymentDetails.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {paymentDetails.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Error</h3>
                  <p className="text-red-700 text-sm">{paymentDetails.error}</p>
                </div>
              )}

              {/* Success Message */}
              {!paymentDetails.error && paymentDetails.response?.checkoutUrl && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">
                    Redirecting to checkout in 3 seconds...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that works best for you
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                Save 50%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {tier.credits[billingCycle]} credits
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {tier.images}
                </p>
              </div>

              <button
                onClick={() => handleSubscribe(tier.priceId[billingCycle], tier.name)}
                disabled={loading === tier.name}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition mb-6 ${
                  tier.popular
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.name ? 'Loading...' : isAuthenticated ? 'Get Started' : 'Sign In to Subscribe'}
              </button>

              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Credit Packs */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              One-Time Credit Packs
            </h3>
            <p className="text-gray-600">
              Need extra credits? Purchase one-time credit packs that never expire
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPacks.map((pack) => (
              <div
                key={pack.name}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {pack.name}
                </h4>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${pack.price}
                </p>
                <p className="text-gray-600 mb-4">{pack.credits} credits</p>
                <button
                  onClick={() => handleSubscribe(`price_${pack.name.toLowerCase()}_onetime`, pack.name)}
                  disabled={loading === pack.name}
                  className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === pack.name ? 'Loading...' : isAuthenticated ? 'Buy Now' : 'Sign In to Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center">
          <p className="text-gray-600">
            All plans include commercial use license. Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}
