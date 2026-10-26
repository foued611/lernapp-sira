// Vite-Konfiguration. base './' hält alle Pfade relativ (AGENTS.md), damit die App unter /lernapp-sira/ läuft.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist' }
});
