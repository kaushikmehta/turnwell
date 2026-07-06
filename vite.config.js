import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: `base` must match your repo name for GitHub Pages project sites.
// Repo `turnwell`  ->  site https://<you>.github.io/turnwell/  ->  base "/turnwell/"
// If you name the repo something else, change this one line to "/<repo-name>/".
export default defineConfig({
  plugins: [react()],
  base: "/turnwell/",
});
