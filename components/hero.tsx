export default function Hero() {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-white">
      {/* Disclaimer Banner */}
      <div className="text-center mb-8 px-4">
        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-full py-2 px-4 inline-block">
          Nanobanana.ai is an independent product and is not affiliated with Google or any of its brands
        </p>
      </div>

      {/* Badge */}
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 mb-6">
          <span className="text-yellow-600 text-sm font-semibold">🍌 The AI model that outperforms Flux Kontext</span>
          <span className="text-yellow-600 text-sm">Try Now →</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8 px-4">
        <div className="flex justify-center gap-4 mb-4">
          <span className="text-4xl">🍌</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Nano Banana</h1>
          <span className="text-4xl">🍌</span>
        </div>

        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
          Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
          editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="px-8 py-3 rounded-full font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition">
            Start Editing
          </button>
          <button className="px-8 py-3 rounded-full font-semibold text-gray-900 border-2 border-gray-300 hover:border-yellow-500 transition">
            View Examples
          </button>
        </div>

        {/* Features Pills */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span>✨</span>
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>⚡</span>
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>💬</span>
            <span>Natural language</span>
          </div>
        </div>
      </div>
    </section>
  )
}
