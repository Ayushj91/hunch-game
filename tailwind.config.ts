import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        card: "var(--card)",
        "card-solid": "var(--card-solid)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-bold": "var(--line-bold)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        bull: "var(--bull)",
        "bull-soft": "var(--bull-soft)",
        cow: "var(--cow)",
        "cow-soft": "var(--cow-soft)",
        violet: "var(--violet)",
        "violet-soft": "var(--violet-soft)",
      },
      borderRadius: {
        DEFAULT: "14px",
        lg: "20px",
      },
      maxWidth: {
        screen: "620px",
        game: "660px",
      },
    },
  },
  plugins: [],
};

export default config;
