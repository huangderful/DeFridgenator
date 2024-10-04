// tailwind.config.js
const { withUt } = require("uploadthing/tw");

module.exports = withUt({
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
