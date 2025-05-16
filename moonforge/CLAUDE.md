# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoonLore is a monorepo project for creating Wizard-Moonbird-style artwork using AI. It enables users to generate artwork, mint as NFTs, and tip with MOON tokens.

## Common Development Commands

### Development
```bash
# Install dependencies (using pnpm)
pnpm install

# Run development server (Astro web app)
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Format code with Prettier
pnpm format

# Type check
pnpm check
```

### Testing
Currently no tests are configured (test script exits with error).

## Architecture Overview

This is a pnpm monorepo with the following structure:

### Packages
- **apps/web**: Main Astro frontend application 
  - Built with Astro, Tailwind CSS, HTMX for form interactions
  - Deployed to Cloudflare Pages with server-side rendering
  - Images should be placed in `src/assets/` to use Astro image processing (except SVGs)

- **packages/tokens**: Design system tokens for Tailwind CSS configuration

- **workers/api_generate**: API endpoint for AI image generation (TODO)

### Key Technologies
- **Frontend**: Astro, Tailwind CSS, HTMX
- **Deployment**: Cloudflare Pages/Workers
- **Package Manager**: pnpm with workspace configuration
- **Node Version**: >=20.0.0

### Task Management

The project uses a recursive task tracking system in `tasks.qslice` with the following syntax:
- Each node: label [STATUS] (Priority, Effort:minutes, @owner)
- Statuses: TODO, WIP, DONE, BLOCKED
- Tasks are decomposed into atomic units (≤ 30 min)

### Development Guidelines

- Use Astro best practices, NOT React
- Follow Flowbite methodology with Tailwind for components
- Use Flowbite Pro page templates and blocks before writing custom code
- Use path aliases (e.g., @components) for imports where possible
- Maintain TypeScript strict mode
- Images need to be in `src/assets/` for Astro processing (except SVGs)
- Follow existing code patterns and conventions
- No external comments in code unless specifically requested

### Asset Management
- Images requiring Astro processing: Place in `src/assets/`
- Static assets (including SVGs): Place in `public/`
- Use Astro Image component for optimized image loading

### API Routes (TODO)
The project plans to implement:
- `/api/generate`: AI image generation endpoint
- Workers for FLUX/DALL-E integration
- NFT minting endpoints
- MOON token tipping functionality