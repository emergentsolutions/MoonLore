# Moonbirds Art Forge

Create Wizard-Moonbird-style artwork, mint as NFTs, and tip with MOON tokens.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/moonbirds-art-forge)

## Features

- 🎨 Generate AI-powered Moonbird artwork
- 🖼️ Mint as NFTs on Base L2
- 💰 Tip creators with MOON tokens
- 🔗 Wallet integration for Moonbird holders
- ⚡ Cloudflare-powered AI generation
- 🎯 Responsive design with Tailwind CSS

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 8.x
- Cloudflare account (for deployment)
- Wallet with Moonbirds NFT (for testing)

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moonbirds-art-forge.git
   cd moonbirds-art-forge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env
   # Update the values in .env with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm --filter web dev
   ```
   The app will be available at http://localhost:3000

### Project Structure

```
moonbirds-art-forge/
├── apps/
│   └── web/                    # Astro frontend
│       ├── public/             # Static assets
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   ├── layouts/        # Page layouts
│       │   ├── pages/          # Route components
│       │   └── styles/         # Global styles
│       └── astro.config.mjs    # Astro configuration
│
├── packages/
│   └── tokens/              # Design tokens and theme
│       ├── src/
│       │   └── index.ts     # Token definitions
│       └── tailwind.config.js # Tailwind configuration
│
├── workers/
│   ├── api_generate/       # Image generation API
│   └── tuner_workflow/     # Prompt tuning workflows
│
├── contracts/              # Smart contracts
├── .github/                # GitHub workflows
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Development Workflow

- **Linting**: `pnpm lint`
- **Type Checking**: `pnpm check`
- **Formatting**: `pnpm format`
- **Build**: `pnpm build`

## Deployment

### Cloudflare Pages

1. Push your code to a GitHub repository
2. Connect the repository to Cloudflare Pages
3. Set the following build settings:
   - Framework preset: Astro
   - Build command: `pnpm --filter web build`
   - Build output directory: `apps/web/dist`
   - Environment variables: Add your `.env` variables

### Environment Variables

Create a `.env` file in the `apps/web` directory with the following variables:

```env
# Cloudflare
PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_account_id
PUBLIC_CLOUDFLARE_API_TOKEN=your_api_token

# Wallet Connect
PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# API Endpoints
PUBLIC_API_BASE_URL=/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Moonbirds](https://moonbirds.xyz/) for the inspiration
- [Cloudflare](https://cloudflare.com/) for the amazing edge platform
- [Astro](https://astro.build/) for the awesome framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
