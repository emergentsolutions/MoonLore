# Cloudflare Pages Configuration

When setting up your Cloudflare Pages deployment, use these settings in the Cloudflare dashboard:

## Build Settings

**Framework preset**: None

**Build command**: 
```
pnpm install --frozen-lockfile && pnpm run build
```

**Build output directory**:
```
apps/web/dist
```

**Root directory (advanced)**:
```
/
```

**Environment variables**:
```
NODE_VERSION=20
```

## Functions

Functions will be automatically deployed from:
```
apps/web/functions
```

## Environment Variables

Add these in the Cloudflare Pages dashboard under Settings > Environment variables:

```
OPENAI_API_KEY=your-openai-api-key
THIRDWEB_SECRET_KEY=your-thirdweb-secret-key
NFT_CONTRACT_ADDRESS=your-nft-contract-address
RELAYER_PRIVATE_KEY=your-relayer-private-key
CHAIN_ID=8453
RPC_URL=https://mainnet.base.org
DEFENDER_API_KEY=your-defender-api-key (optional)
DEFENDER_API_SECRET=your-defender-api-secret (optional)
```

## KV Namespaces

Create these KV namespaces and bind them:
- `SESSION` - For session storage
- `GENERATED_IMAGES` - For image caching
- `MINT_RECORDS` - For mint records
- `TIPS` - For tip records

## R2 Buckets

Create an R2 bucket for image storage:
- `IMAGES` - Bind to `moonlore-images` bucket

## Troubleshooting

If the build fails with "Output directory not found":
1. Make sure the "Build output directory" is set to `apps/web/dist`
2. Ensure the root directory is set to `/`
3. Verify that the build command is running from the root