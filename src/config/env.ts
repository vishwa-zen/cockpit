/**
 * Environment configuration
 * Centralized place for all environment variables
 */

// Use globalThis to safely access environment variables
declare global {
  interface Window {
    __ENV__?: {
      VITE_API_BASE_URL?: string;
      DEV?: boolean;
    };
  }
}

/**
 * Safely get environment variable
 */
const getEnv = (key: string, fallback: string = ''): string => {
  // Try window.__ENV__ first (for runtime config)
  if (typeof window !== 'undefined' && window.__ENV__?.[key as keyof typeof window.__ENV__]) {
    return String(window.__ENV__[key as keyof typeof window.__ENV__]);
  }
  
  // Try process.env (for build-time config)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return String(process.env[key]);
  }
  
  return fallback;
};

/**
 * Check if running in development mode
 */
const isDevelopment = (): boolean => {
  // Check window.__ENV__ first
  if (typeof window !== 'undefined' && window.__ENV__?.DEV !== undefined) {
    return window.__ENV__.DEV;
  }
  
  // Check process.env
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV === 'development';
  }
  
  // Default to true for local development
  return true;
};

/**
 * Environment variables
 */
export const ENV = {
  API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://127.0.0.1:8003/api/v1'),
  IS_DEV: isDevelopment(),
  IS_PROD: !isDevelopment(),
} as const;

// Export helper function
export const isDev = (): boolean => ENV.IS_DEV;

// Log environment for debugging
console.log('🌍 Environment:', {
  API_BASE_URL: ENV.API_BASE_URL,
  IS_DEV: ENV.IS_DEV,
  IS_PROD: ENV.IS_PROD,
});
