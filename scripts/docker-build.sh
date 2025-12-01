#!/bin/bash

# FS Cockpit Docker Build Script

set -e

echo "🐳 Building FS Cockpit Docker image..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Default values
IMAGE_NAME="fs-cockpit"
IMAGE_TAG="latest"
API_URL="http://127.0.0.1:8003/api/v1"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --api-url)
            API_URL="$2"
            shift 2
            ;;
        --name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--tag TAG] [--api-url URL] [--name NAME]"
            exit 1
            ;;
    esac
done

FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo "📋 Build Configuration:"
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   API URL: ${API_URL}"
echo ""

# Build Docker image
echo "🔨 Building Docker image..."
docker build \
    --build-arg VITE_API_BASE_URL="${API_URL}" \
    -t "${FULL_IMAGE_NAME}" \
    -f Dockerfile \
    .

echo ""
echo -e "${GREEN}✅ Docker image built successfully!${NC}"
echo ""
echo "📦 Image: ${FULL_IMAGE_NAME}"
echo ""
echo "🚀 To run the container:"
echo "   docker run -d -p 80:80 --name fs-cockpit ${FULL_IMAGE_NAME}"
echo ""
echo "🔍 To view logs:"
echo "   docker logs -f fs-cockpit"
echo ""
echo "🛑 To stop the container:"
echo "   docker stop fs-cockpit"
