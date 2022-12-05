module.exports = {
    darkMode: 'class',
    content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
    theme: {
      extend: {
        colors: {
          "light": "rgb(191 219 254)", // blue-200
          "light-secondary": "rgb(147 197 253)", // blue-300
          "dark": "rgb(75 85 99)", // gray-600
          "dark-secondary" : "rgb(107 114 128)" // gray-500
        }
      }
    },
    plugins: [],
  };


/*
  =========Script to start tailwindcss=========
  "tailwind:css": "postcss ./src/styles/tailwind.css -o ./src/styles/index.css --watch",
  ========dev dependencies for tailwindcss=====
  "devDependencies": {
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.19",
    "postcss-cli": "^10.0.0",
    "tailwindcss": "^3.2.4"
  }
*/
