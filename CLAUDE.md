# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 web application for "Nano Banana", an AI image editing platform. It's a marketing landing page with an interactive editor demo built using React 19, TypeScript, and Tailwind CSS 4.

**Technology Stack:**
- Next.js 16.0.0 with App Router
- React 19.2.0 with TypeScript 5
- Tailwind CSS 4.1.9 with PostCSS
- shadcn/ui component library (60+ components based on Radix UI)
- Package manager: pnpm (note: pnpm-lock.yaml present)

## Development Commands

### Running the Application
```bash
# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Docker Deployment
```bash
# Build Docker image
docker build -t nano-banana .

# Run container
docker run -p 3000:3000 nano-banana
```

Note: The Dockerfile uses npm instead of pnpm, so package-lock.json may need to be present for Docker builds.

## Architecture

### Directory Structure

- **`/app`** - Next.js App Router (layout.tsx, page.tsx)
- **`/components`** - Page components (Header, Hero, Editor, Features, etc.)
- **`/components/ui`** - shadcn/ui library components (60+ reusable UI primitives)
- **`/hooks`** - Custom React hooks (use-mobile, use-toast)
- **`/lib`** - Utility functions (utils.ts for className merging)
- **`/public`** - Static assets
- **`/styles`** - Global CSS (if needed beyond globals.css)

### Main Application Flow

The home page ([app/page.tsx](app/page.tsx)) assembles the landing page from components:

```
Layout (app/layout.tsx)
  └─> Home Page (app/page.tsx)
       ├─> Header (navigation)
       ├─> Hero (value prop)
       ├─> Features (3-column grid)
       ├─> Editor (interactive demo)
       ├─> Examples
       ├─> Testimonials
       ├─> FAQ
       └─> Footer
```

### Key Components

**Editor Component** ([components/editor.tsx](components/editor.tsx)) - The interactive AI image editor demo:
- Handles file uploads and previews
- Manages AI model selection (Nano/Pro variants)
- Processes natural language prompts
- Supports batch processing and reference images
- Displays output gallery with download/copy actions

**UI Components** ([components/ui/](components/ui/)) - All shadcn/ui components follow the same pattern:
- Built on Radix UI primitives
- Styled with Tailwind CSS using the "new-york" preset
- Use CSS variables for theming (oklch color space)
- Support dark mode via next-themes

### Path Aliases

Configured in [tsconfig.json](tsconfig.json) and [components.json](components.json):
- `@/components` → `/components`
- `@/lib` → `/lib`
- `@/hooks` → `/hooks`
- `@/ui` → `/components/ui`

## Important Configuration Details

### Next.js Config ([next.config.mjs](next.config.mjs))
- **TypeScript build errors are ignored** (`ignoreBuildErrors: true`) - fix type issues but builds won't fail
- **Images are unoptimized** (`unoptimized: true`) - important for static exports or CDN deployment

### shadcn/ui Setup ([components.json](components.json))
- Style: "new-york"
- RSC (React Server Components): enabled
- Base color: neutral
- CSS variables: enabled for theming
- Icon library: lucide-react

When adding new shadcn/ui components, they will automatically use these settings.

### Styling System

Global styles in [app/globals.css](app/globals.css) use:
- **oklch color space** for theme colors (modern CSS color system)
- CSS custom properties for all theme tokens
- Dark mode support with `.dark` class
- Tailwind's `@layer base` for foundational styles

## Working with Forms

Forms use React Hook Form + Zod validation:
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
```

Form UI components from `@/components/ui/form` wrap Radix UI primitives.

## Analytics

Vercel Analytics is integrated in [app/layout.tsx](app/layout.tsx). Events are automatically tracked.

## Common Patterns

### Adding a New Page Component
1. Create component in `/components` with TypeScript
2. Use Tailwind CSS for styling
3. Import and use UI components from `@/components/ui`
4. Add to [app/page.tsx](app/page.tsx) or create new route in `/app`

### Adding a New UI Component
If using shadcn/ui, install via CLI (or manually add to `/components/ui`):
```bash
npx shadcn@latest add [component-name]
```

### Theme Colors
Modify CSS variables in [app/globals.css](app/globals.css) to change theme colors. The app uses oklch() color space, not rgb() or hsl().

## Notes

- This project was generated with v0.app (Vercel's AI code generator)
- No test framework is currently configured
- No README.md exists in the repository
- The application is in early stage (version 0.1.0)
