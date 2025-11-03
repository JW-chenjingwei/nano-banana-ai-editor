"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Editor from "@/components/editor"
import Examples from "@/components/examples"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Editor />
      <Examples />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
