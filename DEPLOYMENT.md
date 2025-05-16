# Deployment Instructions for Moonbirds Art Forge

## ⚠️ Important: Submodule Issue

This repository has a historical issue where the `moonforge` directory was previously a git submodule. This causes deployment failures with the error "Failed: error occurred while updating repository submodules".

## 🚀 Deployment Options

### Option 1: Direct Cloudflare Pages Deployment (Recommended)

1. **Fork or Clone this repository**
2. **Create a new Cloudflare Pages project**
3. **Configure build settings:**
   - Build command: `cd moonforge && npm install -g pnpm && pnpm install --frozen-lockfile && cd apps/web && pnpm build`
   - Build output directory: `moonforge/apps/web/dist`
   - Root directory: `/`
   - Environment variables:
     - `NODE_VERSION`: `20`

### Option 2: GitHub Actions Deployment

1. **Set up GitHub Secrets:**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. **Push to main branch**
   - The `.github/workflows/deploy-cloudflare.yml` will handle deployment

### Option 3: Manual Deployment

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd moonbirds-art-forge
   ```

2. **Prepare and build:**
   ```bash
   cd moonforge
   pnpm install --frozen-lockfile
   cd apps/web
   pnpm build
   ```

3. **Deploy with Wrangler:**
   ```bash
   npx wrangler pages deploy dist --project-name=moonbirds-art-forge
   ```

## 🛠️ Fixing the Submodule Issue (For Repository Maintainers)

If you need to clean up the git history:

```bash
# Create a clean branch
git checkout -b clean-deploy

# Remove the problematic history
git filter-branch --index-filter 'git rm --cached --ignore-unmatch moonforge' HEAD

# Force push (be careful!)
git push origin clean-deploy --force
```

## 📝 Environment Variables Needed

### For Web App:
- `PUBLIC_WORKER_URL`: Your API worker URL
- `PUBLIC_WEB3_PROJECT_ID`: WalletConnect project ID

### For API Worker:
- `THIRDWEB_SECRET_KEY`: ThirdWeb SDK key
- `RELAYER_PRIVATE_KEY`: Gasless minting relayer key
- `NFT_CONTRACT_ADDRESS`: Deployed NFT contract address
- `DEFENDER_API_KEY`: OpenZeppelin Defender key (optional)

## 🏗️ Build Configuration

The project uses:
- Node.js 20+
- pnpm 10.10.0+
- Astro for static site generation
- Cloudflare Workers for API

## 🚨 Troubleshooting

If you encounter the submodule error:
1. Use the manual deployment option
2. Or create a fresh repository without the git history
3. Or use the provided GitHub Action which bypasses submodule checks

For any other issues, check:
- Node version is 20+
- pnpm is installed globally
- All environment variables are set
- Cloudflare account has necessary permissions