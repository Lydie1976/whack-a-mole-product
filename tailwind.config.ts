import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 70px rgba(77, 45, 23, 0.22)',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
};

export default config;
