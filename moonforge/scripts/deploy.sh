#!/bin/bash

# Moonbirds Art Forge Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-staging}

echo -e "${YELLOW}🚀 Deploying Moonbirds Art Forge to ${ENVIRONMENT}${NC}"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler is not installed. Installing...${NC}"
    pnpm add -g wrangler@latest
fi

# Check if required environment variables are set
check_env_vars() {
    local required_vars=("CLOUDFLARE_API_TOKEN")
    
    if [ "$ENVIRONMENT" = "production" ]; then
        required_vars+=("THIRDWEB_SECRET_KEY" "RELAYER_PRIVATE_KEY" "NFT_CONTRACT_ADDRESS")
    fi
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ Required environment variable $var is not set${NC}"
            exit 1
        fi
    done
}

# Build packages
build_packages() {
    echo -e "${YELLOW}📦 Building packages...${NC}"
    pnpm install --frozen-lockfile
    pnpm build
}

# Deploy worker
deploy_worker() {
    echo -e "${YELLOW}☁️  Deploying API worker...${NC}"
    cd workers/api_generate
    
    if [ "$ENVIRONMENT" = "production" ]; then
        wrangler deploy --env production
    else
        wrangler deploy --env staging
    fi
    
    cd ../..
}

# Deploy web app
deploy_web() {
    echo -e "${YELLOW}🌐 Building and deploying web app...${NC}"
    cd apps/web
    
    # Set worker URL based on environment
    if [ "$ENVIRONMENT" = "production" ]; then
        export WORKER_URL="https://api.moonbirds-art.com"
    else
        export WORKER_URL="https://moonbirds-api-generate.workers.dev"
    fi
    
    pnpm build
    
    # Deploy to Cloudflare Pages
    wrangler pages deploy dist --project-name=moonbirds-art-forge --branch=$ENVIRONMENT
    
    cd ../..
}

# Create KV namespaces if they don't exist
setup_kv_namespaces() {
    echo -e "${YELLOW}🗄️  Setting up KV namespaces...${NC}"
    
    # Check if namespaces exist, create if not
    namespaces=("GENERATED_IMAGES" "PROMPT_CACHE" "MINT_RECORDS")
    
    for namespace in "${namespaces[@]}"; do
        if ! wrangler kv:namespace list | grep -q "$namespace"; then
            echo "Creating KV namespace: $namespace"
            wrangler kv:namespace create "$namespace"
        fi
    done
}

# Main deployment flow
main() {
    echo -e "${GREEN}Starting deployment process...${NC}"
    
    check_env_vars
    build_packages
    setup_kv_namespaces
    deploy_worker
    deploy_web
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo -e "${GREEN}🌟 Your app is now available at:${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo -e "${GREEN}   Web: https://moonbirds-art.com${NC}"
        echo -e "${GREEN}   API: https://api.moonbirds-art.com${NC}"
    else
        echo -e "${GREEN}   Web: https://moonbirds-art-forge.pages.dev${NC}"
        echo -e "${GREEN}   API: https://moonbirds-api-generate.workers.dev${NC}"
    fi
}

# Run the script
main