"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How is Nano Banana different from other AI image editors?",
      answer:
        "Nano Banana uses advanced machine learning to preserve scene context while editing subjects. Our model delivers superior character consistency and natural results compared to alternatives like Flux Kontext.",
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, PNG, WebP, and other common formats. Maximum file size is 50MB per image.",
    },
    {
      question: "Can I use Nano Banana for commercial work?",
      answer:
        "Yes! Our Pro and Enterprise plans include commercial licensing. You own all rights to your edited images.",
    },
    {
      question: "How long does image processing take?",
      answer:
        "Most images are processed within 10-30 seconds. Batch processing with the Pro plan can process multiple images simultaneously.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, we offer a comprehensive REST API for developers. Check our API documentation for integration details and pricing.",
    },
    {
      question: "What are your privacy policies?",
      answer:
        "We never store or share your images. All processing is done securely on our servers and deleted immediately after completion.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-yellow-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">Find answers to common questions about Nano Banana</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-yellow-300 transition"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  className={`text-yellow-600 transition-transform flex-shrink-0 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 text-gray-600 border-t border-gray-100">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
