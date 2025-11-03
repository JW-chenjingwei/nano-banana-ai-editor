export default function Features() {
  const features = [
    {
      icon: "✨",
      title: "One-shot Editing",
      description: "Transform your images with a single command",
    },
    {
      icon: "⚡",
      title: "Multi-image Support",
      description: "Process multiple images at once efficiently",
    },
    {
      icon: "💬",
      title: "Natural Language",
      description: "Use simple text prompts for precise editing",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-xl hover:bg-white transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
