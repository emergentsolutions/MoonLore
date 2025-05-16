/** @type {import('tailwindcss').Config} */
import { colors, typography, spacing, borderRadius, boxShadow } from '@moonforge/tokens';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing,
      borderRadius,
      boxShadow,
    },
  },
  plugins: [],
}
