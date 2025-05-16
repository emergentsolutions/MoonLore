# Moonbirds Art Forge 🎨🦉

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/moonbirds-art-forge)
[![CI Status](https://github.com/yourusername/moonbirds-art-forge/workflows/CI/badge.svg)](https://github.com/yourusername/moonbirds-art-forge/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Create stunning Wizard-Moonbird-style artwork using AI, mint as NFTs, and tip creators with MOON tokens.

## 🌟 Features

- **AI Art Generation**: Create unique Moonbird-style artwork using FLUX and DALL-E models
- **NFT Minting**: Mint your creations as NFTs on Base L2 with gasless transactions
- **MOON Token Tipping**: Support creators by tipping with MOON tokens
- **Responsive Gallery**: Browse and discover community creations
- **Wallet Integration**: Connect with popular Web3 wallets
- **Progressive Enhancement**: Beautiful UI with real-time generation progress

## 🚀 Quick Deploy

Deploy your own instance with one click:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/moonbirds-art-forge)

## 📋 Prerequisites

- Node.js 20+
- pnpm 10.10.0+
- Cloudflare account
- Web3 wallet (for NFT features)

## 🛠️ Development Setup

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
   cp workers/api_generate/.env.example workers/api_generate/.env
   ```

4. **Configure Cloudflare**
   - Create KV namespaces for image storage and caching
   - Update `wrangler.toml` with your namespace IDs
   - Set up Cloudflare AI bindings

5. **Run development server**
   ```bash
   pnpm dev
   ```

## 🏗️ Architecture

```
moonforge/
├── apps/
│   └── web/             # Astro frontend application
├── packages/
│   ├── tokens/          # Design system tokens
│   └── nft-minting/     # NFT minting utilities
├── workers/
│   └── api_generate/    # Cloudflare Worker API
└── workflows/
    └── tuner/           # Prompt optimization workflow
```

## 🔑 Environment Variables

### Web App
- `WORKER_URL` - API worker endpoint
- `PUBLIC_WEB3_PROJECT_ID` - WalletConnect project ID

### API Worker
- `THIRDWEB_SECRET_KEY` - ThirdWeb SDK key
- `RELAYER_PRIVATE_KEY` - Gasless minting relayer key
- `NFT_CONTRACT_ADDRESS` - Deployed NFT contract
- `DEFENDER_API_KEY` - OpenZeppelin Defender key (optional)
- `SIGNER_ADDRESS` - Authorized signer for gasless minting

## 📝 API Endpoints

- `POST /api/generate` - Generate artwork
- `POST /api/mint` - Mint NFT
- `GET /api/mint/:tokenId` - Get mint record
- `POST /api/tips` - Record tip transaction
- `GET /api/tips` - Get tips leaderboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Moonbirds community for inspiration
- Cloudflare for infrastructure
- ThirdWeb for NFT tooling
- OpenAI and Anthropic for AI models

## 🚧 Roadmap

- [ ] SDXL LoRA fine-tuning for Moonbird styles
- [ ] Collections and series support
- [ ] Animation capabilities
- [ ] Social features and profiles
- [ ] Mobile app development

---

Built with ❤️ by the Moonbirds community