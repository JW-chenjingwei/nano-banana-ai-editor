export default function Examples() {
  const examples = [
    {
      category: "Character Editing",
      title: "Professional Headshots",
      description: "Transform casual photos into professional portraits",
    },
    {
      category: "Scene Preservation",
      title: "Background Magic",
      description: "Edit subjects while keeping backgrounds perfect",
    },
    {
      category: "Style Transfer",
      title: "Artistic Renderings",
      description: "Apply different artistic styles to your images",
    },
    {
      category: "Object Manipulation",
      title: "Creative Composites",
      description: "Add or remove objects naturally",
    },
    {
      category: "Color Grading",
      title: "Perfect Mood",
      description: "Achieve the exact mood with color adjustments",
    },
    {
      category: "Multi-Image",
      title: "Batch Processing",
      description: "Edit multiple images with consistent style",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Showcase Your Creative Potential</h2>
          <p className="text-gray-600 text-lg">Discover what's possible with Nano Banana's powerful AI capabilities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition cursor-pointer group"
            >
              <p className="text-sm font-semibold text-yellow-600 mb-2">{example.category}</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition">
                {example.title}
              </h3>
              <p className="text-gray-600">{example.description}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
