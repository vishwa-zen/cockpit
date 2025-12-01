# FS Cockpit - Unified Diagnostics Platform

A production-ready unified diagnostics platform for IT excellence, providing intelligent incident management, real-time system insights, and unified IT operations.

## Features

- 🎫 **Incident Management**: Track and manage ServiceNow incidents
- 🔍 **Unified Search**: Search across users, devices, and tickets
- 📊 **Real-time Diagnostics**: Live system health monitoring
- 🤖 **AI Copilot**: Intelligent troubleshooting assistant (Coming Soon)
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🔐 **Enterprise Auth**: Microsoft Azure Entra AD integration

## Technology Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Tailwind CSS, ShadCN UI, Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Vite
- **State Management**: React Hooks

## API Service Documentation

### Overview

The application includes a production-ready centralized API service with:

- ✅ Axios-based HTTP client with interceptors
- ✅ Automatic token refresh on 401 errors
- ✅ Request/response logging (dev mode only)
- ✅ Retry logic for network failures
- ✅ User-friendly error messages
- ✅ Toast notifications for success/error
- ✅ TypeScript support with full type safety
- ✅ Comprehensive error handling

### Quick Start

#### 1. Configure Environment

Create a `.env` file:

```env
VITE_API_BASE_URL=https://api.example.com/v1
```

#### 2. Basic Usage

```typescript
import { apiService } from "./services/api";

// GET request
const data = await apiService.get("/endpoint");

// POST request with success toast
const result = await apiService.post(
  "/endpoint",
  { data },
  {
    showSuccessToast: true,
    successMessage: "Operation completed!",
  }
);

// Error handling
try {
  await apiService.get("/endpoint");
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.getUserMessage());
  }
}
```

#### 3. Create a Service

```typescript
// services/myService.ts
import { apiService } from "./api";

class MyService {
  async getData() {
    return apiService.get("/data", {
      showErrorToast: true,
      errorMessage: "Failed to load data",
    });
  }
}

export const myService = new MyService();
```

### Features

#### 🔐 Authentication

- Automatic token injection from localStorage
- Token refresh on 401 errors
- Automatic redirect to login on auth failure

#### 🔄 Retry Logic

- Automatic retry for network failures
- Configurable retry attempts (default: 3)
- Exponential backoff delay

#### 📝 Logging

- Request/response logging in development
- Sanitized headers (removes sensitive data)
- Request duration tracking
- Color-coded console output

#### 🎨 Toast Notifications

- Success/error/warning/info variants
- Customizable messages
- Auto-dismiss after 5 seconds
- Accessible and keyboard-friendly

#### ⚠️ Error Handling

- Custom ApiError class
- User-friendly error messages
- Error type detection (network, auth, validation, server)
- Detailed error logging

### API Methods

```typescript
// GET
apiService.get<T>(url, options);

// POST
apiService.post<T>(url, data, options);

// PUT
apiService.put<T>(url, data, options);

// PATCH
apiService.patch<T>(url, data, options);

// DELETE
apiService.delete<T>(url, options);

// File Upload
apiService.upload<T>(url, file, options);
```

### Request Options

```typescript
interface ApiRequestOptions {
  showSuccessToast?: boolean; // Show success notification
  showErrorToast?: boolean; // Show error notification (default: true)
  successMessage?: string; // Custom success message
  errorMessage?: string; // Custom error message
  silent?: boolean; // Suppress all toasts
  params?: Record<string, any>; // Query parameters
  headers?: Record<string, any>; // Custom headers
}
```

### Error Types

```typescript
// Check error type
if (error instanceof ApiError) {
  error.isNetworkError(); // No internet connection
  error.isAuthError(); // 401/403 errors
  error.isValidationError(); // 400/422 errors
  error.isServerError(); // 5xx errors
  error.getUserMessage(); // User-friendly message
}
```

### Example Service

See `src/services/ticketService.ts` for a complete example:

