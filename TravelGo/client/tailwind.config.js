/** 
 * @type {import('tailwindcss').Config} 
 */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "off-white": "#F0F4F8",
        "teal-green": "#2A9D8F",
        "mint-green": "#B7E4E7",
        "peach": "#ffe5b4",
        "coral": "#FF6B6B",
      }
    },
  },
  plugins: [],
}

