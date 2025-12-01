import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 'http://127.0.0.1:8003/api/v1'
      ),
      'process.env.VITE_AZURE_CLIENT_ID': JSON.stringify(
        env.VITE_AZURE_CLIENT_ID || 'your-client-id-here'
      ),
      'process.env.VITE_AZURE_TENANT_ID': JSON.stringify(
        env.VITE_AZURE_TENANT_ID || 'common'
      ),
      'process.env.VITE_AZURE_REDIRECT_URI': JSON.stringify(
        env.VITE_AZURE_REDIRECT_URI || 'http://localhost:3000'
      ),
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      cors: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            ui: ['@radix-ui/react-avatar', '@radix-ui/react-progress', '@radix-ui/react-scroll-area'],
            icons: ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
