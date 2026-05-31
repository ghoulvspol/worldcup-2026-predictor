import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local dev keeps `/`. Production build for GitHub Pages goes under
// /worldcup-2026-predictor/ — set via the BASE env var so we never
// hard-code the repo name in source.
const base = process.env.BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
