# Nano Banana AI Image Editor 🍌✨

English | [简体中文](README.zh-CN.md)

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

### Getting Your API Key

1. **Sign up for OpenRouter**:
   - Visit [https://openrouter.ai/](https://openrouter.ai/)
   - Create a free account

2. **Get your API key**:
   - Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Click "Create Key"
   - Copy your API key (starts with `sk-or-v1-...`)

3. **Add credits** (if needed):
   - OpenRouter requires credits to use the API
   - Visit [https://openrouter.ai/credits](https://openrouter.ai/credits)
   - Add credits to your account (Gemini 2.5 Flash Image costs approximately $0.30 per 1M input tokens)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/JW-chenjingwei/nano-banana-ai-editor.git
cd nano-banana-ai-editor
```

2. **Install dependencies**:
```bash
npm install --legacy-peer-deps
```

3. **Configure environment variables**:

Create a `.env.local` file in the root directory of the project:

```bash
# On Windows
copy NUL .env.local

# On macOS/Linux
touch .env.local
```

Then add your OpenRouter API key to the `.env.local` file:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

**⚠️ Important**:
- Replace `sk-or-v1-your-actual-api-key-here` with your actual API key from OpenRouter
- Never commit the `.env.local` file to Git (it's already in `.gitignore`)
- Keep your API key secret and secure

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:

Visit [http://localhost:3000](http://localhost:3000) to see the application.

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

This project requires the following environment variable to be set:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key for accessing Gemini 2.5 Flash Image | Yes | `sk-or-v1-abc123...` |

### How to Configure

1. Create a `.env.local` file in the project root
2. Add your API key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
3. Restart the development server if it's already running

**Security Notes**:
- ✅ The `.env.local` file is already in `.gitignore` and won't be committed
- ❌ Never share your API key publicly
- ❌ Never commit API keys to version control
- ✅ Use environment variables in production deployments (Vercel, Docker, etc.)

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
