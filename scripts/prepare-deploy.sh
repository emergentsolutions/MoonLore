#!/bin/bash

# Prepare deployment script
# This script prepares the MoonLore project for deployment

set -e

echo "Preparing MoonLore for deployment..."

# Ensure no submodule issues
if [ -f .git ]; then
    echo "Removing .git file"
    rm .git
fi

if [ -d .git ]; then
    echo "Removing .git directory"
    rm -rf .git
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build the project
echo "Building project..."
pnpm build

echo "Deployment preparation complete!"