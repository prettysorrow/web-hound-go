import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// begin shadcn fixing stuff
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// end shadcn fixing stuff

export default defineConfig({
  plugins: [
    // begin shadcn fixing stuff
    tailwindcss(),
    // end shadcn fixing stuff
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  // begin shadcn fixing stuff
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // end shadcn fixing stuff
});
