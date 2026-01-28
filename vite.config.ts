import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Injeksi API Key secara spesifik. 
      // Vite akan mengganti 'process.env.API_KEY' di dalam kode dengan string nilai API key yang sebenarnya saat build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});