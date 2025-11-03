"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import AuthButton from "./auth-button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl">🍌</div>
            <span className="text-lg font-semibold text-gray-900">Nano Banana</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
              Image Editor
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
              Showcase
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
              Toolbox
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
              Pricing
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
              API
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Image Editor
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Showcase
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Toolbox
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Pricing
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              API
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
