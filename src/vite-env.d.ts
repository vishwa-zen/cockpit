/// <reference types="vite/client" />

declare global {
  interface Window {
    __ENV__?: {
      VITE_API_BASE_URL?: string;
      DEV?: boolean;
    };
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_BASE_URL?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}

export {};
