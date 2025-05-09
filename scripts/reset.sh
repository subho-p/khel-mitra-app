#!/bin/bash

echo "🧼 Resetting Turborepo..."

ROOT_DIR=$(git rev-parse --show-toplevel)

# Clean root
echo "➤ Cleaning root build artifacts..."
rm -rf "$ROOT_DIR/.turbo" "$ROOT_DIR/node_modules"

# Clean packages
echo "➤ Cleaning all node_modules..."
find "$ROOT_DIR/apps" -type d -name "node_modules" -exec rm -rf {} \;
find "$ROOT_DIR/packages" -type d -name "node_modules" -exec rm -rf {} \;

# Clean dist
echo "➤ Cleaning all dist..."
find "$ROOT_DIR/apps" -type d -name "dist" -exec rm -rf {} \;
find "$ROOT_DIR/packages" -type d -name "dist" -exec rm -rf {} \;

# Clean .turbo
echo "➤ Cleaning all .turbo..."
find "$ROOT_DIR/apps" -type d -name ".turbo" -exec rm -rf {} \;
find "$ROOT_DIR/packages" -type d -name ".turbo" -exec rm -rf {} \;

# Clean .next
echo "➤ Cleaning all .next..."
find "$ROOT_DIR/apps" -type d -name ".next" -exec rm -rf {} \;

# install packages
echo "➤ Installing packages..."
pnpm install

# build all internal packages
echo "➤ Building internal packages..."
pnpm build --filter=./packages/*

echo "✅ Reset Turborepo!"
