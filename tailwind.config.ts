import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "main-color": "#7f5a9d",
        "main-dark-color": "#6c3b8a",
        "main-pale-color": "#ccaed0",
        "yellow-color": "#dcbebe",
        "blue-color": "#b1bacb",
      },
      colors: {
        "main-color": "#7f5a9d",
        "main-dark-color": "#6c3b8a",
      },
      fontFamily: {
        Jua: ['Jua', 'sans-serif'],
      },
      // カスタムブレークポイント
      screens: {
        xs: '370px',
        smx: '500px',
      },
      // アニメーション
      animation: {
        unfoldIn: 'unfoldIn 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
      },
      keyframes: {
        unfoldIn: {
          '0%': { transform: 'scaleY(.005) scaleX(0)' },
          '50%': { transform: 'scaleY(.005) scaleX(1)' },
          '100%': { transform: 'scaleY(1) scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
