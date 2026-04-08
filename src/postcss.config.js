// Tailwind v4 is handled by @tailwindcss/vite plugin in vite.config.ts
// PostCSS only runs autoprefixer for vendor-prefix compatibility
export default {
  plugins: {
    autoprefixer: {},
  },
};
