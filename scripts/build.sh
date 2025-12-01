#!/bin/bash

# FS Cockpit Build Script
# This script builds the application for production

set -e

echo "🚀 Starting FS Cockpit build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist
rm -rf node_modules/.vite

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Type check
echo "🔍 Running type check..."
npm run type-check || {
    echo -e "${YELLOW}⚠️  Type check warnings found, but continuing build...${NC}"
}

# Build application
echo "🏗️  Building application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed: dist directory not found${NC}"
    exit 1
fi

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Build failed: index.html not found in dist${NC}"
    exit 1
fi

# Display build size
echo ""
echo "📊 Build Statistics:"
echo "-------------------"
du -sh dist
echo ""
echo "📁 Build Contents:"
ls -lh dist/

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📦 Build output is in the 'dist' directory"
echo "🚀 To preview: npm run preview"
echo "🐳 To build Docker image: docker build -t fs-cockpit:latest ."
