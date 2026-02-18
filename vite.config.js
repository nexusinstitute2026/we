import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // If you are deploying to https://<USERNAME>.github.io/<REPO>/
  // Change 'YOUR_REPO_NAME' to your actual repository name.
  base: '/home/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        al: resolve(__dirname, 'al.html'),
        prachina: resolve(__dirname, 'prachina.html'),
      }
    }
  }
});
