#!/bin/bash

# FS Cockpit Docker Run Script

set -e

echo "🚀 Starting FS Cockpit container..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Default values
CONTAINER_NAME="fs-cockpit"
IMAGE_NAME="fs-cockpit:latest"
PORT="80"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --port)
            PORT="$2"
            shift 2
            ;;
        --name)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --image)
            IMAGE_NAME="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--port PORT] [--name NAME] [--image IMAGE]"
            exit 1
            ;;
    esac
done

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}⚠️  Container '${CONTAINER_NAME}' already exists${NC}"
    echo "🛑 Stopping and removing existing container..."
    docker stop "${CONTAINER_NAME}" 2>/dev/null || true
    docker rm "${CONTAINER_NAME}" 2>/dev/null || true
fi

# Check if image exists
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}$"; then
    echo -e "${RED}❌ Image '${IMAGE_NAME}' not found${NC}"
    echo "Please build the image first:"
    echo "   docker build -t ${IMAGE_NAME} ."
    exit 1
fi

# Run container
echo "🐳 Starting container..."
docker run -d \
    -p "${PORT}:80" \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    "${IMAGE_NAME}"

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
sleep 5

# Check container status
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo ""
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo ""
    echo "📋 Container Details:"
    echo "   Name: ${CONTAINER_NAME}"
    echo "   Image: ${IMAGE_NAME}"
    echo "   Port: ${PORT}"
    echo ""
    echo "🌐 Access application at:"
    echo "   http://localhost:${PORT}"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:    docker logs -f ${CONTAINER_NAME}"
    echo "   Stop:         docker stop ${CONTAINER_NAME}"
    echo "   Restart:      docker restart ${CONTAINER_NAME}"
    echo "   Remove:       docker rm -f ${CONTAINER_NAME}"
    echo "   Shell access: docker exec -it ${CONTAINER_NAME} sh"
else
    echo -e "${RED}❌ Failed to start container${NC}"
    echo "Check logs with: docker logs ${CONTAINER_NAME}"
    exit 1
fi
