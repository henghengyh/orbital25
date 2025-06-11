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
        "very-light-blue": "#F6F9FC",
        "off-white": "#F0F4F8",
        "lavender-gray": "#C7C9D9",
        "teal-green": "#2A9D8F",
        "mint-green": "#B7E4E7",
        "peach": "#ffe5b4",
        "navy-blue": "#264653",
        "light-cyan": "#A4D8E1",
        "coral": "#FF6B6B",
      }
    },
  },
  plugins: [],
}

