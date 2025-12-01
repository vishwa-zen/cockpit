import { Configuration, LogLevel } from "@azure/msal-browser";

// Environment variables - using process.env instead of import.meta
declare const process: {
  env: {
    VITE_AZURE_CLIENT_ID?: string;
    VITE_AZURE_TENANT_ID?: string;
    VITE_AZURE_REDIRECT_URI?: string;
  };
};

const clientId = typeof process !== 'undefined' && process.env?.VITE_AZURE_CLIENT_ID 
  ? process.env.VITE_AZURE_CLIENT_ID 
  : "your-client-id-here";

const tenantId = typeof process !== 'undefined' && process.env?.VITE_AZURE_TENANT_ID 
  ? process.env.VITE_AZURE_TENANT_ID 
  : "common";

const redirectUri = typeof process !== 'undefined' && process.env?.VITE_AZURE_REDIRECT_URI 
  ? process.env.VITE_AZURE_REDIRECT_URI 
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

const isConfigured = clientId !== "your-client-id-here";

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const isMsalConfigured = isConfigured;
