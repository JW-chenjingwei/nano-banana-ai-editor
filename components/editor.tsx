"use client"

import type React from "react"

import { useState, useRef } from "react"

export default function Editor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<string>("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile || !prompt) {
      alert("Please upload an image and enter a prompt")
      return
    }

    setIsProcessing(true)
    setError("")
    setGeneratedResult("")
    setGeneratedImages([])

    try {
      console.log('Sending request to API...')
      // Send the base64 image data to the API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: preview, // base64 data URL
          prompt: prompt,
        }),
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      // Set text result if available
      if (data.result) {
        setGeneratedResult(data.result)
        console.log('Result set:', data.result)
      }

      // Set generated images if available
      if (data.images && data.images.length > 0) {
        const imageUrls = data.images.map((img: any) => {
          // Handle different response formats
          if (typeof img === 'string') return img
          if (img.image_url?.url) return img.image_url.url
          if (img.url) return img.url
          return null
        }).filter(Boolean)

        setGeneratedImages(imageUrls)
        console.log('Generated images:', imageUrls.length)
      }

      if (!data.result && (!data.images || data.images.length === 0)) {
        throw new Error('No result or images returned from API')
      }
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to process image')
      alert(`Error: ${err.message || 'Failed to process image'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async () => {
    if (generatedResult) {
      try {
        await navigator.clipboard.writeText(generatedResult)
        alert('Result copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
      }
    }
  }

  const handleDownload = () => {
    // Download generated images if available
    if (generatedImages.length > 0) {
      generatedImages.forEach((imageUrl, index) => {
        const a = document.createElement('a')
        a.href = imageUrl
        a.download = `nano-banana-${index + 1}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
      return
    }

    // Otherwise download text result
    if (generatedResult) {
      const blob = new Blob([generatedResult], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'nano-banana-result.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-600 font-semibold mb-2">GET STARTED</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Try The AI Editor</h2>
          <p className="text-gray-600 mt-4 text-lg">
            Experience the power of nano-banana's natural language image editing.
            <br />
            Transform any photo with simple text commands
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Prompt Engine */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✨</span>
              <h3 className="text-2xl font-semibold text-gray-900">Prompt Engine</h3>
            </div>
            <p className="text-gray-600 mb-6">Transform your image with AI-powered editing</p>

            {/* Upload Area */}
            <div className="mb-6">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-yellow-300 rounded-lg p-8 text-center hover:bg-yellow-100 transition cursor-pointer"
              >
                <p className="text-4xl mb-2">+</p>
                <p className="text-gray-700 font-semibold">Upload Image</p>
                <p className="text-gray-500 text-sm">Max 50MB</p>
              </button>
            </div>

            {/* Image Tabs */}
            <div className="flex gap-2 mb-6">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold">Image to Image</button>
              <button className="px-4 py-2 text-gray-700 hover:bg-yellow-100 rounded-lg font-semibold">
                Text to Image
              </button>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">🤖 AI Model Selection</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>Nano Banana</option>
                <option>Nano Banana Pro</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Different models offer unique characteristics and styles</p>
            </div>

            {/* Batch Processing */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm font-semibold text-gray-900">Batch Processing</span>
                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Pro</span>
              </label>
              <p className="text-xs text-gray-600 mt-2">Enable batch mode to process multiple images at once</p>
            </div>

            {/* Reference Image */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">📎 Reference Image: 0/9</label>
              <div className="border-2 border-dashed border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-2xl mb-2">+</p>
                <p className="text-sm text-gray-600">Add image</p>
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">💬 Main Prompt</label>
              <div className="mb-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
                <strong>ℹ️ Tip:</strong> This model can generate and edit images. Try prompts like:
                "Add a sunset in the background" or "Make this a futuristic cyberpunk scene"
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Transform this into a futuristic city with neon lights and flying cars..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={4}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full mt-6 bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {isProcessing ? "Generating..." : "✨ Generate Now"}
            </button>
          </div>

          {/* Output Gallery */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🎨</span>
              <h3 className="text-2xl font-semibold text-gray-900">Output Gallery</h3>
            </div>
            <p className="text-gray-600 mb-6">Your ultra-fast AI creations appear here instantly</p>

            {isProcessing ? (
              <div className="flex-1 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="animate-spin text-6xl mb-4">⏳</div>
                  <p className="text-gray-900 font-semibold text-lg">Generating your image...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take 10-20 seconds</p>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="flex-1 rounded-lg overflow-auto mb-6 bg-white border-2 border-green-300 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div className="text-lg font-bold text-green-700">Generated Images</div>
                </div>
                <div className="grid gap-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
                {generatedResult && (
                  <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Description:</div>
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">{generatedResult}</div>
                  </div>
                )}
              </div>
            ) : generatedResult ? (
              <div className="flex-1 rounded-lg overflow-auto mb-6 bg-white border-2 border-green-300 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div className="text-lg font-bold text-green-700">AI Analysis Result</div>
                </div>
                <div className="text-gray-900 whitespace-pre-wrap leading-relaxed text-base">
                  {generatedResult}
                </div>
              </div>
            ) : preview ? (
              <div className="flex-1 rounded-lg overflow-hidden mb-6 bg-white border border-gray-200">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
                <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                  <p className="text-sm text-gray-700">
                    <strong>Ready!</strong> Enter your prompt and click "Generate Now" to create or edit this image.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-lg bg-white border-2 border-dashed border-yellow-200 flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-5xl mb-2">🖼️</p>
                  <p className="text-gray-600 font-semibold">Ready for instant generation</p>
                  <p className="text-gray-500 text-sm">Upload an image and enter your prompt</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!generatedResult && generatedImages.length === 0}
                className="flex-1 px-4 py-2 text-gray-700 hover:bg-white border border-gray-300 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!generatedResult && generatedImages.length === 0}
                className="flex-1 px-4 py-2 text-gray-700 hover:bg-white border border-gray-300 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
