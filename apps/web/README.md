# MoonLore Web App

The main web application for MoonLore - Create Wizard-Moonbird-style artwork powered by AI.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Deployment

This app is deployed to Cloudflare Pages with the following configuration:

- **Build command**: `pnpm install --frozen-lockfile && pnpm run build`
- **Build output directory**: `apps/web/dist`
- **Functions directory**: `apps/web/functions` (auto-detected)

### Environment Variables

Set these in Cloudflare Pages dashboard:

```
# AI Services
OPENAI_API_KEY=your-openai-api-key

# NFT Minting
THIRDWEB_SECRET_KEY=your-thirdweb-secret-key
NFT_CONTRACT_ADDRESS=your-nft-contract-address
RELAYER_PRIVATE_KEY=your-relayer-private-key

# Blockchain
CHAIN_ID=8453
RPC_URL=https://mainnet.base.org

# Gasless (Optional)
DEFENDER_API_KEY=your-defender-api-key
DEFENDER_API_SECRET=your-defender-api-secret

# Web3Modal
NEXT_PUBLIC_PROJECT_ID=your-web3modal-project-id
```

## Features

- AI-powered artwork generation using FLUX (primary) and DALL-E (fallback)
- NFT minting on Base L2
- MOON token tipping
- Gasless minting support
- Gallery view
- Wallet integration

## Tech Stack

- Astro
- Cloudflare Pages
- Tailwind CSS
- TypeScript
- Web3 (wagmi/viem)

## Project Structure

```text
/apps/web/
├── public/          # Static assets
├── src/
│   ├── components/  # Astro components
│   ├── layouts/     # Page layouts
│   ├── lib/         # Utility functions
│   ├── pages/       # Route pages
│   └── styles/      # Global styles
├── functions/       # Cloudflare Pages Functions
│   └── api/         # API endpoints
└── dist/            # Build output
```

## Available Routes

- `/` - Home page
- `/generator` - AI art generator
- `/gallery` - Art gallery
- `/api/*` - API endpoints (handled by functions)