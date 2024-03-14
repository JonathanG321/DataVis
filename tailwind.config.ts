import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      height: {
        "200": "50rem",
        "180": "45rem",
        "160": "40rem",
        "140": "35rem",
        "120": "30rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
