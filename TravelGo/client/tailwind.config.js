/** 
 * @type {import('tailwindcss').Config} 
 */

// enable Tailwind to look for files to style css
module.exports = {
  // Tells Tailwind which files to scan for class names
  content: [ 
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Customize or extend default design system (colors, spacing, etc.)
  theme: {
    // Adds custom values without removing the defaults
    extend: {
      colors: {
        "very-light-blue" : "#F6F9FC",
        "off-white" : "#F0F4F8",
        "lavender-gray" : "#C7C9D9",
        "teal-green" : "#2A9D8F",
        "mint-green" : "#B7E4E7",
        "peach" : "#ffe5b4",
      }
    },
  },
  // Load Tailwind plugins like forms, typography, line-clamp, etc.
  plugins: [],
}

