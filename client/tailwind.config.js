
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-background": "#e3e0f1",
        "on-tertiary-container": "#ffe0cd",
        "surface-variant": "#343440",
        "on-surface": "#e3e0f1",
        "on-secondary": "#472a00",
        "on-secondary-fixed": "#2a1700",
        "primary-container": "#7c3aed",
        "surface-container-low": "#1b1a26",
        "error-container": "#93000a",
        "surface-container": "#1f1e2a",
        "surface": "#12121d",
        "on-secondary-container": "#5b3800",
        "secondary-fixed-dim": "#ffb95f",
        "secondary-container": "#ee9800",
        "primary": "#d2bbff",
        "on-primary-container": "#ede0ff",
        "inverse-primary": "#732ee4",
        "outline-variant": "#4a4455",
        "on-primary": "#3f008e",
        "primary-fixed": "#eaddff",
        "on-secondary-fixed-variant": "#653e00",
        "surface-container-highest": "#343440",
        "on-tertiary-fixed": "#301400",
        "on-error": "#690005",
        "on-surface-variant": "#ccc3d8",
        "error": "#ffb4ab",
        "on-error-container": "#ffdad6",
        "on-primary-fixed": "#25005a",
        "on-primary-fixed-variant": "#5a00c6",
        "surface-container-high": "#292935",
        "secondary-fixed": "#ffddb8",
        "tertiary-container": "#a15100",
        "background": "#12121d",
        "secondary": "#ffb95f",
        "tertiary": "#ffb784",
        "outline": "#958da1",
        "surface-dim": "#12121d",
        "surface-container-lowest": "#0d0d18"
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
 
