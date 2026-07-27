import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Automatically find all HTML files to include in the build
function getHtmlInputs() {
  const inputs = {};
  const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const dirFile = path.join(dir, file);
      const isDir = fs.statSync(dirFile).isDirectory();
      if (isDir) {
        // Exclude common non-source directories
        if (!['node_modules', 'dist', '.git', 'supabase', 'we', 'images', 'fonts', 'css', 'js', 'scratch', 'public', '.github', 'scripts'].includes(file)) {
          walkSync(dirFile, filelist);
        }
      } else {
        if (file.endsWith('.html')) {
          let name = path.relative(__dirname, dirFile).replace(/\\/g, '/').replace('.html', '').replace(/\//g, '_');
          if (name === 'index') name = 'main';
          inputs[name] = resolve(__dirname, dirFile);
        }
      }
    }
  };
  walkSync(__dirname);
  return inputs;
}

export default defineConfig({
  base: '/we/',
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
});
