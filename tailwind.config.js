/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{njk,md}", "./src/**/*.svg"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(22, 163, 74)',
          light: 'rgb(7, 201, 131)',
          dark: 'rgb(21, 128, 61)',
        },
        background: {
          dark: 'rgb(9, 13, 13)',
        },
        surface: 'rgb(11, 12, 14)',
        gray: {
          50:  'rgb(243, 247, 245)',
          100: 'rgb(238, 242, 240)',
          200: 'rgb(223, 227, 224)',
          300: 'rgb(206, 211, 208)',
          400: 'rgb(159, 163, 160)',
          500: 'rgb(112, 116, 114)',
          600: 'rgb(80, 84, 82)',
          700: 'rgb(63, 67, 64)',
          800: 'rgb(38, 42, 39)',
          900: 'rgb(23, 27, 25)',
          950: 'rgb(10, 15, 12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Inter Fallback', '-apple-system', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'JetBrains Mono Fallback', 'SF Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
