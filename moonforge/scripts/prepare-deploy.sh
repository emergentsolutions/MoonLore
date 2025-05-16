#!/bin/bash

# Prepare deployment script
# This script prepares the moonforge directory for deployment

set -e

echo "Preparing moonforge for deployment..."

# Change to the moonforge directory
cd moonforge

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