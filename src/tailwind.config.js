// Tailwind v4 uses CSS-based configuration via @theme in globals.css.
// This file is kept for tooling compatibility only (IDE autocomplete, etc.)
// The actual design tokens live in styles/globals.css → @theme inline { ... }

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './**/*.{ts,tsx}',
  ],
};
