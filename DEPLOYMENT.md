# Deployment Instructions for MoonLore

This project is ready to deploy to Cloudflare Pages. Follow these steps:

## Prerequisites

1. GitHub repository
2. Cloudflare account
3. Web3Modal project ID

## Setup Steps

### 1. Create GitHub Repository

1. Create a new repository on GitHub named `moonlore`
2. Add this project as the remote:
   ```bash
   git remote add origin https://github.com/<your-username>/moonlore.git
   git push -u origin master
   ```

### 2. Configure Environment Variables

Update the following in your code:
- `apps/web/src/components/WalletConnect.tsx`: Replace `YOUR_PROJECT_ID` with your Web3Modal project ID
- `wrangler.toml`: Update with your Cloudflare account ID and project settings

### 3. Deploy to Cloudflare

#### Option A: GitHub Actions (Automatic)
1. The deployment workflow is already configured in `.github/workflows/deploy.yml`
2. It will automatically deploy when you push to `master` branch
3. Set up the following GitHub secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

#### Option B: Cloudflare Pages Dashboard (Manual)
1. Log in to Cloudflare dashboard
2. Go to Pages
3. Create a new project
4. Connect your GitHub repository
5. Use these build settings:
   - Build command: `cd apps/web && pnpm install && pnpm build`
   - Build output directory: `apps/web/dist`
   - Environment variables: Set any required variables
   - Functions directory: `workers/api_generate`

#### Option C: Direct Cloudflare Deploy (Once repository is set up)
```bash
cd apps/web
pnpm cloudflare-deploy
```

## Required Environment Variables

Set these in your Cloudflare Pages settings:

```
THIRDWEB_SECRET_KEY=your-thirdweb-secret-key
NFT_CONTRACT_ADDRESS=your-nft-contract-address
RELAYER_PRIVATE_KEY=your-relayer-private-key
CHAIN_ID=8453
RPC_URL=https://mainnet.base.org
OPENAI_API_KEY=your-openai-api-key (for DALL-E)
DEFENDER_API_KEY=your-defender-api-key (optional, for gasless)
DEFENDER_API_SECRET=your-defender-api-secret (optional, for gasless)
```

## Post-Deployment

1. Update the GitHub repository URL in:
   - `README.md`
   - `apps/web/README.md`
   - `_build.yml`

2. Set up custom domain (optional):
   - Add your domain in Cloudflare Pages settings
   - Update DNS records to point to Cloudflare

3. Monitor deployment:
   - Check GitHub Actions for CI/CD status
   - View Cloudflare Pages dashboard for deployment logs
   - Test all features on the deployed site

## Troubleshooting

If deployment fails:
1. Check GitHub Actions logs for errors
2. Verify all environment variables are set correctly
3. Ensure dependencies are up to date
4. Check Cloudflare Pages build logs
5. Verify functions are properly configured

## Rollback

To rollback to a previous version:
1. Use Cloudflare Pages dashboard to select previous deployment
2. Or revert Git commit and push to trigger new deployment