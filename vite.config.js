import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel serves the app from the domain root, so no `base` sub-path is needed.
// (Under GitHub Pages this used to be "/turnwell/" for the project sub-path.)
export default defineConfig({
  plugins: [react()],
});
