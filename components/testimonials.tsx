export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Creative Director",
      company: "Design Studio Pro",
      content: "Nano Banana has revolutionized our workflow. The quality is incredible and the speed is unmatched.",
      avatar: "👩‍💼",
    },
    {
      name: "Marcus Johnson",
      role: "Photographer",
      company: "Lens & Vision",
      content: "Finally an AI tool that understands nuance. Our clients can't believe these are AI-edited.",
      avatar: "👨‍💼",
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Manager",
      company: "Brand Strategy Co",
      content: "The consistency and quality across batches is phenomenal. Time-saving and cost-effective.",
      avatar: "👩‍💼",
    },
    {
      name: "David Kim",
      role: "Content Creator",
      company: "Digital Media Labs",
      content: "Best AI image tool I've tried. Simple to use, powerful results. Highly recommended!",
      avatar: "👨‍💼",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Loved by Creators & Professionals</h2>
          <p className="text-gray-600 text-lg">Join thousands who've transformed their creative workflow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-xl p-8 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
