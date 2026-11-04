import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  // `npm run bundle` builds in "singlefile" mode: all code, styles and fonts are
  // inlined into one index.html that opens by double-click (no server needed).
  // Files in public/ (images, videos) are copied next to it as separate files.
  const singleFile = mode === 'singlefile';

  return {
    // Relative asset paths, so the build works from any server path or from disk.
    base: './',
    server: {
      open: true, // open the deck in the browser on `npm run dev`
    },
    plugins: singleFile ? [viteSingleFile()] : [],
    build: {
      outDir: singleFile ? 'bundle' : 'dist',
      // A local slide deck isn't downloaded over a network; ignore the 500 kB default.
      chunkSizeWarningLimit: 3000,
    },
  };
});
