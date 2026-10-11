/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FFF9F0",
        cream: "#FDF1DE",
        blush: "#F7DCE2",
        cherry: "#C83D4D",
        cherrydeep: "#A02C3C",
        butter: "#F4D98B",
        rose: "#DCA7AF",
        cocoa: "#49312F",
        cocoasoft: "#7A5F5B",
        sage: "#C7D1B8",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