- CRUD operations
- Search functionality
- Custom error messages
- Success notifications

### Console Logging

In development mode, you'll see detailed logs:

- 📤 Outgoing requests (method, URL, params, body)
- 📥 Incoming responses (status, duration, data)
- ✖ Errors with stack traces
- 🔍 Request/response headers

### Configuration

Edit `src/services/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: "https://api.example.com",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3, // Number of retries
  RETRY_DELAY: 1000, // 1 second between retries
};
```

### Testing

```typescript
// Mock API calls in tests
jest.mock("./services/api", () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
```

## Application Flow

### 1. Authentication

- Users authenticate via **Microsoft Azure Entra AD**
- Secure enterprise SSO integration
- No credentials stored locally

### 2. Main Dashboard (After Login)

The main interface is split into two sections:

#### Left Panel (480px width)

- **Two Tabs:**

  - **Unified Search Tab** (Default): Shows "My Tickets" list
  - **Copilot Tab**: AI assistant (placeholder)

- **My Tickets Section:**

  - Displays all tickets assigned to the logged-in user
  - Shows ticket ID, status, title, device, priority, and time
  - Click any ticket to view details on the right panel

- **Search Bar (Bottom):**

  - Search by:
    - Device name (e.g., LAPTOP-8X7D2K)
    - Username (e.g., john.doe@company.com)
    - Incident number (e.g., INC0012345)
  - Real-time search with Enter key support

- **System Health Status (Footer):**
  - ServiceNow - Operational status
  - Tachyon - Operational status
  - Nexthink - Degraded/Warning status
  - Intune/SCCM - Operational status
  - Color-coded indicators (Green/Yellow/Red)

#### Right Panel (Flexible width)

- **Default State:** Empty state with FS Cockpit logo and instructions
- **After Ticket Selection:**
  - Full ticket details and metadata
  - Root cause analysis with confidence scores
  - Recommended actions with priority levels
  - Device health metrics
  - Related tickets and devices

### 3. Navigation Flow

```
Login (Azure Entra AD)
  → Main Dashboard (Split View)
    → Left: My Tickets + Search
    → Right: Ticket Details (on click)
```

### 4. Key Features

- **Single Page Application**: No page reloads, smooth transitions
- **Real-time Updates**: Live system status monitoring
- **Intelligent Search**: Multi-criteria search (Device/User/Incident)
- **Contextual Details**: Click any ticket to see full diagnostics
- **System Integration**: Connected to ServiceNow, Tachyon, Nexthink, Intune

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Docker (optional, for containerized deployment)
- ServiceNow API server running at: `http://127.0.0.1:8003/api/v1`

### Quick Start

**1. Install dependencies:**

```bash
npm install
```

**2. Configure environment:**

```bash
cp .env.example .env
# Edit .env with your API URL
```

**3. Start development server:**

```bash
npm run dev
```

**4. Access application:**

```
http://localhost:3000
```

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Install dependencies
make install

# Start development server
make dev

# Build for production
make build

# Build Docker image
make docker-build

# Run Docker container
make docker-run

# Complete deployment (build + docker)
make deploy
```

### Build for Production

**Standard build:**

```bash
npm run build
```

**Build with type checking:**

```bash
npm run build:check
```

**Type check only:**

```bash
npm run type-check
```

The built files will be in the `dist` folder.

### Docker Deployment

#### Quick Start with Docker

**1. Build Docker image:**

```bash
docker build -t fs-cockpit:latest .
```

**2. Run container:**

```bash
docker run -d -p 80:80 --name fs-cockpit fs-cockpit:latest
```

**3. Access application:**

```
http://localhost
```

#### With Custom API URL

**Build with custom API URL:**

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.production.com/v1 \
  -t fs-cockpit:latest .
```

**Run with environment variables:**

```bash
docker run -d \
  -p 80:80 \
  --name fs-cockpit \
  --restart unless-stopped \
  fs-cockpit:latest
```

