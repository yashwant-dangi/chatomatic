import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import path from 'node:path';
import graphqlLoader from "vite-plugin-graphql-loader";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), graphqlLoader()],
  resolve: {
    alias: {
      "libs": path.resolve(__dirname, "src/libs"),
      "components": path.resolve(__dirname, "src/components"),
      "gql": path.resolve(__dirname, "src/gql")
    }
  }
})
