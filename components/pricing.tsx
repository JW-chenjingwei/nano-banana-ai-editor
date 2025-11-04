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
      monthly: "prod_73f2TIH0PZehGLpKVzhShE",
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

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [loading, setLoading] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  const handleSubscribe = async (priceId: string, tierName: string) => {
    // DEBUG: Show the Product ID being sent
    alert(`🔍 DEBUG INFO:\n\nTier: ${tierName}\nBilling Cycle: ${billingCycle}\nProduct ID: ${priceId}\n\nThis will be sent to the API.`)

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please sign in to subscribe. Use the GitHub or Google login buttons in the top right corner.')
      return
    }

    setLoading(tierName)
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          billingCycle,
        }),
      })

      if (response.status === 401) {
        alert('Please sign in to continue. Use the GitHub or Google login buttons in the top right corner.')
        setLoading(null)
        return
      }

      const data = await response.json()

      if (data.error) {
        alert(`Error: ${data.error}`)
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
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
  )
}
