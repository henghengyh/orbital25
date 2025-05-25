/** @type {import('tailwindcss').Config} */
// enable Tailwind to look for files to style css
module.exports = {
  // Tells Tailwind which files to scan for class names
  content: [ 
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Customize or extend default design system (colors, spacing, etc.)
  theme: {
    // Adds custom values without removing the defaults
    extend: {},
  },
  // Load Tailwind plugins like forms, typography, line-clamp, etc.
  plugins: [],
}

