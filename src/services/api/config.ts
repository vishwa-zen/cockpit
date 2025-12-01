import axios, { AxiosInstance } from "axios";
import { logger } from "./logger";
import { ENV } from "../../config/env";
import { apiRequest, msalConfig } from "../../config/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

// Create a separate instance for API calls to avoid circular dependencies
const apiMsalInstance = new PublicClientApplication(msalConfig);
let isApiMsalInitialized = false;

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  WITH_CREDENTIALS: false, // Set to true if you need cookies/auth
} as const;

// Log the API base URL for debugging
console.log('🔗 API Base URL:', API_CONFIG.BASE_URL);

/**
 * Helper to get access token silently
 */
const getAccessToken = async (): Promise<string | null> => {
  try {
    if (!isApiMsalInitialized) {
        await apiMsalInstance.initialize();
        isApiMsalInitialized = true;
    }

    const accounts = apiMsalInstance.getAllAccounts();
    if (accounts.length > 0) {
      const response = await apiMsalInstance.acquireTokenSilent({
        ...apiRequest,
        account: accounts[0],
      });
      return response.accessToken;
    }
    return null;
  } catch (error) {
    // console.warn("Failed to acquire token silently:", error);
    return null;
  }
};

/**
 * Create and configure axios instance
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: API_CONFIG.WITH_CREDENTIALS,
  });

  console.log('✅ API Client created with base URL:', API_CONFIG.BASE_URL);

  // Request interceptor
  client.interceptors.request.use(
    async (config) => {
      // Get MSAL token
      const token = await getAccessToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback to local storage if needed (legacy)
        const localToken = localStorage.getItem("auth_token");
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
        }
      }

      // Add timestamp for duration tracking
      (config as any).metadata = { startTime: Date.now() };

      // Log request
      logger.logRequest(config);

      return config;
    },
    (error) => {
      logger.logError("Request Error", error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log successful response
      logger.logResponse(response);
      return response;
    },
    async (error) => {
      // Log error
      logger.logError("Response Error", error);
      return Promise.reject(error);
    },
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();
