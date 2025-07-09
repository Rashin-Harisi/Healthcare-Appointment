/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    './*.html', // All HTML files in src
    './*.js',   // All JavaScript files in src
    './renderer.js',   // Add any renderer-related files
    './main.js',],
    safelist: [
      {
        pattern: /bg-\[url\(.*\)\]/,
      },
    ],
  theme: {
    extend: {},
  },
  plugins: [],
}