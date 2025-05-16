# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoonLore is a Web3 application for creating Wizard-Moonbird-style artwork using AI. It enables users to generate artwork, mint as NFTs, and tip with MOON tokens.

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
  - Published as `@moonlore/tokens`

- **packages/nft-minting**: NFT minting utilities
  - Published as `@moonlore/nft-minting`
  - Handles ThirdWeb integration and gasless minting

- **workers/api_generate**: API endpoint for AI image generation
  - Cloudflare Worker with Hono framework
  - Integrates FLUX and DALL-E models
  - Handles NFT minting and tip recording

### Key Technologies
- **Frontend**: Astro, Tailwind CSS, HTMX, React (for wallet components)
- **Deployment**: Cloudflare Pages/Workers
- **Package Manager**: pnpm with workspace configuration
- **Node Version**: >=20.0.0
- **AI Models**: FLUX (primary), DALL-E (fallback)
- **Blockchain**: Base L2, wagmi/viem for Web3 integration

### Task Management

The project uses a recursive task tracking system in `tasks.qslice` with the following syntax:
- Each node: label [STATUS] (Priority, Effort:minutes, @owner)
- Statuses: TODO, WIP, DONE, BLOCKED
- Tasks are decomposed into atomic units (≤ 30 min)

### Development Guidelines

- Use Astro best practices, NOT React (except for specific islands)
- Follow Flowbite methodology with Tailwind for components
- Use path aliases (e.g., @components) for imports where possible
- Maintain TypeScript strict mode
- Images need to be in `src/assets/` for Astro processing (except SVGs)
- Follow existing code patterns and conventions
- No external comments in code unless specifically requested

### Asset Management
- Images requiring Astro processing: Place in `src/assets/`
- Static assets (including SVGs): Place in `public/`
- Use Astro Image component for optimized image loading

### API Routes
The project implements:
- `/api/generate`: AI image generation endpoint
- `/api/mint`: NFT minting endpoint
- `/api/tips`: MOON token tipping functionality
- Workers for FLUX/DALL-E integration
- KV storage for images, prompts, and mint records

### Environment Variables

Required for development and deployment:
- `CLOUDFLARE_API_TOKEN`: For deployment
- `THIRDWEB_SECRET_KEY`: NFT minting
- `RELAYER_PRIVATE_KEY`: Gasless transactions
- `NFT_CONTRACT_ADDRESS`: Deployed contract
- `DEFENDER_API_KEY`: OpenZeppelin Defender (optional)
- `PUBLIC_WEB3_PROJECT_ID`: WalletConnect

### Deployment

The project is configured for Cloudflare deployment:
- Pages for the frontend (apps/web)
- Workers for the API (workers/api_generate)
- KV namespaces for data storage
- R2 buckets for image storage