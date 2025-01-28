import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
      screens: {
        tab: "768px",
        laptop: "1280px",
        desk: "1500px",
        deskxl: "1920px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          md: "32px",
          xl: "80px",
          desk: "100px",
          deskxl: "240px",
        },
      },
      fontSize: {
        "10med": ["10px", { fontWeight: "500" }],
        "12med": ["12px", { fontWeight: "500" }],
        "12semi": ["12px", { fontWeight: "600" }],
        "12bold": ["12px", { fontWeight: "700" }],
        "14semi": ["14px", { fontWeight: "600" }],
        "14bold": ["14px", { fontWeight: "700" }],
        "16med": ["16px", { fontWeight: "500" }],
        "16semi": ["16px", { fontWeight: "600" }],
        "18reg": ["18px", { fontWeight: "400" }],
        "18med": ["18px", { fontWeight: "500" }],
        "18semi": ["18px", { fontWeight: "600" }],
        "18bold": ["18px", { fontWeight: "700" }],
        "20med": ["20px", { fontWeight: "500" }],
        "20semi": ["20px", { fontWeight: "600" }],
        "20bold": ["20px", { fontWeight: "700" }],
        "22med": ["22px", { fontWeight: "500" }],
        "22bold": ["22px", { fontWeight: "700" }],
        "24med": ["24px", { fontWeight: "500" }],
        "24semi": ["24px", { fontWeight: "600" }],
        "24bold": ["24px", { fontWeight: "700" }],
        "28bold": ["28px", { fontWeight: "700" }],
        "32bold": ["32px", { fontWeight: "700" }],
        "36med": ["36px", { fontWeight: "500" }],
        "40bold": ["40px", { fontWeight: "700" }],
        "45bold": ["45px", { fontWeight: "700" }],
        "54bold": ["54px", { fontWeight: "700" }],
      },
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        yellow: "#FFB300",
        grey: "#A2A2A2",
        lightGrey: "#D9D9D9",
      },
      backgroundImage: {
        yellowGradient:
          "linear-gradient(115.41deg, #FFCC54 10.87%, #FFB300 81.45%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
