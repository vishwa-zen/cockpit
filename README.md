# FS Cockpit - Unified Diagnostics Platform

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will run in **DEMO MODE** by default (no Azure AD required).

### 3. Configure Azure AD (Optional)
To enable real authentication, update the `.env` file with your Azure AD credentials:

```env
VITE_AZURE_CLIENT_ID=your-actual-client-id
VITE_AZURE_TENANT_ID=your-actual-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

**How to get Azure AD credentials:**
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Create a new registration or use existing one
4. Copy the Application (client) ID
5. Copy the Directory (tenant) ID
6. Add `http://localhost:5173` to Redirect URIs
7. Update `.env` file with these values
8. Restart the dev server

Access at: [http://localhost:5173/](http://localhost:5173/)

## Features

✅ **Demo Mode** - Works out of the box without Azure AD
✅ **MSAL Authentication** - Microsoft Azure Entra AD integration (optional)
✅ **API Integration** - Axios with interceptors for token management
✅ **Automatic Fallback** - Mock data when API is unavailable
✅ **Error Handling** - Comprehensive error handling throughout
✅ **Session Management** - Secure token storage and logout

## Application Flow

1. **Login** (`/login`) - Azure AD authentication
2. **Dashboard** (`/home`) - View tickets and search
3. **Search Results** (`/search`) - Filtered tickets
4. **Issue Details** (`/issue/:id`) - Full diagnostics

## API Endpoints

Configure `VITE_API_BASE_URL` in `.env` to point to your backend:

- `GET /tickets/my` - Get user's tickets
- `GET /tickets/:id` - Get ticket details
- `GET /tickets/search` - Search tickets
- `GET /diagnostics/:id/root-causes` - Get root cause analysis
- `GET /diagnostics/:id/actions` - Get recommended actions
- `GET /system/status` - Get system health status

## Troubleshooting

### MSAL Errors
- Ensure redirect URI matches exactly in Azure AD
- Check client ID and tenant ID are correct
- Clear browser cache and sessionStorage

### API Errors
- Application falls back to mock data automatically
- Check browser console for detailed error messages
- Verify API base URL is correct

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then reinstall
