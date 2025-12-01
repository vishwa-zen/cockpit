# FS Cockpit Makefile
# Convenient commands for development and deployment

.PHONY: help install dev build clean docker-build docker-run docker-stop docker-clean deploy

# Default target
.DEFAULT_GOAL := help

# Variables
IMAGE_NAME := fs-cockpit
IMAGE_TAG := latest
CONTAINER_NAME := fs-cockpit
PORT := 80

help: ## Show this help message
	@echo "FS Cockpit - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	npm install

dev: ## Start development server
	@echo "🚀 Starting development server..."
	npm run dev

build: ## Build for production
	@echo "🏗️  Building for production..."
	npm run build

build-check: ## Build with type checking
	@echo "🔍 Building with type checking..."
	npm run build:check

type-check: ## Run TypeScript type checking
	@echo "🔍 Running type check..."
	npm run type-check

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist node_modules/.vite

docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker-run: ## Run Docker container
	@echo "🚀 Starting Docker container..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	docker run -d -p $(PORT):80 --name $(CONTAINER_NAME) --restart unless-stopped $(IMAGE_NAME):$(IMAGE_TAG)
	@echo "✅ Container started at http://localhost:$(PORT)"

docker-stop: ## Stop Docker container
	@echo "🛑 Stopping Docker container..."
	docker stop $(CONTAINER_NAME)

docker-logs: ## View Docker container logs
	docker logs -f $(CONTAINER_NAME)

docker-shell: ## Access Docker container shell
	docker exec -it $(CONTAINER_NAME) sh

docker-clean: ## Remove Docker container and image
	@echo "🧹 Cleaning Docker resources..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true

docker-compose-up: ## Start with docker-compose
	@echo "🚀 Starting with docker-compose..."
	docker-compose up -d

docker-compose-down: ## Stop docker-compose services
	@echo "🛑 Stopping docker-compose services..."
	docker-compose down

docker-compose-logs: ## View docker-compose logs
	docker-compose logs -f

deploy: build docker-build ## Build and create Docker image
	@echo "✅ Deployment artifacts ready!"
	@echo "   - dist/ folder for static hosting"
	@echo "   - Docker image: $(IMAGE_NAME):$(IMAGE_TAG)"

all: clean install build docker-build ## Clean, install, build, and create Docker image
	@echo "✅ All tasks completed!"
