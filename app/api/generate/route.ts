import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://nano-banana.app",
    "X-Title": "Nano Banana AI Image Editor",
  },
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API key not configured. Please set OPENROUTER_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    const { imageUrl, prompt } = await request.json()

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Image URL and prompt are required' },
        { status: 400 }
      )
    }

    console.log('Making request to OpenRouter API...')

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      // Enable image generation output
      // @ts-ignore - modalities is supported by OpenRouter but not in OpenAI types
      modalities: ["image", "text"],
    })

    console.log('Received response from OpenRouter')

    const message = completion.choices[0]?.message
    const responseText = message?.content

    // Check if the response contains generated images
    // @ts-ignore - images field exists in OpenRouter response
    const generatedImages = message?.images || []

    return NextResponse.json({
      success: true,
      result: responseText,
      images: generatedImages,
    })
  } catch (error: any) {
    console.error('API Error:', error)

    // Enhanced error logging
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data)
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to process image',
        details: error.response?.data || error.toString()
      },
      { status: 500 }
    )
  }
}
