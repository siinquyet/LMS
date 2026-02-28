import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--lms-primary) / <alpha-value>)',
        surface: 'rgb(var(--lms-bg-primary))',
      },
    },
  },
  plugins: [],
} satisfies Config
