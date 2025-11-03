# Nano Banana AI Image Editor 🍌✨

An AI-powered image editing web application built with Next.js 16 and Google Gemini 2.5 Flash Image API.

## Features

- 🎨 **AI Image Generation & Editing** - Transform images with natural language prompts
- ⚡ **Fast Processing** - Powered by Google's Gemini 2.5 Flash Image model
- 🖼️ **Interactive Interface** - Upload images and see results instantly
- 📥 **Download Results** - Save generated images and descriptions
- 🎯 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16.0.0 with App Router
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4.1.9
- **Components:** shadcn/ui (60+ components)
- **AI API:** OpenRouter with Gemini 2.5 Flash Image
- **Language:** TypeScript 5

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JW-chenjingwei/nano-banana-ai-editor.git
cd nano-banana-ai-editor
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory:
```env
OPENROUTER_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload an Image** - Click the upload area to select an image
2. **Enter a Prompt** - Describe how you want to transform the image
3. **Generate** - Click "Generate Now" and wait 10-20 seconds
4. **Download** - Save your generated image

### Example Prompts

- "Add a sunset in the background"
- "Make this a futuristic cyberpunk scene"
- "Transform this into a watercolor painting"
- "Add neon lights and flying cars"

## Building for Production

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker build -t nano-banana-ai-editor .
docker run -p 3000:3000 -e OPENROUTER_API_KEY=your_key nano-banana-ai-editor
```

## Project Structure

```
├── app/
│   ├── api/generate/    # API route for image generation
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── editor.tsx       # Main editor component
│   ├── ui/              # shadcn/ui components
│   └── ...
├── public/              # Static assets
└── lib/                 # Utility functions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Powered by [Google Gemini 2.5 Flash Image](https://ai.google.dev/gemini-api/docs/image-generation)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/)

## Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Built with ❤️ using Claude Code
