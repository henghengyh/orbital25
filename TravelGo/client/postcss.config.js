// tells PostCSS which plugins to use and how to use them
module.exports = {
  plugins: {
    tailwindcss: {}, // Tells PostCSS to process @tailwind directives and apply Tailwind utilities
    autoprefixer: {}, // Automatically adds browser-specific prefixes (e.g., -webkit-)
  },
}
