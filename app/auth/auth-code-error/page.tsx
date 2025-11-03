import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't complete your sign in. This could be due to:
        </p>
        <ul className="text-left text-gray-600 mb-8 space-y-2">
          <li>• The authentication link expired</li>
          <li>• The authentication was cancelled</li>
          <li>• GitHub OAuth is not configured correctly</li>
        </ul>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
