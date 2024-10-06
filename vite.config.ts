import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.tsx"),
      name: "DraggableTreeView",
      fileName: "draggable-tree-view",
    },
    rollupOptions: {
      external: ["react", "react-dom", 'react/jsx-runtime'],
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      include: ['src/components'],
      outDir: "dist/types"
    }),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
})