#### Using Docker Compose

**1. Create `.env` file:**

```env
VITE_API_BASE_URL=http://127.0.0.1:8003/api/v1
```

**2. Start services:**

```bash
docker-compose up -d
```

**3. Stop services:**

```bash
docker-compose down
```

**4. View logs:**

```bash
docker-compose logs -f fs-cockpit
```

#### Docker Commands

```bash
# Build image
docker build -t fs-cockpit:latest .

# Run container
docker run -d -p 80:80 --name fs-cockpit fs-cockpit:latest

# View logs
docker logs -f fs-cockpit

# Stop container
docker stop fs-cockpit

# Remove container
docker rm fs-cockpit

# Check health
docker inspect --format='{{.State.Health.Status}}' fs-cockpit

# Execute command in container
docker exec -it fs-cockpit sh
```

#### Production Deployment

**AWS ECR + ECS:**

```bash
# Tag image
docker tag fs-cockpit:latest <account-id>.dkr.ecr.<region>.amazonaws.com/fs-cockpit:latest

# Push to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/fs-cockpit:latest
```

**Azure Container Registry:**

```bash
# Tag image
docker tag fs-cockpit:latest <registry-name>.azurecr.io/fs-cockpit:latest

# Push to ACR
docker push <registry-name>.azurecr.io/fs-cockpit:latest
```

**Google Container Registry:**

```bash
# Tag image
docker tag fs-cockpit:latest gcr.io/<project-id>/fs-cockpit:latest

# Push to GCR
docker push gcr.io/<project-id>/fs-cockpit:latest
```

### Production Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Set production environment variables:**

   ```bash
   export VITE_API_BASE_URL=https://api.production.com/v1
   ```

3. **Deploy the `dist` folder** to your hosting service:

   - AWS S3 + CloudFront
   - Netlify
   - Vercel
   - Azure Static Web Apps
   - Nginx server

4. **Configure API endpoint:**
   Update `.env` or build-time environment variables with your production API URL.

### Mock Data Mode

The application includes a **mock data fallback** feature:

- **Automatic Fallback**: If the API fails, the app automatically switches to mock data
- **Manual Toggle**: Use the toggle button (bottom-right corner) to switch between:
  - 🌐 **Live API**: Connects to real ServiceNow API
  - 🎭 **Mock Data**: Uses sample data (10 incidents)

**When to use Mock Data:**

- API server is not running
- Testing UI without backend
- Demonstrating features
- Development without API access

### Troubleshooting

If you see connection errors:

1. **Use Mock Data Mode:**
   Click the toggle button in the bottom-right corner to switch to mock data

2. **Verify API is running:**

   ```bash
   curl http://127.0.0.1:8003/api/v1/servicenow/technician/FS_Cockpit_Integration/incidents
   ```

3. **Check CORS settings:**
   Your API must allow requests from `http://localhost:3000`

   Required headers:

   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

4. **Check browser console:**
   Open DevTools (F12) → Console tab for error messages

   - 🎭 = Using mock data
   - 🌐 = Using live API
   - ✅ = API success
   - ❌ = API error

5. **Update API URL:**
   Edit `.env` file if your API is on a different host/port

## Project Structure

```
fs-cockpit/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # ShadCN UI components
│   │   └── TicketDetailsPanel.tsx
│   ├── config/             # Configuration files
│   │   └── env.ts          # Environment configuration
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts
│   ├── screens/            # Main application screens
│   │   └── Frame/
│   │       └── sections/   # Screen sections
│   ├── services/           # API and business logic
│   │   ├── api/           # API service layer
│   │   ├── mockData.ts    # Mock data for testing
│   │   └── serviceNowService.ts
│   └── lib/               # Utility functions
├── public/                # Static assets
└── package.json
```

## Authentication

The application simulates Azure Entra AD authentication. In production, this would integrate with Microsoft's authentication libraries (MSAL).
